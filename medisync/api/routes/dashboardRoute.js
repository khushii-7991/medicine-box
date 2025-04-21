const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

// GET /dashboard/doctor - Get doctor's dashboard data
router.get('/doctor', auth, async (req, res) => {
    try {
        const doctorId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get all appointments for this doctor
        const appointments = await Appointment.find({ doctor: doctorId })
            .populate('patient', 'name email age lastLogin');

        // Calculate online patients (patients who logged in within the last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const onlinePatients = appointments
            .filter(appt => appt.patient.lastLogin > fiveMinutesAgo)
            .map(appt => ({
                id: appt.patient._id,
                name: appt.patient.name
            }));

        // Calculate weekly appointments
        const weeklyAppointments = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const count = appointments.filter(appt => {
                const apptDate = new Date(appt.date);
                return apptDate >= date && apptDate < nextDate;
            }).length;

            weeklyAppointments.push({
                name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
                appointments: count
            });
        }

        // Calculate patient demographics
        const patientDemographics = [
            { name: 'Under 18', value: 0 },
            { name: '18-30', value: 0 },
            { name: '31-50', value: 0 },
            { name: 'Over 50', value: 0 }
        ];

        appointments.forEach(appt => {
            const age = appt.patient.age;
            if (age < 18) patientDemographics[0].value++;
            else if (age <= 30) patientDemographics[1].value++;
            else if (age <= 50) patientDemographics[2].value++;
            else patientDemographics[3].value++;
        });

        // Calculate consultation types
        const consultationTypes = {
            general: appointments.filter(appt => appt.reason.toLowerCase().includes('general')).length,
            specialist: appointments.filter(appt => appt.reason.toLowerCase().includes('specialist')).length,
            emergency: appointments.filter(appt => appt.reason.toLowerCase().includes('emergency')).length,
            followUps: appointments.filter(appt => appt.reason.toLowerCase().includes('follow')).length
        };

        // Calculate patient distribution
        const newPatients = new Set();
        const regularPatients = new Set();
        const followUpPatients = new Set();

        appointments.forEach(appt => {
            const patientId = appt.patient._id.toString();
            if (appt.reason.toLowerCase().includes('follow')) {
                followUpPatients.add(patientId);
            } else if (appointments.filter(a => a.patient._id.toString() === patientId).length > 1) {
                regularPatients.add(patientId);
            } else {
                newPatients.add(patientId);
            }
        });

        res.json({
            onlinePatients,
            weeklyAppointments,
            patientDemographics,
            consultationTypes,
            newPatients: newPatients.size,
            regularCheckups: regularPatients.size,
            followUps: followUpPatients.size
        });
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
