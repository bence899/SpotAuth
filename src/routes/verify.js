const express = require('express');
const router = express.Router();
const axios = require('axios');

// Verify Track Metadata against Spotify
router.post('/', async (req, res) => {
    const { title, artist } = req.body;
    
    try {
        // Search Spotify for the track
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            params: {
                q: `track:${title} artist:${artist}`,
                type: 'track',
                limit: 1
            },
            headers: {
                'Authorization': `Bearer ${req.headers.authorization}`
            }
        });

        const tracks = response.data.tracks.items;
        
        if (tracks.length > 0) {
            // Found matching track
            const track = tracks[0];
            const isAIGenerated = checkForAIPatterns(track.name, track.artists[0].name);
            
            return res.json({
                valid: !isAIGenerated,
                track: {
                    title: track.name,
                    artist: track.artists[0].name,
                    duration: msToMinutesAndSeconds(track.duration_ms),
                    spotifyId: track.id,
                    previewUrl: track.preview_url
                },
                message: isAIGenerated ? 'Potential AI-generated content detected' : 'Track verified in Spotify catalog'
            });
        }
        
        return res.status(404).json({
            valid: false,
            message: 'Track not found in Spotify catalog'
        });
    } catch (error) {
        console.error('Spotify API Error:', error);
        return res.status(500).json({
            valid: false,
            message: 'Error validating track metadata'
        });
    }
});

// Helper function to check for AI patterns
function checkForAIPatterns(title, artist) {
    const aiKeywords = ['AI', 'Generated', 'Neural', 'Deep Learning', 'GPT'];
    return aiKeywords.some(keyword => 
        title.toLowerCase().includes(keyword.toLowerCase()) ||
        artist.toLowerCase().includes(keyword.toLowerCase())
    );
}

function msToMinutesAndSeconds(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
}

module.exports = router;
