import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const MB_API_URL = 'https://musicbrainz.org/ws/2';
const APP_NAME = 'SpotAuth-Lite';
const VERSION = '1.0.0';

const USER_AGENT = `${APP_NAME}/${VERSION}`;

const mbClient = rateLimit(axios.create({
    baseURL: MB_API_URL,
    headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
    }
}), { maxRequests: 1, perMilliseconds: 1000 });

export async function searchRecording(title: string, artist: string) {
    try {
        const response = await mbClient.get('/recording', {
            params: {
                query: `recording:"${title}" AND artistname:"${artist}"`,
                fmt: 'json',
                limit: 10
            }
        });

        const recordings = response.data.recordings || [];
        const found = recordings.some((recording: any) => {
            const titleMatch = recording.title?.toLowerCase().includes(title.toLowerCase());
            const artistMatch = recording['artist-credit']?.some((credit: any) => 
                credit.name?.toLowerCase().includes(artist.toLowerCase())
            );
            
            return titleMatch && artistMatch;
        });

        console.log('MusicBrainz search results:', {
            query: `recording:"${title}" AND artistname:"${artist}"`,
            recordingsFound: recordings.length,
            found
        });

        return {
            found,
            recordings,
            confidence: found ? 0.7 : 0.2
        };
    } catch (error) {
        console.error('MusicBrainz API error:', error);
        return {
            found: false,
            recordings: [],
            confidence: 0,
            error: 'Failed to check with MusicBrainz'
        };
    }
} 