const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

// POST /appointment/create - Create a new appointment request
router.post('/create', auth, async (req, res) => {
    try {
        const { doctorId, date, time, isFlexibleTiming, reason } = req.body;
        const patientId = req.user.id;

        // Validate doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Create new appointment
        const newAppointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date,
            time,
            isFlexibleTiming,
            reason,
            status: 'pending'
        });

        await newAppointment.save();
        res.status(201).json({ 
            message: 'Appointment request created successfully',
            appointment: newAppointment
        });
    } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /appointment/doctor - Get all appointments for a doctor
router.get('/doctor', auth, async (req, res) => {
    try {
        const doctorId = req.user.id;
        
        const appointments = await Appointment.find({ doctor: doctorId })
            .populate('patient', 'name email age')
            .sort({ date: 1, time: 1 });
        
        res.json(appointments);
    } catch (err) {
        console.error('Error fetching doctor appointments:', err);
        res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
});

// GET /appointment/patient - Get all appointments for a patient
router.get('/patient', auth, async (req, res) => {
    try {
        const patientId = req.user.id;
        
        const appointments = await Appointment.find({ patient: patientId })
            .populate('doctor', 'name speciality consultationFee')
            .sort({ date: 1, time: 1 });
        
        res.json(appointments);
    } catch (err) {
        console.error('Error fetching patient appointments:', err);
        res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
});

// PUT /appointment/:id/status - Update appointment status (for doctors)
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status, notes } = req.body;
        const appointmentId = req.params.id;
        const doctorId = req.user.id;

        // Find the appointment and check if it belongs to this doctor
        const appointment = await Appointment.findById(appointmentId);
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        if (appointment.doctor.toString() !== doctorId) {
            return res.status(403).json({ message: 'Not authorized to update this appointment' });
        }

        // Update appointment status
        appointment.status = status;
        if (notes) {
            appointment.notes = notes;
        }
        
        await appointment.save();
        
        res.json({ 
            message: 'Appointment status updated successfully',
            appointment
        });
    } catch (err) {
        console.error('Error updating appointment status:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /appointment/:id/cancel - Cancel appointment (for patients)
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const patientId = req.user.id;

        // Find the appointment and check if it belongs to this patient
        const appointment = await Appointment.findById(appointmentId);
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        if (appointment.patient.toString() !== patientId) {
            return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
        }

        // Cancel the appointment
        appointment.status = 'cancelled';
        await appointment.save();
        
        res.json({ 
            message: 'Appointment cancelled successfully',
            appointment
        });
    } catch (err) {
        console.error('Error cancelling appointment:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /appointment/:id - Get appointment details
router.get('/:id', auth, async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const userId = req.user.id;

        const appointment = await Appointment.findById(appointmentId)
            .populate('patient', 'name email age')
            .populate('doctor', 'name speciality consultationFee');
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        // Check if the user is either the patient or the doctor for this appointment
        if (appointment.patient._id.toString() !== userId && 
            appointment.doctor._id.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to view this appointment' });
        }
        
        res.json(appointment);
    } catch (err) {
        console.error('Error fetching appointment details:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
