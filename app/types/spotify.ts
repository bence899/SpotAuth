export interface SpotifyArtist {
    name: string;
    genres?: string[];
    followers?: {
        total: number;
    };
    popularity?: number;
    external_urls?: {
        [key: string]: string;
    };
    albums?: {
        items: Array<{
            release_date: string;
            name: string;
        }>;
    };
}

export interface SpotifyTrack {
    name: string;
    artists: SpotifyArtist[];
    album?: {
        images: Array<{ url: string }>;
        release_date?: string;
    };
    popularity: number;
    preview_url: string | null;
    duration_ms: number;
}

export interface VerificationResult {
    valid: boolean;
    confidence: number;
    details: {
        metadataScore: number;
        databaseConfidence: number;
        aiPatternScore: number;
        aiPatterns: string[];
        musicBrainzRecordings?: number;
        shazamResults?: number;
        unusualPatterns?: string[];
        sources: {
            spotify: boolean;
            shazam: boolean;
            musicBrainz: boolean;
        };
        legitimateTrack?: string;
    };
    error?: string;
} 