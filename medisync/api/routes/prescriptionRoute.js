const express = require('express');
const router = express.Router();
const Prescription = require('../models/prescriptionModel');
const auth = require('../middleware/auth');
const { createSchedule } = require('../controller/scheduleController');

// Create a new prescription
router.post('/create', auth, async (req, res) => {
    try {
        const { patientId, medicines, notes, duration } = req.body;

        // Validate required fields
        if (!patientId || !medicines || !duration) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate medicines array
        if (!Array.isArray(medicines) || medicines.length === 0) {
            return res.status(400).json({ message: "At least one medicine is required" });
        }

        // Validate each medicine
        for (const medicine of medicines) {
            if (!medicine.name || !medicine.dosage || !medicine.timings) {
                return res.status(400).json({ message: "Invalid medicine data" });
            }
        }

        const prescription = new Prescription({
            doctorId: req.user.id,
            patientId,
            medicines,
            notes,
            duration
        });

        await prescription.save();

        // Create a schedule for this prescription
        try {
            const schedule = await createSchedule(prescription._id);
            
            // Send success response with both prescription and schedule
            res.status(201).json({
                message: "Prescription created successfully with schedule",
                prescription,
                schedule
            });
        } catch (scheduleErr) {
            console.error('Error creating schedule:', scheduleErr);
            
            // Still return success for prescription, but note schedule error
            res.status(201).json({
                message: "Prescription created successfully, but schedule creation failed",
                prescription,
                scheduleError: scheduleErr.message
            });
        }
    } catch (err) {
        console.error('Error creating prescription:', err);
        res.status(500).json({ message: "Error creating prescription" });
    }
});

// Get prescriptions for a doctor
router.get('/doctor', auth, async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ doctorId: req.user.id })
            .populate('patientId', 'name email')
            .sort({ createdAt: -1 });
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching prescriptions" });
    }
});

// Get prescriptions for a patient
router.get('/patient/:patientId', auth, async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patientId: req.params.patientId })
            .populate('doctorId', 'name')
            .sort({ createdAt: -1 });
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching prescriptions" });
    }
});

// Get all active prescriptions for a patient (not expired based on duration)
router.get('/patient/:patientId/active', auth, async (req, res) => {
    try {
        const prescriptions = await Prescription.find({
            patientId: req.params.patientId,
            createdAt: {
                $gte: new Date(Date.now() - 24*60*60*1000) // Within last 24 hours
            }
        }).populate('doctorId', 'name');

        // Filter prescriptions based on duration
        const activePrescriptions = prescriptions.filter(prescription => {
            const endDate = new Date(prescription.createdAt);
            endDate.setDate(endDate.getDate() + prescription.duration);
            return endDate >= new Date();
        });

        res.json(activePrescriptions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching active prescriptions" });
    }
});

module.exports = router;
