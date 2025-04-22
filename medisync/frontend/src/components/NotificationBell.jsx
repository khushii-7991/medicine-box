import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaCheck, FaTrash, FaCheckDouble, FaCalendarAlt, FaPills, FaFileMedical } from 'react-icons/fa';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { 
        notifications, 
        unreadCount, 
        loading, 
        fetchNotifications, 
        markAsRead, 
        markAllAsRead, 
        deleteNotification, 
        clearAllNotifications 
    } = useNotifications();
    
    // For debugging
    useEffect(() => {
        console.log('NotificationBell rendered with:', { 
            notificationCount: notifications?.length || 0,
            unreadCount,
            loading
        });
    }, [notifications, unreadCount, loading]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        
        // If today, show time
        if (date.toDateString() === now.toDateString()) {
            return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        // If yesterday, show "Yesterday"
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        // Otherwise show date
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Get icon based on notification type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'appointment':
                return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <FaCalendarAlt />
                </div>;
            case 'medication':
                return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    <FaPills />
                </div>;
            case 'prescription':
                return <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                    <FaFileMedical />
                </div>;
            default:
                return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <FaBell />
                </div>;
        }
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
        
        // Navigate to related content based on notification type
        // This can be expanded based on your application's routing
        switch (notification.type) {
            case 'appointment':
                // Navigate to appointment details
                break;
            case 'medication':
                // Navigate to medication schedule
                break;
            case 'prescription':
                // Navigate to prescription details
                break;
            default:
                // Default action
                break;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell */}
            <button 
                className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
                onClick={() => {
                    // Always fetch notifications when opening the dropdown
                    if (!showDropdown) {
                        console.log('Fetching notifications on bell click');
                        fetchNotifications();
                    }
                    setShowDropdown(!showDropdown);
                }}
                aria-label="Notifications"
                title="Notifications"
            >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">Notifications</h3>
                        <div className="flex space-x-2">
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllAsRead}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                    title="Mark all as read"
                                >
                                    <FaCheckDouble className="mr-1" />
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button 
                                    onClick={clearAllNotifications}
                                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                                    title="Clear all notifications"
                                >
                                    <FaTrash className="mr-1" />
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin inline-block w-6 h-6 border-2 border-t-green-600 border-green-200 rounded-full mb-2"></div>
                            <p>Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>No notifications</p>
                        </div>
                    ) : (
                        <div>
                            {notifications.map(notification => (
                                <div 
                                    key={notification._id}
                                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer flex items-start ${!notification.isRead ? 'bg-blue-50' : ''} ${notification.type === 'medication' ? 'bg-green-50' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="mr-3">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`font-medium ${!notification.isRead ? 'text-blue-700' : 'text-gray-800'} ${notification.type === 'medication' ? 'text-green-700' : ''}`}>
                                                {notification.title}
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(notification.createdAt)}
                                                </span>
                                                <div className="flex">
                                                    {!notification.isRead && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notification._id);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="Mark as read"
                                                        >
                                                            <FaCheck className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification._id);
                                                        }}
                                                        className="ml-2 text-red-600 hover:text-red-800"
                                                        title="Delete notification"
                                                    >
                                                        <FaTrash className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`text-sm mt-1 ${!notification.isRead ? 'text-blue-600' : 'text-gray-600'} ${notification.type === 'medication' ? 'text-green-700' : ''}`}>
                                            {notification.type === 'medication' ? (
                                                <div className="whitespace-pre-line">{notification.message}</div>
                                            ) : (
                                                <p>{notification.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
