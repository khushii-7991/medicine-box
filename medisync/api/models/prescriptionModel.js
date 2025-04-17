const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    medicines: [{
        name: String,
        dosage: String,
        timings: [ String ]
    }],
    duration: Number, // (in days)
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
