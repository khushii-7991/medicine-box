import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorNotification = () => {
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
            const token = localStorage.getItem('doctorToken');
            if (!token) {
                console.error('No doctor token found');
                return;
            }

            // Fetch notifications from backend
            const response = await axios.get(
                'http://localhost:3000/notification/doctor',
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
        const storedAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
        
        if (storedAppointments.length > 0) {
            return storedAppointments;
        }
        
        // Create mock notifications if none exist
        const mockData = [
            {
                id: '1',
                type: 'appointment',
                message: 'New appointment request from John Doe',
                time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
                read: false,
                appointmentId: 'mock-appointment-1',
                patientName: 'John Doe'
            },
            {
                id: '2',
                type: 'appointment',
                message: 'New appointment request from Jane Smith',
                time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
                read: false,
                appointmentId: 'mock-appointment-2',
                patientName: 'Jane Smith'
            }
        ];
        
        // Store mock data in localStorage
        localStorage.setItem('mockAppointments', JSON.stringify(mockData));
        
        return mockData;
    };

    // Mark a notification as read
    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('doctorToken');
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
                console.log('API not available, using local storage instead');
                // If API fails, update locally
                const updatedNotifications = notifications.map(notification => 
                    notification.id === notificationId 
                        ? { ...notification, read: true } 
                        : notification
                );
                setNotifications(updatedNotifications);
                localStorage.setItem('mockAppointments', JSON.stringify(updatedNotifications));
            }

            // Update UI
            setNotifications(prevNotifications => 
                prevNotifications.map(notification => 
                    notification.id === notificationId 
                        ? { ...notification, read: true } 
                        : notification
                )
            );
            
            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
        // Mark as read
        markAsRead(notification.id);
        
        // Navigate to appointment details
        if (notification.type === 'appointment') {
            setShowNotifications(false);
            navigate('/view-appointments');
        }
    };

    // Format time to relative format (e.g., "2 hours ago")
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('doctorToken');
            if (!token) return;

            // Try to mark all as read via API
            try {
                await axios.put(
                    'http://localhost:3000/notification/read-all',
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            } catch (apiError) {
                console.log('API not available, using local storage instead');
                // If API fails, update locally
                const updatedNotifications = notifications.map(notification => ({
                    ...notification,
                    read: true
                }));
                setNotifications(updatedNotifications);
                localStorage.setItem('mockAppointments', JSON.stringify(updatedNotifications));
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
                                        <div>
                                            <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatRelativeTime(notification.time)}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
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

export default DoctorNotification;
