const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    medicines: [{
        name: {
            type: String,
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        timings: [{
            type: String,
            required: true
        }],
        whenToTake: {
            type: String,
            enum: ['before_meal', 'after_meal'],
            default: 'after_meal',
            required: true
        }
    }],
    duration: {
        type: Number,
        required: true
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
