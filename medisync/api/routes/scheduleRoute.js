// routes/scheduleRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getPatientSchedules,
    getTodaySchedule,
    updateDoseStatus,
    getScheduleStats
} = require('../controller/scheduleController');

// Get all schedules for a patient
router.get('/patient', auth, getPatientSchedules);
router.get('/patient/:patientId', auth, getPatientSchedules);

// Get today's schedule for a patient
router.get('/today', auth, getTodaySchedule);
router.get('/today/:patientId', auth, getTodaySchedule);

// Update medication dose status
router.post('/update-dose', auth, updateDoseStatus);

// Get schedule statistics for a patient
router.get('/stats', auth, getScheduleStats);
router.get('/stats/:patientId', auth, getScheduleStats);

module.exports = router;