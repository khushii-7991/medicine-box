const express = require('express');
const router = express.Router();
const Prescription = require('../models/prescriptionModel');
const auth = require('../middleware/auth');
const { createSchedule } = require('../controller/scheduleController');


router.post('/create', auth, async (req, res) => {
    try {
        const { patientId, medicines, notes, duration } = req.body;

        const prescription = new Prescription({
            doctorId: req.user.id,
            patientId,
            medicines,
            notes,
            duration
        });

        await prescription.save();

        createSchedule(patientId, medicines, duration);

        res.status(201).json({ message: "Prescription saved", prescription });
    } catch (err) {
        res.status(500).json({ message: "Error saving prescription", error: err });
    }
});

router.get('/doctor', auth, async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ doctorId: req.user.id });
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching prescriptions" });
    }
});

router.get('/patient/:name', async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patientName: req.params.name });
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching prescriptions" });
    }
});

module.exports = router;
