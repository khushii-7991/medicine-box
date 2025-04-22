const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get all notifications for the authenticated user (doctor or patient)
// GET /notifications/my-notifications - Get all notifications for the authenticated user
router.get('/my-notifications', auth, async (req, res) => {
    console.log('Fetching notifications for user:', req.user.id, 'model:', req.user.model);
    try {
        // Determine if the user is a doctor or patient based on the token
        let userType = 'Patient';
        if (req.user.role === 'doctor') {
            userType = 'Doctor';
        }
        
        console.log('Using user type:', userType, 'for user ID:', req.user.id);
        
        // Get notifications for this user
        const notifications = await Notification.find({
            recipient: req.user.id,
            recipientModel: userType
        })
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(50); // Limit to 50 most recent notifications
        
        console.log(`Found ${notifications.length} notifications for user ${req.user.id}`);
        
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if we need to generate today's notifications based on user type
        if (userType === 'Patient') {
            // Check if we already have medication reminders for today
            const todaysMedicationReminders = notifications.filter(n => 
                n.type === 'medication' && 
                new Date(n.createdAt).setHours(0, 0, 0, 0) === today.getTime()
            );
            
            if (todaysMedicationReminders.length === 0) {
                console.log('No medication reminders for today, checking if we need to generate them');
                // Import the functions to generate notifications
                const { 
                    generateTodayMedicationRemindersForPatient,
                    generateUpcomingAppointmentRemindersForPatient 
                } = require('../controller/notificationController');
                
                // Generate medication reminders for this patient
                try {
                    await generateTodayMedicationRemindersForPatient(req.user.id);
                    await generateUpcomingAppointmentRemindersForPatient(req.user.id);
                    
                    // Get updated notifications
                    const updatedNotifications = await Notification.find({
                        recipient: req.user.id,
                        recipientModel: userType
                    })
                    .sort({ createdAt: -1 })
                    .limit(50);
                    
                    return res.status(200).json(updatedNotifications);
                } catch (error) {
                    console.error('Error generating notifications:', error);
                    // Continue with the existing notifications
                }
            }
        } else if (userType === 'Doctor') {
            // Check if we already have appointment reminders for today
            const todaysAppointmentReminders = notifications.filter(n => 
                n.type === 'appointment' && 
                n.title && (n.title.includes('Today') || n.title.includes('Tomorrow')) &&
                new Date(n.createdAt).setHours(0, 0, 0, 0) === today.getTime()
            );
            
            if (todaysAppointmentReminders.length === 0) {
                console.log('No appointment reminders for today, generating them for doctor');
                const { generateUpcomingAppointmentRemindersForDoctor } = require('../controller/notificationController');
                
                try {
                    await generateUpcomingAppointmentRemindersForDoctor(req.user.id);
                    console.log('Generated appointment reminders for doctor:', req.user.id);
                    
                    // Fetch notifications again to include the newly created ones
                    const updatedNotifications = await Notification.find({
                        recipient: req.user.id,
                        recipientModel: userType
                    })
                    .sort({ createdAt: -1 })
                    .limit(50);
                
                    return res.json(updatedNotifications);
                } catch (reminderErr) {
                    console.error('Error generating reminders for doctor:', reminderErr);
                    // Continue with the existing notifications
                }
            }
        }
        
        res.json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// Get unread notification count
router.get('/unread-count', auth, async (req, res) => {
    try {
        // Determine if the user is a doctor or patient based on the token
        let userType = 'Patient';
        if (req.user.role === 'doctor') {
            userType = 'Doctor';
        }
        
        console.log('Counting unread notifications for user type:', userType, 'user ID:', req.user.id);
        
        // Count unread notifications for this user
        const count = await Notification.countDocuments({
            recipient: req.user.id,
            recipientModel: userType,
            isRead: false
        });
        
        res.json({ count });
    } catch (err) {
        console.error('Error counting unread notifications:', err);
        res.status(500).json({ message: 'Error counting unread notifications' });
    }
});

// Mark a notification as read
router.put('/mark-read/:notificationId', auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        // Ensure the notification belongs to the authenticated user
        if (notification.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this notification' });
        }
        
        notification.isRead = true;
        await notification.save();
        
        res.json({ message: 'Notification marked as read', notification });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ message: 'Error updating notification' });
    }
});

// Mark all notifications as read
router.put('/mark-all-read', auth, async (req, res) => {
    try {
        // Determine if the user is a doctor or patient based on the token
        let userType = 'Patient';
        if (req.user.role === 'doctor') {
            userType = 'Doctor';
        }
        
        console.log('Marking all notifications as read for user type:', userType, 'user ID:', req.user.id);
        
        // Update all unread notifications for this user
        const result = await Notification.updateMany(
            {
                recipient: req.user.id,
                recipientModel: userType,
                isRead: false
            },
            { isRead: true }
        );
        
        res.json({ 
            message: 'All notifications marked as read',
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        console.error('Error marking all notifications as read:', err);
        res.status(500).json({ message: 'Error updating notifications' });
    }
});

// Delete a notification
router.delete('/:notificationId', auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        // Ensure the notification belongs to the authenticated user
        if (notification.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this notification' });
        }
        
        await notification.deleteOne();
        
        res.json({ message: 'Notification deleted' });
    } catch (err) {
        console.error('Error deleting notification:', err);
        res.status(500).json({ message: 'Error deleting notification' });
    }
});

// Clear all notifications
router.delete('/clear-all', auth, async (req, res) => {
    try {
        // Determine if the user is a doctor or patient based on the token
        const userType = req.user.role || (req.user.specialization ? 'Doctor' : 'Patient');
        
        // Delete all notifications for this user
        const result = await Notification.deleteMany({
            recipient: req.user.id,
            recipientModel: userType
        });
        
        res.json({ 
            message: 'All notifications cleared',
            deletedCount: result.deletedCount
        });
    } catch (err) {
        console.error('Error clearing notifications:', err);
        res.status(500).json({ message: 'Error clearing notifications' });
    }
});

module.exports = router;
