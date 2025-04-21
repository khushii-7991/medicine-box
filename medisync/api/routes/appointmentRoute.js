const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

// POST /appointment/create - Create a new appointment request
router.post('/create', auth, async (req, res) => {
    try {
        console.log('User data from token:', req.user);
        console.log('Request body:', req.body);
        
        const { doctorId, patientId, date, time, isFlexibleTiming, reason } = req.body;
        let finalDoctorId = doctorId;
        let finalPatientId = patientId;

        // Check if the request explicitly states it's from a doctor
        if (req.body.createdBy === 'doctor') {
            console.log('Request explicitly marked as from doctor');
            
            // Use the doctor ID from the token
            finalDoctorId = req.user.id;
            console.log('Using doctor ID from token:', finalDoctorId);
            
            // Validate patient exists
            if (!patientId) {
                return res.status(400).json({ message: 'Patient ID is required when doctor creates appointment' });
            }
            
            console.log('Validating patient ID:', patientId);
            const patient = await Patient.findById(patientId);
            if (!patient) {
                return res.status(404).json({ message: `Patient with ID ${patientId} not found` });
            }
            console.log('Patient found:', patient.name);
            finalPatientId = patientId;
            
        // If doctorId is provided in the request and matches the user's ID, it's a doctor
        } else if (doctorId && doctorId === req.user.id) {
            console.log('Doctor ID in request matches user ID');
            finalDoctorId = req.user.id;
            
            // Validate patient exists
            if (!patientId) {
                return res.status(400).json({ message: 'Patient ID is required when doctor creates appointment' });
            }
            
            console.log('Validating patient ID:', patientId);
            const patient = await Patient.findById(patientId);
            if (!patient) {
                return res.status(404).json({ message: `Patient with ID ${patientId} not found` });
            }
            console.log('Patient found:', patient.name);
            finalPatientId = patientId;
            
        // Check if user is a doctor by role or by checking the database
        } else {
            let isDoctor = req.user.role === 'doctor';
            
            if (!isDoctor) {
                try {
                    // Check if user exists in the Doctor collection
                    const doctorCheck = await Doctor.findById(req.user.id);
                    if (doctorCheck) {
                        console.log('User found in Doctor collection:', doctorCheck.name);
                        isDoctor = true;
                    }
                } catch (error) {
                    console.log('Error checking doctor:', error.message);
                }
            }
            
            console.log('Is user a doctor based on role/DB check?', isDoctor);
            
            if (isDoctor) {
                // Request is from doctor
                console.log('Request is from doctor with ID:', req.user.id);
                finalDoctorId = req.user.id;
                
                // Validate patient exists
                if (!patientId) {
                    return res.status(400).json({ message: 'Patient ID is required when doctor creates appointment' });
                }
                
                console.log('Validating patient ID:', patientId);
                const patient = await Patient.findById(patientId);
                if (!patient) {
                    return res.status(404).json({ message: `Patient with ID ${patientId} not found` });
                }
                console.log('Patient found:', patient.name);
                finalPatientId = patientId;
            } else {
                // Request is from patient
                console.log('Request is from patient with ID:', req.user.id);
                finalPatientId = req.user.id;
                
                // Validate doctor exists
                if (!doctorId) {
                    return res.status(400).json({ message: 'Doctor ID is required when patient creates appointment' });
                }
                
                const doctor = await Doctor.findById(doctorId);
                if (!doctor) {
                    return res.status(404).json({ message: 'Doctor not found' });
                }
                console.log('Doctor found:', doctor.name);
                finalDoctorId = doctorId;
            }
        }

        // Validate required fields
        if (!date || !time || !reason) {
            return res.status(400).json({ 
                message: 'Missing required fields', 
                required: ['date', 'time', 'reason'],
                received: { date, time, reason }
            });
        }

        // Create new appointment
        const newAppointment = new Appointment({
            patient: finalPatientId,
            doctor: finalDoctorId,
            date,
            time,
            isFlexibleTiming: isFlexibleTiming || false,
            reason,
            status: 'pending'
        });

        console.log('Creating appointment:', newAppointment);
        await newAppointment.save();
        
        // Populate patient and doctor info before returning
        const populatedAppointment = await Appointment.findById(newAppointment._id)
            .populate('patient', 'name email age')
            .populate('doctor', 'name speciality consultationFee');
            
        console.log('Appointment created successfully:', {
            id: populatedAppointment._id,
            patient: populatedAppointment.patient.name,
            doctor: populatedAppointment.doctor.name,
            date: populatedAppointment.date,
            status: populatedAppointment.status
        });
        
        res.status(201).json({ 
            message: 'Appointment request created successfully',
            appointment: populatedAppointment
        });
    } catch (err) {
        console.error('Error creating appointment:', err);
        // Check for MongoDB validation errors
        if (err.name === 'ValidationError') {
            const validationErrors = {};
            for (const field in err.errors) {
                validationErrors[field] = err.errors[field].message;
            }
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: validationErrors 
            });
        }
        // Check for MongoDB cast errors (invalid ID format)
        if (err.name === 'CastError') {
            return res.status(400).json({ 
                message: `Invalid ${err.path} format: ${err.value}` 
            });
        }
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

// GET /appointment/today-tomorrow - Get appointments for today and tomorrow for a doctor
router.get('/today-tomorrow', auth, async (req, res) => {
    try {
        const doctorId = req.user.id;
        
        // Get today's date at the start of the day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get tomorrow's date at the end of the day
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);
        
        console.log(`Fetching appointments for doctor ${doctorId} between ${today.toISOString()} and ${tomorrow.toISOString()}`);
        
        // Find appointments for today and tomorrow
        const appointments = await Appointment.find({
            doctor: doctorId,
            date: { $gte: today, $lte: tomorrow }
        })
        .populate('patient', 'name email age')
        .sort({ date: 1, time: 1 });
        
        console.log(`Found ${appointments.length} appointments for today and tomorrow`);
        
        res.json(appointments);
    } catch (err) {
        console.error('Error fetching today\'s and tomorrow\'s appointments:', err);
        res.status(500).json({ message: 'Error fetching appointments', error: err.message });
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

// DELETE /appointment/:id - Delete an appointment (for doctors)
router.delete('/:id', auth, async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const doctorId = req.user.id;

        // Find the appointment and check if it belongs to this doctor
        const appointment = await Appointment.findById(appointmentId);
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        if (appointment.doctor.toString() !== doctorId) {
            return res.status(403).json({ message: 'Not authorized to delete this appointment' });
        }

        // Delete the appointment
        await Appointment.findByIdAndDelete(appointmentId);
        
        res.json({ 
            message: 'Appointment deleted successfully',
            appointmentId
        });
    } catch (err) {
        console.error('Error deleting appointment:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
