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
        console.log(`Fetching active prescriptions for patient ID: ${req.params.patientId}`);
        console.log(`User ID from token: ${req.user.id}`);
        
        // Get all prescriptions for this patient
        const prescriptions = await Prescription.find({
            patientId: req.params.patientId
        }).populate('doctorId', 'name');
        
        console.log(`Found ${prescriptions.length} total prescriptions for patient`);
        
        // If no prescriptions found, return empty array instead of error
        if (!prescriptions || prescriptions.length === 0) {
            console.log('No prescriptions found for this patient');
            return res.json([]);
        }
        
        // Get current date
        const currentDate = new Date();
        console.log(`Current date for comparison: ${currentDate.toISOString()}`);
        
        // Filter prescriptions based on duration (similar to how we fixed the schedule issue)
        const activePrescriptions = prescriptions.filter(prescription => {
            try {
                // Get the prescription creation date
                const prescriptionDate = new Date(prescription.createdAt);
                console.log(`Prescription ${prescription._id} created at: ${prescriptionDate.toISOString()}`);
                
                // Calculate end date by adding duration in days
                const endDate = new Date(prescriptionDate);
                endDate.setDate(prescriptionDate.getDate() + prescription.duration);
                console.log(`Prescription ${prescription._id} ends at: ${endDate.toISOString()}`);
                
                // Compare year, month, and day components individually instead of timestamps
                const isActive = (
                    endDate.getFullYear() > currentDate.getFullYear() ||
                    (endDate.getFullYear() === currentDate.getFullYear() &&
                        endDate.getMonth() > currentDate.getMonth()) ||
                    (endDate.getFullYear() === currentDate.getFullYear() &&
                        endDate.getMonth() === currentDate.getMonth() &&
                        endDate.getDate() >= currentDate.getDate())
                );
                
                console.log(`Prescription ${prescription._id} is active: ${isActive}`);
                return isActive;
            } catch (err) {
                console.error(`Error processing prescription ${prescription._id}:`, err);
                return false; // Skip this prescription if there's an error
            }
        });
        
        console.log(`Returning ${activePrescriptions.length} active prescriptions`);
        return res.status(200).json(activePrescriptions);
    } catch (err) {
        console.error('Error fetching active prescriptions:', err);
        return res.status(500).json({ message: "Error fetching active prescriptions", error: err.message });
    }
});

module.exports = router;
