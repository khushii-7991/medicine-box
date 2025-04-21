const mongoose = require('mongoose');
const { 
    generateTodayAppointmentReminders,
    generateTodayMedicationReminders 
} = require('../controller/notificationController');

// Set up mongoose options to avoid deprecation warnings
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/medwise')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB connection error:', err));

async function generateAllDailyNotifications() {
    try {
        console.log('Starting daily notification generation...');
        
        // Generate appointment reminders
        const appointmentCount = await generateTodayAppointmentReminders();
        console.log(`Generated ${appointmentCount} appointment reminders`);
        
        // Generate medication reminders
        const medicationCount = await generateTodayMedicationReminders();
        console.log(`Generated ${medicationCount} medication reminders`);
        
        console.log('Daily notification generation completed successfully');
        
        // Close the MongoDB connection
        mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error generating daily notifications:', error);
        
        // Close the MongoDB connection even if there's an error
        mongoose.connection.close();
        console.log('MongoDB connection closed');
        
        // Exit with error code
        process.exit(1);
    }
}

// Run the function
generateAllDailyNotifications();
