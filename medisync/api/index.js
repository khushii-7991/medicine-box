const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const doctorRoutes = require('./routes/doctorRoute');
const patientRouter = require('./routes/patientRoute');
const prescriptionRouter = require('./routes/prescriptionRoute');
const scheduleRoutes = require('./routes/scheduleRoute');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No content response for favicon
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'MediSync API is running',
        endpoints: {
            doctors: '/doctor',
            patients: '/patient',
            prescriptions: '/prescription',
            schedule: '/api/schedule'
        }
    });
});

// Routes
app.use('/doctor', doctorRoutes);
app.use('/patient', patientRouter);
app.use('/prescription', prescriptionRouter);
app.use('/schedule', scheduleRoutes);

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/medwise')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));