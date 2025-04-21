const express = require('express');
const router = express.Router();
const axios = require('axios');

const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

router.get('/search', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ message: 'City parameter is required' });
        }

        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/textsearch/json`,
            {
                params: {
                    query: `hospitals in ${city}`,
                    key: GOOGLE_MAPS_API_KEY
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ message: 'Error fetching hospitals' });
    }
});

module.exports = router;
