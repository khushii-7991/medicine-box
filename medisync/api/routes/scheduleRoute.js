// routes/scheduleRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getSchedule,
    updateStatus
} = require('../controller/scheduleController');

// // GET schedule for a prescription
 router.get('/:id/schedule', auth, getSchedule);

// // POST update status (taken/skipped/partiaal)
 router.post('/update-status', auth, updateStatus);

module.exports = router;