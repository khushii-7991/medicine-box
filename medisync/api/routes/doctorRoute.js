// routes/doctor.js
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// POST /doctor/signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) return res.status(400).json({ message: 'Doctor already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = new Doctor({ name, email, password: hashedPassword });
        await newDoctor.save();

        res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /doctor/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const doctor = await Doctor.findOne({ email });
        if (!doctor) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: doctor._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token, user: { id: doctor._id, name: doctor.name, email: doctor.email } });
    } catch (err) {
        res.status(500).json({ message: 'Login error' });
    }
});

// GET /doctor/profile (Protected route)
router.get('/profile', auth, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user.id).select('-password');
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

module.exports = router;