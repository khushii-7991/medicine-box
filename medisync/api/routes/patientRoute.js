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

// POST /patient/login
patientRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const patient = await Patient.findOne({ email });
        if (!patient) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: patient._id }, 'your_jwt_secret', { expiresIn: '1h' });

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