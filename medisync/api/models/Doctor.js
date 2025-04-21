// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    experience: {
        type: Number,
        default: 0
    },
    consultationFee: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
