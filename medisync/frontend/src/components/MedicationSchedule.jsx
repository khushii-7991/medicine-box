import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiClock, FiCalendar, FiCheckCircle, FiXCircle, FiAlertCircle, 
    FiChevronLeft, FiChevronRight, FiInfo, FiActivity, FiPieChart
} from 'react-icons/fi';

const MedicationSchedule = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [stats, setStats] = useState({
        adherenceRate: 0,
        todayStats: {
            totalDoses: 0,
            takenDoses: 0,
            pendingDoses: 0,
            adherenceRate: 0
        }
    });
    const [activeTab, setActiveTab] = useState('today');
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateSchedule, setDateSchedule] = useState([]);
    const [reminders, setReminders] = useState([]);

    // Load reminders from localStorage
    useEffect(() => {
        const savedReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        setReminders(savedReminders);
    }, []);

    // Format date for display
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format time for display
    const formatTime = (timeString) => {
        return timeString;
    };

    // Get status color
    const getStatusColor = (status) => {
        switch(status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'missed':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch(status) {
            case 'completed':
                return <FiCheckCircle className="h-5 w-5 text-green-600" />;
            case 'missed':
                return <FiXCircle className="h-5 w-5 text-red-600" />;
            case 'pending':
                return <FiAlertCircle className="h-5 w-5 text-yellow-600" />;
            case 'scheduled':
                return <FiCalendar className="h-5 w-5 text-blue-600" />;
            default:
                return <FiInfo className="h-5 w-5 text-gray-600" />;
        }
    };

    // Get calendar days with medicine status
    const getCalendarDays = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push({ date: null, status: null, medicines: [] });
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            
            // Find reminders for this date
            const dateReminders = reminders.filter(reminder => {
                const reminderDate = new Date(reminder.date);
                const reminderEndDate = new Date(reminder.endDate);
                return date >= reminderDate && date <= reminderEndDate;
            });
            
            // Determine status based on reminders
            let status = null;
            if (dateReminders.length > 0) {
                const todayReminders = dateReminders.filter(r => {
                    const rDate = new Date(r.date);
                    return rDate.toISOString().split('T')[0] === dateString;
                });

                if (todayReminders.length > 0) {
                    if (todayReminders.every(r => r.completed)) {
                        status = 'completed';
                    } else if (todayReminders.some(r => r.missed)) {
                        status = 'missed';
                    } else {
                        status = 'pending';
                    }
                } else {
                    status = 'scheduled';
                }
            }
            
            days.push({
                date,
                status,
                medicines: dateReminders.map(r => ({
                    name: r.medicineName,
                    time: r.time,
                    completed: r.completed,
                    missed: r.missed,
                    isToday: new Date(r.date).toISOString().split('T')[0] === dateString
                }))
            });
        }
        
        return days;
    };

    // Handle date click
    const handleDateClick = (day) => {
        if (day.date) {
            setSelectedDate(day.date);
            setDateSchedule(day.medicines);
        }
    };

    // Handle date change
    const changeDate = (direction) => {
        const newDate = new Date(selectedDate);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setSelectedDate(newDate);
    };

    const calendarDays = getCalendarDays();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Medication Calendar</h2>
            </div>

            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => changeDate('prev')}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <FiChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h3 className="text-lg font-semibold">
                    {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </h3>
                <button
                    onClick={() => changeDate('next')}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <FiChevronRight className="h-5 w-5 text-gray-600" />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-medium text-gray-600">
                        {day}
                    </div>
                ))}
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        onClick={() => handleDateClick(day)}
                        className={`relative p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group ${
                            day.date ? 'h-20' : 'h-20 bg-gray-50'
                        } ${day.status ? getStatusColor(day.status) : ''}`}
                    >
                        {day.date && (
                            <>
                                <div className="text-sm font-medium">
                                    {day.date.getDate()}
                                </div>
                                {day.status && (
                                    <div className="absolute bottom-1 right-1">
                                        {getStatusIcon(day.status)}
                                    </div>
                                )}
                                {day.medicines.length > 0 && (
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
                                        {day.medicines.length} medicine{day.medicines.length > 1 ? 's' : ''}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Selected Date Details */}
            {dateSchedule.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Medicines for {formatDate(selectedDate)}
                    </h3>
                    <div className="space-y-4">
                        {dateSchedule.map((medicine, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg bg-white border border-gray-200"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">{medicine.name}</h4>
                                        {medicine.isToday && (
                                            <p className="text-sm text-gray-600">
                                                Time: {formatTime(medicine.time)}
                                            </p>
                                        )}
                                    </div>
                                    {medicine.isToday && (
                                        <div className={`w-4 h-4 rounded-full ${
                                            medicine.completed ? 'bg-green-500' : 
                                            medicine.missed ? 'bg-red-500' : 'bg-yellow-500'
                                        }`} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="mt-6 flex justify-center space-x-4">
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">Missed</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Scheduled</span>
                </div>
            </div>
        </div>
    );
};

export default MedicationSchedule;
