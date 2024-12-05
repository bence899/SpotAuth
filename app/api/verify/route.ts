import { NextResponse } from 'next/server';
import axios from 'axios';
import { searchRecording } from '@/app/lib/musicbrainz';

function analyzeMetadata(title: string, artist: string): number {
    let score = 1.0;
    
    // Check for unusual patterns that might indicate AI generation
    const unusualPatterns = [
        // Extremely long or short titles
        title.length < 2 || title.length > 100,
        // Repeated characters
        /(.)\1{4,}/.test(title),
        // Random number sequences
        /\d{4,}/.test(title),
        // Unusual character combinations
        /[^a-zA-Z0-9\s\-'.,&!?]/.test(title),
        // Lack of vowels
        !/[aeiou]/i.test(title),
        // Excessive punctuation
        (title + artist).split('').filter(char => /[!?.,]/.test(char)).length > 3
    ];
    
    // Reduce score for each unusual pattern
    score -= (unusualPatterns.filter(Boolean).length * 0.2);
    
    return Math.max(0, score);
}

function calculateDatabaseConfidence(shazamResult: any, mbResult: any): number {
    // Weight the confidence based on presence in databases
    const shazamWeight = shazamResult.found ? 0.6 : 0;
    const mbWeight = mbResult.found ? 0.4 : 0;
    return shazamWeight + mbWeight;
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

async function checkWithShazam(title: string, artist: string) {
    if (!process.env.RAPIDAPI_KEY) {
        throw new Error('RAPIDAPI_KEY is not configured');
    }

    const options = {
        method: 'GET',
        url: 'https://shazam.p.rapidapi.com/search',
        params: { term: `${title} ${artist}` },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const tracks = response.data?.tracks?.hits || [];
        
        // Check if the track exists in Shazam's database with null checks
        const found = tracks.some((hit: ShazamTrack) => {
            if (!hit?.track?.title || !hit?.track?.subtitle) return false;
            
            const trackTitle = hit.track.title.toLowerCase();
            const trackArtist = hit.track.subtitle.toLowerCase();
            
            return trackTitle.includes(title.toLowerCase()) && 
                   trackArtist.includes(artist.toLowerCase());
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

async function checkAcousticFingerprint(audioUrl: string) {
    const response = await axios.post('https://api.acoustid.org/v2/lookup', {
        client: process.env.ACOUSTID_API_KEY,
        meta: 'recordings',
        fingerprint: audioUrl
    });
    return response.data;
}

export async function POST(req: Request) {
    try {
        const { title, artist } = await req.json();
        
        // Check multiple music databases in parallel
        const [shazamResult, mbResult] = await Promise.all([
            checkWithShazam(title, artist),
            searchRecording(title, artist)
        ]);

        // Calculate confidence based on database presence
        const databaseConfidence = calculateDatabaseConfidence(shazamResult, mbResult);
        
        // Analyze metadata patterns
        const metadataScore = analyzeMetadata(title, artist);
        
        // Combined analysis
        const confidence = (databaseConfidence + metadataScore) / 2;
        const isLegitimate = confidence > 0.5;

        return NextResponse.json({
            valid: isLegitimate,
            confidence,
            sources: {
                shazam: shazamResult.found,
                musicBrainz: mbResult.found,
                metadataAnalysis: metadataScore > 0.5
            },
            message: isLegitimate 
                ? 'Track appears to be legitimate' 
                : 'Track shows unusual patterns or limited presence in music databases',
            details: {
                shazamResults: shazamResult.totalResults,
                musicBrainzResults: mbResult.recordings?.length || 0,
                metadataScore
            }
        });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed' }, 
            { status: 500 }
        );
    }
} 