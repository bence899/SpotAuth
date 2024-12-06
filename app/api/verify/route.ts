import { NextResponse } from 'next/server';
import axios from 'axios';
import { searchRecording } from '@/app/lib/musicbrainz';
import { SpotifyArtist, SpotifyTrack } from '@/app/types/spotify';
import { contentPatterns } from '@/app/config/aiPatterns';

function analyzeMetadata(searchTitle: string, searchArtist: string, foundTitle: string, foundArtist: string): number {
    let score = 1.0;
    
    // Exact match check
    if (searchTitle.toLowerCase() !== foundTitle.toLowerCase()) {
        score -= 0.4;
    }
    
    if (searchArtist.toLowerCase() !== foundArtist.toLowerCase()) {
        score -= 0.4;
    }
    
    return Math.max(0, score);
}

interface ServiceResults {
    shazam: {
        found: boolean;
        confidence: number;
        totalResults?: number;
        error?: string;
    };
    musicBrainz: {
        found: boolean;
        confidence: number;
        recordings?: any[];
        error?: string;
    };
}

function calculateDatabaseConfidence(results: ServiceResults): number {
    // Define weights for each service
    const weights = {
        spotify: 0.3,  // 30%
        shazam: 0.4,   // 40%
        musicBrainz: 0.3  // 30%
    };

    let confidence = 0;
    
    // Add Spotify base confidence (always present)
    confidence += weights.spotify;
    
    // Add Shazam confidence if found
    if (results.shazam.found) {
        confidence += weights.shazam;
    }
    
    // Add MusicBrainz confidence if found
    if (results.musicBrainz.found) {
        confidence += weights.musicBrainz;
    }

    // Example calculation for your case:
    // Spotify (always): 0.3
    // Shazam (found): 0.4
    // MusicBrainz (not found): 0
    // Total: 0.7 * 1.2 = 0.84 (84%)
    
    // Apply a multiplier based on number of sources found
    const sourcesFound = [true, results.shazam.found, results.musicBrainz.found].filter(Boolean).length;
    const multiplier = 1 + ((sourcesFound - 1) * 0.2); // 1.0, 1.2, or 1.4 based on sources
    
    return Math.round((confidence * multiplier) * 100) / 100; // Round to 2 decimal places
}

async function checkWithShazam(title: string, artist: string) {
    if (!process.env.RAPIDAPI_KEY) {
        throw new Error('RAPIDAPI_KEY is not configured');
    }

    const options = {
        method: 'GET',
        url: 'https://shazam.p.rapidapi.com/search',
        params: {
            term: `${title} ${artist}`,
            locale: 'en-US',
            offset: '0',
            limit: '5'
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const tracks = response.data?.tracks?.hits || [];
        
        // Improved matching logic
        const found = tracks.some((hit: ShazamTrack) => {
            if (!hit?.track) return false;
            
            const trackTitle = hit.track.title?.toLowerCase() || '';
            const trackArtist = hit.track.subtitle?.toLowerCase() || '';
            const searchTitle = title.toLowerCase();
            const searchArtist = artist.toLowerCase();
            
            const titleMatch = compareSimilarity(trackTitle, searchTitle);
            const artistMatch = compareSimilarity(trackArtist, searchArtist);
            
            return titleMatch && artistMatch;
        });

        console.log('Shazam search results:', {
            searchTerm: `${title} ${artist}`,
            tracksFound: tracks.length,
            found
        });

        return {
            found,
            confidence: found ? 0.8 : 0.2,
            totalResults: tracks.length
        };
    } catch (error) {
        console.error('Shazam API error:', error);
        return {
            found: false,
            confidence: 0,
            totalResults: 0,
            error: 'Failed to check with Shazam'
        };
    }
}

// Reuse the same similarity comparison function
function compareSimilarity(str1: string, str2: string): boolean {
    const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '');
    const s1 = normalize(str1);
    const s2 = normalize(str2);
    return s1.includes(s2) || s2.includes(s1);
}

function calculateOverallConfidence(results: ServiceResults, metadataScore: number, aiAnalysisScore: number): number {
    const safeMetadataScore = metadataScore || 0;
    const safeAiScore = aiAnalysisScore || 0;
    
    const weights = {
        aiAnalysis: 0.5,
        metadata: 0.2,
        database: 0.3
    };
    
    const aiConfidence = 1 - safeAiScore;
    const aiComponent = weights.aiAnalysis * aiConfidence;
    const metadataComponent = weights.metadata * safeMetadataScore;
    const dbComponent = weights.database * calculateDatabaseConfidence(results);
    
    const totalConfidence = aiComponent + metadataComponent + dbComponent;
    return Math.round(totalConfidence * 100) / 100;
}

interface AIAnalysisResult {
    score: number;
    patterns: string[];
}

function analyzeAIPatterns(track: SpotifyTrack): AIAnalysisResult {
    let aiPatternScore = 0;
    const patterns: string[] = [];

    // Check metadata patterns
    contentPatterns.metadata.forEach(({ pattern, weight, description }) => {
        if (pattern.test(track.name) || pattern.test(track.artists[0].name)) {
            aiPatternScore += weight;
            patterns.push(description);
        }
    });

    // Check artist profile patterns
    Object.values(contentPatterns.artistProfile).forEach(({ condition, weight, description }) => {
        if (condition(track.artists[0])) {
            aiPatternScore += weight;
            patterns.push(description);
        }
    });

    return {
        score: Math.min(1, aiPatternScore),
        patterns: patterns.length > 0 ? patterns : ['No suspicious patterns detected']
    };
}

interface ArtistMetadataAnalysis {
    score: number;
    patterns: string[];
}

async function analyzeArtistMetadata(artist: SpotifyArtist): Promise<ArtistMetadataAnalysis> {
    let suspiciousScore = 0;
    const patterns: string[] = [];

    // Only flag if both conditions are met: low followers AND low popularity
    if (artist.followers && artist.followers.total < 100 && (!artist.popularity || artist.popularity < 20)) {
        suspiciousScore += 0.3;
        patterns.push('Limited artist history');
    }

    // Check for unusual popularity/follower ratio
    if (artist.followers && artist.popularity) {
        const followersToPopularityRatio = artist.followers.total / artist.popularity;
        if (followersToPopularityRatio < 1 && artist.followers.total < 1000) {
            suspiciousScore += 0.4;
            patterns.push('Unusual popularity/follower ratio');
        }
    }

    // Check social media presence
    if (!artist.external_urls || Object.keys(artist.external_urls).length < 2) {
        suspiciousScore += 0.2;
        patterns.push('Limited social media presence');
    }

    // Only check release history if albums data is available
    if (artist.albums?.items && artist.albums.items.length > 0) {
        const releases = artist.albums.items;
        const sortedReleases = releases.sort((a, b) => 
            new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        );
        
        const last30Days = sortedReleases.filter(release => {
            const releaseDate = new Date(release.release_date);
            const daysSinceRelease = (new Date().getTime() - releaseDate.getTime()) / (1000 * 3600 * 24);
            return daysSinceRelease <= 30;
        });

        if (last30Days.length > 3) {
            suspiciousScore += 0.5;
            patterns.push('Unusual burst of releases');
        }
    }

    return {
        score: Math.min(1, suspiciousScore),
        patterns
    };
}

export async function POST(req: Request) {
    try {
        const { query, token } = await req.json();
        
        if (!query) {
            throw new Error('Search query is required');
        }
        
        if (!token) {
            throw new Error('Please connect with Spotify first');
        }

        // Search track using Spotify's search endpoint
        const spotifyResponse = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const track = spotifyResponse.data.tracks.items[0];
        if (!track) {
            throw new Error('Track not found on Spotify');
        }

        // Extract title and artist for analysis
        const title = track.name;
        const artist = track.artists[0].name;

        // Run all our analysis functions
        const metadataScore = analyzeMetadata(query, '', title, artist);
        const aiAnalysis = analyzeAIPatterns(track);
        const artistAnalysis = await analyzeArtistMetadata(track.artists[0]);
        const unusualPatterns = getUnusualPatterns(title, artist);

        // Get results from other services
        const [shazamResult, mbResult] = await Promise.all([
            checkWithShazam(title, artist),
            searchRecording(title, artist)
        ]);

        // Calculate database confidence
        const databaseConfidence = calculateDatabaseConfidence({
            shazam: shazamResult,
            musicBrainz: mbResult,
        });

        const overallConfidence = calculateOverallConfidence({
            shazam: shazamResult,
            musicBrainz: mbResult,
        }, metadataScore, aiAnalysis.score);

        return NextResponse.json({
            valid: true,
            confidence: overallConfidence,
            track: {
                title,
                artist,
                previewUrl: track.preview_url,
                albumArt: track.album.images[0]?.url,
                duration: msToMinutesAndSeconds(track.duration_ms)
            },
            details: {
                metadataScore,
                databaseConfidence,
                aiPatternScore: aiAnalysis.score,
                aiPatterns: [...aiAnalysis.patterns, ...unusualPatterns],
                artistPatterns: artistAnalysis.patterns,
                sources: {
                    spotify: true,
                    shazam: shazamResult.found,
                    musicBrainz: mbResult.found
                }
            }
        });

    } catch (error) {
        return NextResponse.json({
            valid: false,
            confidence: 0,
            error: error instanceof Error ? error.message : 'Verification failed'
        }, { status: 400 });
    }
}

function getUnusualPatterns(title: string, artist: string): string[] {
    const patterns = [];
    
    // Check title patterns
    if (title.length > 100) patterns.push('Unusually long title');
    if (/(.)\1{5,}/.test(title)) patterns.push('Repetitive character patterns in title');
    if (!/[aeiouáéíóúàìòùäëïöüāēīōū]/i.test(title)) patterns.push('Title lacks vowels');
    if (/\d{4,}/.test(title)) patterns.push('Title contains unusual number sequences');
    
    // Check artist patterns
    if (artist.length < 2) patterns.push('Unusually short artist name');
    if (/^[A-Z0-9_]+$/.test(artist)) patterns.push('Artist name uses only uppercase and numbers');
    if (/AI|Bot|Generated|Neural/i.test(artist)) patterns.push('Artist name contains AI-related terms');
    
    return patterns;
}

function msToMinutesAndSeconds(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
}

interface ShazamTrack {
    track: {
        title: string;
        subtitle: string;
    }
}