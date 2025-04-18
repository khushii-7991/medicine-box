// models/Schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    patientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient', 
        required: true 
    },
    prescriptionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Prescription', 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    duration: { 
        type: Number, 
        required: true 
    },
    dailySchedule: [{
        date: { 
            type: Date, 
            required: true 
        },
        medicines: [{
            medicineId: {
                type: String,
                required: true
            },
            name: { 
                type: String, 
                required: true 
            },
            dosage: { 
                type: String, 
                required: true 
            },
            whenToTake: {
                type: String,
                enum: ['before_meal', 'after_meal'],
                default: 'after_meal'
            },
            doses: [{
                time: { 
                    type: String, 
                    required: true 
                },
                status: {
                    type: String,
                    enum: ["pending", "taken", "skipped"],
                    default: "pending"
                },
                takenAt: {
                    type: Date
                },
                notes: {
                    type: String
                }
            }]
        }],
        completed: {
            type: Boolean,
            default: false
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    completionRate: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
