// models/Doctor.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    age: Number
});

module.exports = mongoose.model('Patient', patientSchema);