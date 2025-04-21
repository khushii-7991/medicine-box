import React, { createContext, useState, useEffect, useContext } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get current user type and token
    const getCurrentUser = () => {
        const patientToken = localStorage.getItem('patientToken');
        const doctorToken = localStorage.getItem('doctorToken');
        
        if (patientToken) {
            return { token: patientToken, type: 'patient' };
        } else if (doctorToken) {
            return { token: doctorToken, type: 'doctor' };
        } else {
            return { token: null, type: null };
        }
    };
    
    // Fetch notifications from the API
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get current user info
            const { token, type } = getCurrentUser();
            
            if (!token) {
                console.error('No authentication token found');
                return;
            }
            
            console.log('Fetching notifications for user type:', type);
            
            const response = await fetch('http://localhost:3000/notifications/my-notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error fetching notifications: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Notifications received:', data.length, 'notifications');
            setNotifications(data);
            
            // Count unread notifications
            const unread = data.filter(notification => !notification.isRead).length;
            console.log('Unread notifications:', unread);
            setUnreadCount(unread);
            
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch unread notification count
    const fetchUnreadCount = async () => {
        try {
            // Get current user info
            const { token, type } = getCurrentUser();
            
            if (!token) {
                console.error('No authentication token found');
                return;
            }
            
            const response = await fetch('http://localhost:3000/notifications/unread-count', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error fetching unread count: ${response.status}`);
            }
            
            const data = await response.json();
            setUnreadCount(data.count);
            
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    // Mark a notification as read
    const markAsRead = async (notificationId) => {
        try {
            // Get current user info
            const { token, type } = getCurrentUser();
            
            if (!token) {
                console.error('No authentication token found');
                return;
            }
            
            const response = await fetch(`http://localhost:3000/notifications/mark-read/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error marking notification as read: ${response.status}`);
            }
            
            // Update local state
            setNotifications(prev => 
                prev.map(notification => 
                    notification._id === notificationId 
                        ? { ...notification, isRead: true } 
                        : notification
                )
            );
            
            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
            
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            // Get current user info
            const { token, type } = getCurrentUser();
            
            if (!token) {
                console.error('No authentication token found');
                return;
            }
            
            const response = await fetch('http://localhost:3000/notifications/mark-all-read', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error marking all notifications as read: ${response.status}`);
            }
            
            // Update local state
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, isRead: true }))
            );
            
            // Update unread count
            setUnreadCount(0);
            
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    // Delete a notification
    const deleteNotification = async (notificationId) => {
        try {
            // Get current user info
            const { token, type } = getCurrentUser();
            
            if (!token) {
                console.error('No authentication token found');
                return;
            }
            
            const response = await fetch(`http://localhost:3000/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error deleting notification: ${response.status}`);
            }
            
            // Update local state
            const deletedNotification = notifications.find(n => n._id === notificationId);
            const wasUnread = deletedNotification && !deletedNotification.isRead;
            
            setNotifications(prev => 
                prev.filter(notification => notification._id !== notificationId)
            );
            
            // Update unread count if the deleted notification was unread
            if (wasUnread) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    // Clear all notifications
    const clearAllNotifications = async () => {
        try {
            // Get token from localStorage
            const patientToken = localStorage.getItem('patientToken');
            const doctorToken = localStorage.getItem('doctorToken');
            const token = patientToken || doctorToken;
            
            if (!token) {
                console.error('No authentication token found');
                return;
            }
            
            const response = await fetch('http://localhost:3000/notifications/clear-all', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error clearing notifications: ${response.status}`);
            }
            
            // Update local state
            setNotifications([]);
            setUnreadCount(0);
            
        } catch (err) {
            console.error('Error clearing notifications:', err);
        }
    };

    // Fetch notifications on mount and when token changes
    useEffect(() => {
        const patientToken = localStorage.getItem('patientToken');
        const doctorToken = localStorage.getItem('doctorToken');
        
        if (patientToken || doctorToken) {
            // Initial fetch
            fetchNotifications();
            
            // Set up polling for new notifications - more frequent checks
            const notificationInterval = setInterval(() => {
                console.log('Polling for new notifications...');
                fetchNotifications();
            }, 10000); // Check for new notifications every 10 seconds
            
            // Set up polling for unread count - even more frequent
            const countInterval = setInterval(() => {
                fetchUnreadCount();
            }, 5000); // Check for unread count every 5 seconds
            
            return () => {
                clearInterval(notificationInterval);
                clearInterval(countInterval);
            };
        }
    }, []);

    const value = {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
