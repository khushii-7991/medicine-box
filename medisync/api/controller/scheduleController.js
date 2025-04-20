const Schedule = require('../models/scheduleModel');
const Prescription = require('../models/prescriptionModel');
const mongoose = require('mongoose');

/**
 * Create a medication schedule based on a prescription
 * @param {string} prescriptionId - The ID of the prescription
 */
const createSchedule = async (prescriptionId) => {
    try {
        // Get the prescription details
        const prescription = await Prescription.findById(prescriptionId);
        if (!prescription) {
            throw new Error('Prescription not found');
        }

        // Calculate start and end dates
        const startDate = new Date(prescription.createdAt);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + prescription.duration - 1);

        // Create daily schedule entries for each day of the prescription
        const dailySchedule = [];
        
        for (let i = 0; i < prescription.duration; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            // Format the date to remove time component for comparison
            const formattedDate = new Date(currentDate.setHours(0, 0, 0, 0));
            
            // Create medicines array for this day
            const medicines = prescription.medicines.map((medicine, index) => {
                // Create doses array for each time the medicine should be taken
                const doses = medicine.timings.map(time => {
                    return {
                        time,
                        status: 'pending',
                        takenAt: null,
                        notes: ''
                    };
                });
                
                return {
                    medicineId: `${prescription._id}-${index}`, // Create a unique ID for the medicine
                    name: medicine.name,
                    dosage: medicine.dosage,
                    whenToTake: medicine.whenToTake || 'after_meal',
                    doses
                };
            });
            
            dailySchedule.push({
                date: formattedDate,
                medicines,
                completed: false
            });
        }
        
        // Create and save the schedule
        const schedule = new Schedule({
            patientId: prescription.patientId,
            prescriptionId: prescription._id,
            startDate,
            endDate,
            duration: prescription.duration,
            dailySchedule,
            isActive: true,
            completionRate: 0
        });
        
        await schedule.save();
        return schedule;
    } catch (error) {
        console.error('Error creating schedule:', error);
        throw error;
    }
};

/**
 * Get all schedules for a patient
 */
const getPatientSchedules = async (req, res) => {
    try {
        const patientId = req.params.patientId || req.user.id;
        
        // Get active schedules for the patient
        const schedules = await Schedule.find({ 
            patientId,
            isActive: true
        })
        .populate('prescriptionId', 'notes')
        .sort({ startDate: -1 });
        
        res.json(schedules);
    } catch (error) {
        console.error('Error fetching patient schedules:', error);
        res.status(500).json({ message: 'Failed to fetch schedules' });
    }
};

/**
 * Get today's medication schedule for a patient
 */
const getTodaySchedule = async (req, res) => {
    try {
        console.log('User from token:', req.user);
        const patientId = req.params.patientId || req.user.id;
        console.log('Using patientId:', patientId);
        
        // Get today's date and reset time to midnight
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDay = today.getDate();
        
        console.log(`Today's date: ${todayYear}-${todayMonth + 1}-${todayDay}`);
        
        // Find active schedules for the patient
        const schedules = await Schedule.find({
            patientId,
            isActive: true
        }).populate('prescriptionId', 'notes');
        
        console.log(`Found ${schedules.length} active schedules for patient ${patientId}`);
        
        if (schedules.length === 0) {
            return res.json([]);
        }
        
        // Extract today's schedule from each active schedule
        const todaySchedules = [];
        
        for (const schedule of schedules) {
            console.log(`Processing schedule ID: ${schedule._id}`);
            console.log(`Daily schedule entries: ${schedule.dailySchedule.length}`);
            
            // Find today's entry in the daily schedule by comparing year, month, and day
            let todaySchedule = null;
            
            for (const day of schedule.dailySchedule) {
                const dayDate = new Date(day.date);
                const dayYear = dayDate.getFullYear();
                const dayMonth = dayDate.getMonth();
                const dayDay = dayDate.getDate();
                
                console.log(`Schedule date: ${dayYear}-${dayMonth + 1}-${dayDay}`);
                
                // Compare year, month, and day instead of timestamps
                if (dayYear === todayYear && dayMonth === todayMonth && dayDay === todayDay) {
                    console.log('Found matching date by year, month, and day!');
                    todaySchedule = day;
                    break;
                }
            }
            
            if (todaySchedule && todaySchedule.medicines && todaySchedule.medicines.length > 0) {
                console.log(`Found ${todaySchedule.medicines.length} medicines for today`);
                
                todaySchedules.push({
                    scheduleId: schedule._id,
                    prescriptionId: schedule.prescriptionId,
                    prescriptionNotes: schedule.prescriptionId ? schedule.prescriptionId.notes : '',
                    date: today,
                    medicines: todaySchedule.medicines,
                    completed: todaySchedule.completed
                });
            } else {
                console.log('No medicines found for today in this schedule');
            }
        }
        
        console.log(`Returning ${todaySchedules.length} schedule entries with medicines`);
        res.json(todaySchedules);
    } catch (error) {
        console.error('Error fetching today\'s schedule:', error);
        res.status(500).json({ message: 'Failed to fetch today\'s schedule' });
    }
};

/**
 * Update the status of a medication dose
 */
const updateDoseStatus = async (req, res) => {
    try {
        const { scheduleId, date, medicineId, doseIndex, status, notes } = req.body;
        
        if (!scheduleId || !medicineId || doseIndex === undefined || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Find the schedule
        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        
        // Find the day in the schedule
        const scheduleDate = new Date(date || new Date());
        const targetYear = scheduleDate.getFullYear();
        const targetMonth = scheduleDate.getMonth();
        const targetDay = scheduleDate.getDate();
        
        console.log(`Looking for date: ${targetYear}-${targetMonth + 1}-${targetDay} in schedule`);
        
        const dayIndex = schedule.dailySchedule.findIndex(day => {
            const dayDate = new Date(day.date);
            const dayYear = dayDate.getFullYear();
            const dayMonth = dayDate.getMonth();
            const dayDay = dayDate.getDate();
            
            return dayYear === targetYear && dayMonth === targetMonth && dayDay === targetDay;
        });
        
        if (dayIndex === -1) {
            return res.status(404).json({ message: 'Day not found in schedule' });
        }
        
        // Find the medicine
        const medicineIndex = schedule.dailySchedule[dayIndex].medicines.findIndex(
            med => med.medicineId === medicineId
        );
        
        if (medicineIndex === -1) {
            return res.status(404).json({ message: 'Medicine not found in schedule' });
        }
        
        // Update the dose status
        if (doseIndex >= schedule.dailySchedule[dayIndex].medicines[medicineIndex].doses.length) {
            return res.status(400).json({ message: 'Invalid dose index' });
        }
        
        schedule.dailySchedule[dayIndex].medicines[medicineIndex].doses[doseIndex].status = status;
        schedule.dailySchedule[dayIndex].medicines[medicineIndex].doses[doseIndex].takenAt = new Date();
        
        if (notes) {
            schedule.dailySchedule[dayIndex].medicines[medicineIndex].doses[doseIndex].notes = notes;
        }
        
        // Check if all doses for the day are taken or skipped
        const allDosesCompleted = schedule.dailySchedule[dayIndex].medicines.every(medicine => {
            return medicine.doses.every(dose => dose.status === 'taken' || dose.status === 'skipped');
        });
        
        if (allDosesCompleted) {
            schedule.dailySchedule[dayIndex].completed = true;
        }
        
        // Update completion rate
        const totalDoses = schedule.dailySchedule.reduce((total, day) => {
            return total + day.medicines.reduce((dayTotal, medicine) => {
                return dayTotal + medicine.doses.length;
            }, 0);
        }, 0);
        
        const completedDoses = schedule.dailySchedule.reduce((total, day) => {
            return total + day.medicines.reduce((dayTotal, medicine) => {
                return dayTotal + medicine.doses.filter(dose => 
                    dose.status === 'taken' || dose.status === 'skipped'
                ).length;
            }, 0);
        }, 0);
        
        schedule.completionRate = totalDoses > 0 ? (completedDoses / totalDoses) * 100 : 0;
        
        // Save the updated schedule
        await schedule.save();
        
        res.json({ 
            message: 'Dose status updated successfully',
            updatedSchedule: schedule
        });
    } catch (error) {
        console.error('Error updating dose status:', error);
        res.status(500).json({ message: 'Failed to update dose status' });
    }
};

/**
 * Get schedule statistics for a patient
 */
const getScheduleStats = async (req, res) => {
    try {
        console.log('User from token in stats:', req.user);
        const patientId = req.params.patientId || req.user.id;
        console.log('Using patientId for stats:', patientId);
        
        // Get all schedules for the patient
        const schedules = await Schedule.find({ patientId });
        console.log(`Found ${schedules.length} schedules for stats`);
        
        // Calculate statistics
        const totalSchedules = schedules.length;
        const activeSchedules = schedules.filter(s => s.isActive).length;
        const completedSchedules = schedules.filter(s => !s.isActive).length;
        
        // Calculate overall adherence rate
        let totalDoses = 0;
        let takenDoses = 0;
        
        schedules.forEach(schedule => {
            schedule.dailySchedule.forEach(day => {
                day.medicines.forEach(medicine => {
                    medicine.doses.forEach(dose => {
                        totalDoses++;
                        if (dose.status === 'taken') {
                            takenDoses++;
                        }
                    });
                });
            });
        });
        
        const adherenceRate = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;
        
        // Get today's doses
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDay = today.getDate();
        
        console.log(`Looking for today's doses: ${todayYear}-${todayMonth + 1}-${todayDay}`);
        
        let todayTotalDoses = 0;
        let todayTakenDoses = 0;
        let todayPendingDoses = 0;
        
        schedules.forEach(schedule => {
            const todaySchedule = schedule.dailySchedule.find(day => {
                const dayDate = new Date(day.date);
                const dayYear = dayDate.getFullYear();
                const dayMonth = dayDate.getMonth();
                const dayDay = dayDate.getDate();
                
                return dayYear === todayYear && dayMonth === todayMonth && dayDay === todayDay;
            });
            
            if (todaySchedule) {
                console.log(`Found today's schedule in schedule ID: ${schedule._id}`);
                todaySchedule.medicines.forEach(medicine => {
                    medicine.doses.forEach(dose => {
                        todayTotalDoses++;
                        if (dose.status === 'taken') {
                            todayTakenDoses++;
                        } else if (dose.status === 'pending') {
                            todayPendingDoses++;
                        }
                    });
                });
            }
        });
        
        const statsResponse = {
            totalSchedules,
            activeSchedules,
            completedSchedules,
            adherenceRate,
            todayStats: {
                totalDoses: todayTotalDoses,
                takenDoses: todayTakenDoses,
                pendingDoses: todayPendingDoses,
                adherenceRate: todayTotalDoses > 0 ? 
                    (todayTakenDoses / todayTotalDoses) * 100 : 0
            }
        };
        
        console.log('Sending stats response:', statsResponse);
        res.json(statsResponse);
    } catch (error) {
        console.error('Error fetching schedule statistics:', error);
        res.status(500).json({ message: 'Failed to fetch schedule statistics' });
    }
};

module.exports = {
    createSchedule,
    getPatientSchedules,
    getTodaySchedule,
    updateDoseStatus,
    getScheduleStats
};
