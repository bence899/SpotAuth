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
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.MB_CLIENT_ID}:${process.env.MB_CLIENT_SECRET}`
    }
}), { maxRequests: 1, perMilliseconds: 1000 });

export async function searchRecording(title: string, artist: string) {
    try {
        const response = await mbClient.get('/recording', {
            params: {
                query: `recording:"${title}" AND artist:"${artist}"`,
                fmt: 'json'
            }
        });

        return {
            found: response.data.count > 0,
            recordings: response.data.recordings,
            confidence: response.data.count > 0 ? 0.7 : 0.2
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