import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    // Fetch notifications when component mounts
    useEffect(() => {
        fetchNotifications();
        
        // Set up polling to check for new notifications every 30 seconds
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // Fetch notifications from the API
    const fetchNotifications = async () => {
        try {
            // Get token from localStorage
            const token = localStorage.getItem('patientToken');
            if (!token) {
                console.error('No patient token found');
                return;
            }

            // Fetch notifications from backend
            const response = await axios.get(
                'http://localhost:3000/notification/patient',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // If API endpoint doesn't exist yet, use this mock data
            const notificationsData = response.data || mockNotifications();
            
            setNotifications(notificationsData);
            
            // Count unread notifications
            const unread = notificationsData.filter(notification => !notification.read).length;
            setUnreadCount(unread);
            
            // Store last check time
            localStorage.setItem('lastNotificationCheck', new Date().toISOString());
        } catch (err) {
            console.error('Error fetching notifications:', err);
            
            // If API fails, use mock data for demonstration
            const mockData = mockNotifications();
            setNotifications(mockData);
            setUnreadCount(mockData.filter(notification => !notification.read).length);
        }
    };

    // Mock notifications for testing
    const mockNotifications = () => {
        // Get appointments from localStorage if available
        const storedAppointments = JSON.parse(localStorage.getItem('mockPatientNotifications') || '[]');
        
        if (storedAppointments.length > 0) {
            return storedAppointments;
        }
        
        // Create mock notifications if none exist
        const mockData = [
            {
                id: '1',
                type: 'appointment',
                message: 'Your appointment with Dr. Smith has been confirmed',
                time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
                read: false,
                appointmentId: 'mock-appointment-1',
                doctorName: 'Dr. Smith',
                status: 'confirmed'
            },
            {
                id: '2',
                type: 'appointment',
                message: 'Your appointment with Dr. Johnson has been cancelled',
                time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
                read: false,
                appointmentId: 'mock-appointment-2',
                doctorName: 'Dr. Johnson',
                status: 'cancelled'
            },
            {
                id: '3',
                type: 'appointment',
                message: 'Reminder: Your appointment with Dr. Williams is tomorrow',
                time: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
                read: true,
                appointmentId: 'mock-appointment-3',
                doctorName: 'Dr. Williams',
                status: 'reminder'
            }
        ];
        
        // Store mock data in localStorage
        localStorage.setItem('mockPatientNotifications', JSON.stringify(mockData));
        
        return mockData;
    };

    // Mark a notification as read
    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('patientToken');
            if (!token) return;

            // Try to mark as read via API
            try {
                await axios.put(
                    `http://localhost:3000/notification/${notificationId}/read`,
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            } catch (apiError) {
                console.error('API call failed, updating local state only:', apiError);
                
                // If API fails, update mock data
                const storedNotifications = JSON.parse(localStorage.getItem('mockPatientNotifications') || '[]');
                const updatedNotifications = storedNotifications.map(notification => 
                    notification.id === notificationId ? { ...notification, read: true } : notification
                );
                localStorage.setItem('mockPatientNotifications', JSON.stringify(updatedNotifications));
            }

            // Update UI
            setNotifications(prevNotifications => 
                prevNotifications.map(notification => 
                    notification.id === notificationId ? { ...notification, read: true } : notification
                )
            );
            
            // Update unread count
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
        // Mark as read
        if (!notification.read) {
            markAsRead(notification.id);
        }
        
        // Navigate based on notification type
        if (notification.type === 'appointment') {
            navigate('/my-appointments');
        }
    };

    // Format time to relative format (e.g., "2 hours ago")
    const formatRelativeTime = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffSec = Math.round(diffMs / 1000);
        const diffMin = Math.round(diffSec / 60);
        const diffHour = Math.round(diffMin / 60);
        const diffDay = Math.round(diffHour / 24);
        
        if (diffSec < 60) return 'just now';
        if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
        if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
        if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('patientToken');
            if (!token) return;

            // Try to mark all as read via API
            try {
                await axios.put(
                    'http://localhost:3000/notification/patient/read-all',
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            } catch (apiError) {
                console.error('API call failed, updating local state only:', apiError);
                
                // If API fails, update mock data
                const storedNotifications = JSON.parse(localStorage.getItem('mockPatientNotifications') || '[]');
                const updatedNotifications = storedNotifications.map(notification => ({
                    ...notification,
                    read: true
                }));
                localStorage.setItem('mockPatientNotifications', JSON.stringify(updatedNotifications));
            }

            // Update UI
            setNotifications(prevNotifications => 
                prevNotifications.map(notification => ({
                    ...notification,
                    read: true
                }))
            );
            
            // Reset unread count
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    return (
        <div className="relative">
            {/* Bell icon with notification badge */}
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-white rounded-full hover:bg-white/10 transition-colors"
                aria-label="Notifications"
            >
                <FaBell className="h-5 w-5" />
                
                {/* Notification badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
                    <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatRelativeTime(notification.time)}
                                            </p>
                                            {notification.status && (
                                                <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                                                    notification.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                                    notification.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                        {!notification.read && (
                                            <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 ml-2 mt-1"></span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientNotification;
