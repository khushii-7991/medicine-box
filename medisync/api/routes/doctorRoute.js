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

        const token = jwt.sign({ id: doctor._id }, 'your_jwt_secret', { expiresIn: '7d' });

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

// GET doctors by search (speciality and/or city)
router.get('/search', async (req, res) => {
    try {
        const { speciality, city } = req.query;
        const query = {};
        
        // Use case-insensitive regex matching for more flexible searching
        if (speciality) query.speciality = new RegExp(speciality, 'i');
        if (city) query.city = new RegExp(city, 'i');
        
        console.log('Doctor search query:', query);
        
        const doctors = await Doctor.find(query)
            .select('-password')
            .populate('hospital');
        
        console.log(`Found ${doctors.length} doctors matching the criteria`);
        console.log(doctors);
            
        res.json(doctors);
    } catch (err) {
        console.error('Error searching doctors:', err);
        res.status(500).json({ message: 'Error searching doctors' });
    }
});

// GET /doctor/profile - Get doctor profile information
router.get('/profile', auth, async (req, res) => {
    try {
        const doctorId = req.user.id;
        console.log('Fetching profile for doctor ID:', doctorId);
        
        const doctor = await Doctor.findById(doctorId).select('-password');
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        res.json(doctor);
    } catch (err) {
        console.error('Error fetching doctor profile:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET doctor categories
router.get('/categories', async (req, res) => {
    try {
        // Get unique specialities from doctors collection
        const specialities = await Doctor.distinct('speciality');
        
        // Format them as categories
        const categories = specialities.map((speciality, index) => ({
            id: index + 1,
            name: speciality,
            description: `${speciality} specialist`,
            group: 'Available Specialities'
        }));
        
        res.json(categories);
    } catch (err) {
        console.error('Error fetching doctor categories:', err);
        res.status(500).json({ message: 'Error fetching doctor categories' });
    }
});

module.exports = router;