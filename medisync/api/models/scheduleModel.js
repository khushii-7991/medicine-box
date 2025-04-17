// models/Schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    date: { type: Date, required: true, default: Date.now },
    schedule: [{
        medicines: [
            {
                name: String,
                dosage: String,
                timings: [{
                    type: String
                }],
                status: {
                    type: String,
                    enum: ["pending", "taken", "skipped", "partial"],
                    default: "pending"
                }
            }
        ],
    }],
    duration: Number
});
module.exports = mongoose.model('Schedule', scheduleSchema);
