import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to check for AI patterns
function checkForAIPatterns(title: string, artist: string) {
    const aiKeywords = [
        'AI', 'Generated', 'Neural', 'Deep Learning', 'GPT',
        'Heart on My Sleeve', // Known AI-generated track
        'Ghostwriter', // Common AI music maker term
        'Drake AI', 'AI Drake', // AI versions of artists
        'Synthetic', 'Computer Generated'
    ];
    
    const titleLower = title.toLowerCase();
    const artistLower = artist.toLowerCase();
    
    return aiKeywords.some(keyword => 
        titleLower.includes(keyword.toLowerCase()) ||
        artistLower.includes(keyword.toLowerCase())
    );
}

function msToMinutesAndSeconds(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
}

export async function POST(req: Request) {
    try {
        const { query } = await req.json();
        const token = req.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json(
                { valid: false, message: 'Missing authorization token' },
                { status: 401 }
            );
        }

        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            params: {
                q: query,
                type: 'track',
                limit: 1
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const track = response.data.tracks.items[0];
        
        if (track) {
            const isAIGenerated = checkForAIPatterns(track.name, track.artists[0].name);
            
            return NextResponse.json({
                valid: !isAIGenerated,
                track: {
                    title: track.name,
                    artist: track.artists[0].name,
                    previewUrl: track.preview_url,
                    duration: msToMinutesAndSeconds(track.duration_ms)
                },
                message: isAIGenerated 
                    ? 'This track shows patterns of AI generation' 
                    : 'Track appears to be legitimate'
            });
        }
        
        return NextResponse.json({
            valid: false,
            message: 'Track not found'
        });
    } catch (error) {
        console.error('Spotify API Error:', error);
        return NextResponse.json(
            { valid: false, message: 'Error searching track' },
            { status: 500 }
        );
    }
} 