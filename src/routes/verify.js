const express = require('express');
const router = express.Router();
const axios = require('axios');

// Verify Track Metadata against Spotify
router.post('/', async (req, res) => {
    const { query } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            valid: false,
            message: 'Missing authorization token'
        });
    }

    try {
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
            
            return res.json({
                valid: !isAIGenerated,
                track: {
                    title: track.name,
                    artist: track.artists[0].name,
                    previewUrl: track.preview_url
                },
                message: isAIGenerated 
                    ? 'This track shows patterns of AI generation' 
                    : 'Track appears to be legitimate'
            });
        }
        
        return res.json({
            valid: false,
            message: 'Track not found'
        });
    } catch (error) {
        console.error('Spotify API Error:', error);
        return res.status(500).json({
            valid: false,
            message: 'Error searching track'
        });
    }
});

// Helper function to check for AI patterns
function checkForAIPatterns(title, artist) {
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

function msToMinutesAndSeconds(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
}

module.exports = router;
