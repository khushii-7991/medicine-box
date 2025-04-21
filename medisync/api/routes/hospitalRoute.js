const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const auth = require('../middleware/auth');

// Get all hospitals
router.get('/', async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get hospitals by city
router.get('/city/:city', async (req, res) => {
    try {
        const hospitals = await Hospital.find({ city: req.params.city });
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new hospital (protected route - only admin should be able to add hospitals)
router.post('/', auth, async (req, res) => {
    const hospital = new Hospital({
        name: req.body.name,
        city: req.body.city,
        address: req.body.address,
        contactNumber: req.body.contactNumber
    });

    try {
        const newHospital = await hospital.save();
        res.status(201).json(newHospital);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
