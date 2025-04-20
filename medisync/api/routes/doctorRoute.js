// routes/doctor.js
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// POST /doctor/signup
router.post('/signup', async (req, res) => {
    const { name, email, password, speciality, city, hospital, experience, consultationFee } = req.body;
    try {
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) return res.status(400).json({ message: 'Doctor already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            speciality,
            city,
            hospital,
            experience,
            consultationFee
        });
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
        const doctor = await Doctor.findById(req.user.id)
            .select('-password')
            .populate('hospital');
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// GET doctors by city
router.get('/city/:city', async (req, res) => {
    try {
        const doctors = await Doctor.find({ city: req.params.city })
            .select('-password')
            .populate('hospital');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching doctors' });
    }
});

// GET doctors by speciality
router.get('/speciality/:speciality', async (req, res) => {
    try {
        const doctors = await Doctor.find({ speciality: req.params.speciality })
            .select('-password')
            .populate('hospital');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching doctors' });
    }
});

// GET all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .select('-password')
            .populate('hospital');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching doctors' });
    }
});

module.exports = router;