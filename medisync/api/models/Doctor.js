// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

module.exports = mongoose.model('Doctor', doctorSchema);
