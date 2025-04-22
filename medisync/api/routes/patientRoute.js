const express = require('express');
const patientRouter = express.Router();
const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// POST /patient/signup
patientRouter.post('/signup', async (req, res) => {
    const { name, email, password, age } = req.body;
    try {
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) return res.status(400).json({ message: 'Patient already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newPatient = new Patient({ name, email, password: hashedPassword, age });
        await newPatient.save();

        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /patient/search - Search patients by name (for doctors)
patientRouter.get('/search', auth, async (req, res) => {
    try {
        const { name } = req.query;
        
        if (!name || name.length < 2) {
            return res.status(400).json({ message: 'Search query must be at least 2 characters' });
        }
        
        // Create a case-insensitive regex for the name search
        const nameRegex = new RegExp(name, 'i');
        
        // Find patients matching the name
        const patients = await Patient.find({ name: nameRegex })
            .select('name email age')
            .limit(10);
            
        res.json(patients);
    } catch (err) {
        console.error('Error searching patients:', err);
        res.status(500).json({ message: 'Error searching patients', error: err.message });
    }
});

// GET /patient/all - Get all patients (for doctors)
patientRouter.get('/all', auth, async (req, res) => {
    try {
        // Check if the user is a doctor
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Access denied. Only doctors can view all patients.' });
        }
        
        // Find all patients with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const patients = await Patient.find({})
            .select('name email age gender bloodGroup lastVisit conditions')
            .skip(skip)
            .limit(limit)
            .sort({ name: 1 });
        
        // Get total count for pagination
        const total = await Patient.countDocuments({});
        
        res.json({
            patients,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).json({ message: 'Error fetching patients', error: err.message });
    }
});

// POST /patient/login
patientRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const patient = await Patient.findOne({ email });
        if (!patient) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Update last login time
        patient.lastLogin = new Date();
        await patient.save();

        const token = jwt.sign({ id: patient._id, role: 'patient' }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token, user: { id: patient._id, name: patient.name, email: patient.email } });
    } catch (err) {
        res.status(500).json({ message: 'Login error' });
    }
});

// GET /patient/profile (Protected route)
patientRouter.get('/profile', auth, async (req, res) => {
    try {
        const patient = await Patient.findById(req.user.id).select('-password');
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});



module.exports = patientRouter;