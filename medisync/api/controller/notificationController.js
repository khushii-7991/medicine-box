const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/prescriptionModel');
const Schedule = require('../models/scheduleModel');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

/**
 * Create a new notification
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Created notification
 */
const createNotification = async (notificationData) => {
    try {
        console.log('Creating notification:', notificationData);
        const notification = new Notification(notificationData);
        await notification.save();
        console.log('Notification created successfully:', notification._id);
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

/**
 * Create appointment notifications
 * @param {Object} appointment - Appointment object
 * @param {String} action - Action type (created, updated, canceled, completed)
 */
const createAppointmentNotifications = async (appointment, action) => {
    try {
        console.log('Creating appointment notifications for action:', action);
        
        // Handle both populated and unpopulated appointment objects
        let doctor, patient;
        
        // Check if doctor and patient are already populated objects
        if (appointment.doctor && typeof appointment.doctor === 'object' && appointment.doctor._id) {
            doctor = appointment.doctor;
            console.log('Using populated doctor:', doctor.name);
        } else {
            // Fetch doctor if not populated
            doctor = await Doctor.findById(appointment.doctor);
            console.log('Fetched doctor:', doctor?.name);
        }
        
        if (appointment.patient && typeof appointment.patient === 'object' && appointment.patient._id) {
            patient = appointment.patient;
            console.log('Using populated patient:', patient.name);
        } else {
            // Fetch patient if not populated
            patient = await Patient.findById(appointment.patient);
            console.log('Fetched patient:', patient?.name);
        }
        
        if (!doctor || !patient) {
            console.error('Doctor or patient not found for appointment notification');
            console.error('Doctor ID:', appointment.doctor, 'Patient ID:', appointment.patient);
            return;
        }
        
        let doctorTitle, doctorMessage;
        let patientTitle, patientMessage;
        
        // Set messages based on action
        switch (action) {
            case 'created':
                doctorTitle = 'New Appointment Request';
                doctorMessage = `${patient.name} has requested an appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`;
                
                patientTitle = 'Appointment Requested';
                patientMessage = `Your appointment with Dr. ${doctor.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been requested.`;
                break;
                
            case 'confirmed':
                doctorTitle = 'Appointment Confirmed';
                doctorMessage = `You confirmed an appointment with ${patient.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`;
                
                patientTitle = 'Appointment Confirmed';
                patientMessage = `Your appointment with Dr. ${doctor.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been confirmed.`;
                break;
                
            case 'declined':
                doctorTitle = 'Appointment Declined';
                doctorMessage = `You declined an appointment with ${patient.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`;
                
                patientTitle = 'Appointment Declined';
                patientMessage = `Your appointment with Dr. ${doctor.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been declined.`;
                break;
                
            case 'completed':
                doctorTitle = 'Appointment Completed';
                doctorMessage = `Your appointment with ${patient.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been marked as completed.`;
                
                patientTitle = 'Appointment Completed';
                patientMessage = `Your appointment with Dr. ${doctor.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been completed.`;
                break;
                
            case 'reminder':
                doctorTitle = 'Upcoming Appointment Reminder';
                doctorMessage = `Reminder: You have an appointment with ${patient.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`;
                
                patientTitle = 'Upcoming Appointment Reminder';
                patientMessage = `Reminder: You have an appointment with Dr. ${doctor.name} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`;
                break;
        }
        
        // Create notification for doctor
        try {
            await createNotification({
                recipient: doctor._id,
                recipientModel: 'Doctor',
                title: doctorTitle,
                message: doctorMessage,
                type: 'appointment',
                relatedId: appointment._id,
                relatedModel: 'Appointment'
            });
            console.log('Doctor notification created successfully');
        } catch (error) {
            console.error('Error creating doctor notification:', error);
        }
        
        // Create notification for patient
        try {
            await createNotification({
                recipient: patient._id,
                recipientModel: 'Patient',
                title: patientTitle,
                message: patientMessage,
                type: 'appointment',
                relatedId: appointment._id,
                relatedModel: 'Appointment'
            });
            console.log('Patient notification created successfully');
        } catch (error) {
            console.error('Error creating patient notification:', error);
        }
        
    } catch (error) {
        console.error('Error creating appointment notifications:', error);
    }
};

/**
 * Create prescription notifications
 * @param {Object} prescription - Prescription object
 */
const createPrescriptionNotifications = async (prescription) => {
    try {
        console.log('Creating prescription notification for:', JSON.stringify(prescription, null, 2));
        
        // Get doctor and patient details
        const doctor = await Doctor.findById(prescription.doctorId);
        const patient = await Patient.findById(prescription.patientId);
        
        if (!doctor || !patient) {
            console.error('Doctor or patient not found for prescription notification');
            console.error('Doctor ID:', prescription.doctorId, 'Patient ID:', prescription.patientId);
            return;
        }
        
        console.log('Found doctor:', doctor.name, 'and patient:', patient.name);
        
        // Create notification for patient
        try {
            await createNotification({
                recipient: patient._id,
                recipientModel: 'Patient',
                title: 'New Prescription',
                message: `Dr. ${doctor.name} has prescribed new medications for you. Check your prescriptions for details.`,
                type: 'prescription',
                relatedId: prescription._id,
                relatedModel: 'Prescription'
            });
            console.log('Prescription notification created successfully for patient:', patient._id);
        } catch (notificationError) {
            console.error('Error creating prescription notification:', notificationError);
        }
        
    } catch (error) {
        console.error('Error creating prescription notifications:', error);
    }
};

/**
 * Create medication reminder notifications
 * @param {Object} schedule - Schedule object
 * @param {Date} date - Date for the reminder
 */
const createMedicationReminders = async (schedule, date) => {
    try {
        console.log('Creating medication reminders for schedule:', schedule._id);
        
        // Get prescription details
        const prescription = await Prescription.findById(schedule.prescriptionId)
            .populate('patientId', 'name')
            .populate('doctorId', 'name');
        
        if (!prescription) {
            console.error('Prescription not found for medication reminder');
            return;
        }
        
        const patient = prescription.patientId;
        console.log('Creating medication reminder for patient:', patient.name);
        
        // Check if we already sent a medication reminder for this schedule today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const existingNotification = await Notification.findOne({
            recipient: patient._id,
            recipientModel: 'Patient',
            type: 'medication',
            relatedId: schedule._id,
            createdAt: { $gte: today }
        });
        
        if (existingNotification) {
            console.log(`Medication reminder already sent today for schedule ${schedule._id}`);
            return;
        }
        
        // Format the date
        const formattedDate = date.toLocaleDateString();
        
        // Group medications by timing for better organization
        const medicationsByTiming = {};
        
        prescription.medicines.forEach(med => {
            med.timings.forEach(timing => {
                if (!medicationsByTiming[timing]) {
                    medicationsByTiming[timing] = [];
                }
                medicationsByTiming[timing].push({
                    name: med.name,
                    dosage: med.dosage,
                    whenToTake: med.whenToTake
                });
            });
        });
        
        // Create a more readable message with medications grouped by timing
        let message = `Reminder to take your medications for today (${formattedDate}):\n\n`;
        
        // Sort timings to show morning, afternoon, evening in order
        const sortedTimings = Object.keys(medicationsByTiming).sort((a, b) => {
            const timeOrder = { 'morning': 0, 'afternoon': 1, 'evening': 2, 'night': 3 };
            return (timeOrder[a.toLowerCase()] || 99) - (timeOrder[b.toLowerCase()] || 99);
        });
        
        sortedTimings.forEach(timing => {
            message += `📅 ${timing.toUpperCase()}:\n`;
            medicationsByTiming[timing].forEach(med => {
                message += `• ${med.name} (${med.dosage}) - ${med.whenToTake === 'before_meal' ? 'Before meal' : 'After meal'}\n`;
            });
            message += '\n';
        });
        
        message += `Prescribed by Dr. ${prescription.doctorId.name}`;
        
        // Create notification for patient
        await createNotification({
            recipient: patient._id,
            recipientModel: 'Patient',
            title: '💊 Today\'s Medication Reminder',
            message: message,
            type: 'medication',
            relatedId: schedule._id,
            relatedModel: 'Schedule'
        });
        
        console.log('Medication reminder created successfully for patient:', patient._id);
        
    } catch (error) {
        console.error('Error creating medication reminder notifications:', error);
    }
};

/**
 * Generate today's appointment reminders
 */
const generateTodayAppointmentReminders = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Find all appointments for today
        const appointments = await Appointment.find({
            date: {
                $gte: today,
                $lt: tomorrow
            },
            status: 'confirmed'
        });
        
        console.log(`Generating reminders for ${appointments.length} appointments today`);
        
        // Create reminders for each appointment
        for (const appointment of appointments) {
            await createAppointmentNotifications(appointment, 'reminder');
        }
        
        return appointments.length;
    } catch (error) {
        console.error('Error generating today\'s appointment reminders:', error);
        throw error;
    }
};

/**
 * Generate today's medication reminders
 */
const generateTodayMedicationReminders = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        console.log('Generating medication reminders for date:', today.toISOString());
        
        // Helper function to compare dates by components
        const isSameOrAfter = (date1, date2) => {
            return date1.getFullYear() > date2.getFullYear() || 
                   (date1.getFullYear() === date2.getFullYear() && 
                    (date1.getMonth() > date2.getMonth() || 
                     (date1.getMonth() === date2.getMonth() && 
                      date1.getDate() >= date2.getDate())));
        };
        
        // Find all active schedules for today
        const schedules = await Schedule.find({
            isActive: true,
            startDate: { $lte: today },
            endDate: { $gte: today }
        });
        
        console.log(`Found ${schedules.length} active medication schedules for today`);
        let reminderCount = 0;
        
        // For each schedule, create a reminder
        for (const schedule of schedules) {
            // Get the prescription to check its details
            const prescription = await Prescription.findById(schedule.prescriptionId);
            
            if (!prescription) {
                console.log(`Prescription not found for schedule: ${schedule._id}`);
                continue;
            }
            
            // Check if we already sent a notification for this schedule today
            const existingNotification = await Notification.findOne({
                recipient: schedule.patientId,
                recipientModel: 'Patient',
                type: 'medication',
                relatedId: schedule._id,
                createdAt: { $gte: today }
            });
            
            if (existingNotification) {
                console.log(`Notification already exists for schedule ${schedule._id} today`);
                continue;
            }
            
            console.log(`Creating reminder for active prescription: ${prescription._id}`);
            await createMedicationReminders(schedule, today);
            reminderCount++;
        }
        
        // Also check for prescriptions that might not have schedules yet
        const patients = await Patient.find({});
        console.log(`Checking ${patients.length} patients for prescriptions without schedules`);
        
        for (const patient of patients) {
            const prescriptions = await Prescription.find({ patientId: patient._id });
            
            for (const prescription of prescriptions) {
                // Calculate if the prescription is still active
                const prescriptionDate = new Date(prescription.createdAt);
                const endDate = new Date(prescriptionDate);
                endDate.setDate(prescriptionDate.getDate() + prescription.duration);
                
                // Check if prescription is active and doesn't have a schedule
                if (isSameOrAfter(endDate, today)) {
                    const existingSchedule = await Schedule.findOne({ prescriptionId: prescription._id });
                    
                    if (!existingSchedule) {
                        console.log(`Found active prescription ${prescription._id} without schedule for patient ${patient._id}`);
                        // Here you might want to create a schedule or notify an admin
                    }
                }
            }
        }
        
        console.log(`Generated ${reminderCount} medication reminders for today`);
        return reminderCount;
    } catch (error) {
        console.error('Error generating today\'s medication reminders:', error);
        throw error;
    }
};

/**
 * Generate medication reminders for a specific patient
 * @param {string} patientId - The ID of the patient
 */
const generateTodayMedicationRemindersForPatient = async (patientId) => {
    try {
        console.log(`Generating medication reminders for patient: ${patientId}`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Find all schedules for this patient that are active
        const schedules = await Schedule.find({
            patientId: patientId,
            isActive: true,
            startDate: { $lte: today },
            endDate: { $gte: today }
        });
        
        console.log(`Found ${schedules.length} active schedules for patient ${patientId}`);
        
        if (schedules.length === 0) {
            // If no schedules found, try to find prescriptions and create schedules if needed
            const prescriptions = await Prescription.find({
                patientId: patientId
            });
            
            console.log(`Found ${prescriptions.length} prescriptions for patient ${patientId}`);
            
            if (prescriptions.length === 0) {
                console.log('No prescriptions found for this patient');
                return 0;
            }
            
            let reminderCount = 0;
            
            // For each prescription, check if it's still active
            for (const prescription of prescriptions) {
                // Calculate if the prescription is still active using date components
                const prescriptionDate = new Date(prescription.createdAt);
                const endDate = new Date(prescriptionDate);
                endDate.setDate(prescriptionDate.getDate() + prescription.duration);
                
                console.log(`Checking prescription ${prescription._id} - Start: ${prescriptionDate.toISOString()}, End: ${endDate.toISOString()}`);
                
                // Compare dates using year, month, and day components
                const isSameOrAfter = (date1, date2) => {
                    return date1.getFullYear() > date2.getFullYear() || 
                           (date1.getFullYear() === date2.getFullYear() && 
                            (date1.getMonth() > date2.getMonth() || 
                             (date1.getMonth() === date2.getMonth() && 
                              date1.getDate() >= date2.getDate())));
                };
                
                const isSameOrBefore = (date1, date2) => {
                    return date1.getFullYear() < date2.getFullYear() || 
                           (date1.getFullYear() === date2.getFullYear() && 
                            (date1.getMonth() < date2.getMonth() || 
                             (date1.getMonth() === date2.getMonth() && 
                              date1.getDate() <= date2.getDate())));
                };
                
                // If prescription is still active, find its schedule
                if (isSameOrAfter(endDate, today)) {
                    console.log(`Prescription ${prescription._id} is active, finding schedule`);
                    
                    // Find the schedule for this prescription
                    const schedule = await Schedule.findOne({ prescriptionId: prescription._id });
                    
                    if (schedule) {
                        console.log(`Found schedule ${schedule._id} for prescription ${prescription._id}`);
                        await createMedicationReminders(schedule, today);
                        reminderCount++;
                    } else {
                        console.log(`No schedule found for prescription ${prescription._id}`);
                    }
                } else {
                    console.log(`Prescription ${prescription._id} is no longer active`);
                }
            }
            
            console.log(`Generated ${reminderCount} medication reminders for patient ${patientId} from prescriptions`);
            return reminderCount;
        }
        
        // If we have active schedules, create reminders for each
        let reminderCount = 0;
        for (const schedule of schedules) {
            console.log(`Creating reminder for schedule ${schedule._id}`);
            await createMedicationReminders(schedule, today);
            reminderCount++;
        }
        
        console.log(`Generated ${reminderCount} medication reminders for patient ${patientId} from schedules`);
        return reminderCount;
    } catch (error) {
        console.error(`Error generating medication reminders for patient ${patientId}:`, error);
        throw error;
    }
};

/**
 * Generate upcoming appointment reminders for a specific patient
 * @param {string} patientId - The ID of the patient
 */
const generateUpcomingAppointmentRemindersForPatient = async (patientId) => {
    try {
        console.log(`Generating upcoming appointment reminders for patient: ${patientId}`);
        
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get tomorrow's date
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Get date 7 days from now for upcoming appointments
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        // Find all upcoming appointments for this patient
        const appointments = await Appointment.find({
            patient: patientId,
            date: { $gte: today, $lte: nextWeek },
            status: { $in: ['pending', 'confirmed'] }
        })
        .populate('doctor', 'name speciality')
        .sort({ date: 1 });
        
        console.log(`Found ${appointments.length} upcoming appointments for patient ${patientId}`);
        
        if (appointments.length === 0) {
            console.log('No upcoming appointments found for this patient');
            return 0;
        }
        
        let reminderCount = 0;
        
        // Create notifications for each appointment
        for (const appointment of appointments) {
            const appointmentDate = new Date(appointment.date);
            const formattedDate = appointmentDate.toLocaleDateString();
            
            // Check if we already have a notification for this appointment
            const existingNotification = await Notification.findOne({
                recipient: patientId,
                recipientModel: 'Patient',
                type: 'appointment',
                relatedId: appointment._id,
                // Only check for notifications created today
                createdAt: { $gte: today }
            });
            
            if (existingNotification) {
                console.log(`Notification already exists for appointment ${appointment._id}`);
                continue;
            }
            
            // Create a notification for this appointment
            let title, message;
            
            // Different message based on how soon the appointment is - using date components to compare
            const isSameDay = (date1, date2) => {
                return date1.getFullYear() === date2.getFullYear() &&
                       date1.getMonth() === date2.getMonth() &&
                       date1.getDate() === date2.getDate();
            };
            
            if (isSameDay(appointmentDate, tomorrow)) {
                title = '🗓️ Appointment Tomorrow';
                message = `You have an appointment with Dr. ${appointment.doctor.name} tomorrow at ${appointment.time}.`;
            } else if (isSameDay(appointmentDate, today)) {
                title = '🗓️ Appointment Today';
                message = `You have an appointment with Dr. ${appointment.doctor.name} today at ${appointment.time}.`;
            } else {
                title = '🗓️ Upcoming Appointment';
                message = `You have an upcoming appointment with Dr. ${appointment.doctor.name} on ${formattedDate} at ${appointment.time}.`;
            }
            
            // Add status information
            if (appointment.status === 'pending') {
                message += ' (Status: Pending confirmation)';
            } else if (appointment.status === 'confirmed') {
                message += ' (Status: Confirmed)';
            }
            
            await createNotification({
                recipient: patientId,
                recipientModel: 'Patient',
                title,
                message,
                type: 'appointment',
                relatedId: appointment._id,
                relatedModel: 'Appointment'
            });
            
            reminderCount++;
        }
        
        console.log(`Generated ${reminderCount} appointment reminders for patient ${patientId}`);
        return reminderCount;
    } catch (error) {
        console.error(`Error generating appointment reminders for patient ${patientId}:`, error);
        throw error;
    }
};

/**
 * Generate upcoming appointment reminders for a specific doctor
 * @param {string} doctorId - The ID of the doctor
 */
const generateUpcomingAppointmentRemindersForDoctor = async (doctorId) => {
    try {
        console.log(`Generating upcoming appointment reminders for doctor: ${doctorId}`);
        
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get tomorrow's date
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Find all appointments for today and tomorrow
        const appointments = await Appointment.find({
            doctor: doctorId,
            date: { $gte: today, $lte: tomorrow },
            status: { $in: ['pending', 'confirmed'] }
        })
        .populate('patient', 'name age')
        .sort({ date: 1, time: 1 });
        
        console.log(`Found ${appointments.length} upcoming appointments for doctor ${doctorId}`);
        
        if (appointments.length === 0) {
            console.log('No upcoming appointments found for this doctor');
            return 0;
        }
        
        let reminderCount = 0;
        
        // Helper function to compare dates by components instead of timestamps
        const isSameDay = (date1, date2) => {
            const d1 = new Date(date1);
            const d2 = new Date(date2);
            return d1.getFullYear() === d2.getFullYear() &&
                   d1.getMonth() === d2.getMonth() &&
                   d1.getDate() === d2.getDate();
        };
        
        // Group appointments by date using component-wise comparison
        const todayAppointments = appointments.filter(a => 
            isSameDay(a.date, today)
        );
        
        const tomorrowAppointments = appointments.filter(a => 
            isSameDay(a.date, tomorrow)
        );
        
        // Check if we already have a notification for today's appointments
        const existingTodayNotification = await Notification.findOne({
            recipient: doctorId,
            recipientModel: 'Doctor',
            type: 'appointment',
            title: '🗓️ Today\'s Appointments',
            createdAt: { $gte: today }
        });
        
        // Create a summary notification for today's appointments if we don't have one
        if (todayAppointments.length > 0 && !existingTodayNotification) {
            let message = `You have ${todayAppointments.length} appointment${todayAppointments.length > 1 ? 's' : ''} scheduled for today:\n\n`;
            
            todayAppointments.forEach((appointment, index) => {
                message += `${index + 1}. ${appointment.time} - ${appointment.patient.name} (${appointment.patient.age})`;
                if (appointment.status === 'pending') {
                    message += ' (Pending)';
                }
                message += '\n';
            });
            
            await createNotification({
                recipient: doctorId,
                recipientModel: 'Doctor',
                title: '🗓️ Today\'s Appointments',
                message,
                type: 'appointment',
                relatedModel: 'Appointment'
            });
            
            reminderCount++;
        }
        
        // Check if we already have a notification for tomorrow's appointments
        const existingTomorrowNotification = await Notification.findOne({
            recipient: doctorId,
            recipientModel: 'Doctor',
            type: 'appointment',
            title: '🗓️ Tomorrow\'s Appointments',
            createdAt: { $gte: today }
        });
        
        // Create a summary notification for tomorrow's appointments if we don't have one
        if (tomorrowAppointments.length > 0 && !existingTomorrowNotification) {
            let message = `You have ${tomorrowAppointments.length} appointment${tomorrowAppointments.length > 1 ? 's' : ''} scheduled for tomorrow:\n\n`;
            
            tomorrowAppointments.forEach((appointment, index) => {
                message += `${index + 1}. ${appointment.time} - ${appointment.patient.name} (${appointment.patient.age})`;
                if (appointment.status === 'pending') {
                    message += ' (Pending)';
                }
                message += '\n';
            });
            
            await createNotification({
                recipient: doctorId,
                recipientModel: 'Doctor',
                title: '🗓️ Tomorrow\'s Appointments',
                message,
                type: 'appointment',
                relatedModel: 'Appointment'
            });
            
            reminderCount++;
        }
        
        console.log(`Generated ${reminderCount} appointment reminders for doctor ${doctorId}`);
        return reminderCount;
    } catch (error) {
        console.error(`Error generating appointment reminders for doctor ${doctorId}:`, error);
        throw error;
    }
};

module.exports = {
    createNotification,
    createAppointmentNotifications,
    createPrescriptionNotifications,
    createMedicationReminders,
    generateTodayAppointmentReminders,
    generateTodayMedicationReminders,
    generateTodayMedicationRemindersForPatient,
    generateUpcomingAppointmentRemindersForPatient,
    generateUpcomingAppointmentRemindersForDoctor
};
