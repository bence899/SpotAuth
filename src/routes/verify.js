const express = require('express');
const router = express.Router();
const catalog = require('../../data/catalog.json');

//Verify Track Metadata
router.post('/', (req,res) =>{
    const {title, aritst, duration} = req.body;

    const track = catalog.find(
        t => t.title === title && t.artist === artist && t.duration === duration
    );

    if(track) return res.status(200).json({valid: true, track});
    return res.status(400).json({valid: false, message: 'Track metadata not found'});
});

module.exports = router;
