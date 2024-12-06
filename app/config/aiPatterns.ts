import { SpotifyArtist } from '@/app/types/spotify';

export const contentPatterns = {
    metadata: [
        {
            pattern: /AI|Generated|Neural|Bot/i,
            weight: 0.3,
            description: 'AI-related terms in metadata'
        },
        {
            pattern: /^[A-Z0-9_]+$/,
            weight: 0.2,
            description: 'All caps/numbers pattern'
        }
    ],
    artistProfile: {
        limitedHistory: {
            condition: (artist: SpotifyArtist) => {
                const followerCount = artist.followers?.total ?? 0;
                return followerCount < 100 && (!artist.popularity || artist.popularity < 20);
            },
            weight: 0.3,
            description: 'Limited artist history'
        }
    }
}; 