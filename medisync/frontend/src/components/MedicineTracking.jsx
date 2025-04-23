import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaExclamation, FaChevronLeft, FaChevronRight, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MedicineNotification from './MedicineNotification';

// Utility functions
const canMarkAsTaken = (date) => {
    const now = new Date();
    const medicineTime = new Date(date);
    const timeDiff = Math.abs(now - medicineTime);
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff <= 2; // Can take medicine within 2 hours of scheduled time
};

const getTimeDifferenceMessage = (date) => {
    const now = new Date();
    const medicineTime = new Date(date);
    const timeDiff = medicineTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff > 2) {
        return `Scheduled in ${Math.round(hoursDiff)} hours`;
    } else if (hoursDiff > 0) {
        return 'Due now';
    } else if (hoursDiff > -2) {
        return 'Take soon';
    } else {
        return 'Time window expired';
    }
};

const MedicineTracking = ({ prescriptionId }) => {
    const navigate = useNavigate();
    const [trackingData, setTrackingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [streakData, setStreakData] = useState({
        currentStreak: 0,
        longestStreak: 0,
        totalCompleted: 0
    });
    const [selectedPrescription, setSelectedPrescription] = useState({
        id: 'default',
        name: 'Daily Medications',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    const [showTracking, setShowTracking] = useState(true);
    const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
    const [showRemoveMedicineModal, setShowRemoveMedicineModal] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [showManualForm, setShowManualForm] = useState(false);
    const [streakMedicines, setStreakMedicines] = useState([]);
    const [newMedicine, setNewMedicine] = useState({
        name: '',
        dosage: '',
        timing: 'Morning'
    });
    const [currentStreak, setCurrentStreak] = useState(0);
    const [reminders, setReminders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDateDetails, setShowDateDetails] = useState(false);
    const [selectedDateMedicines, setSelectedDateMedicines] = useState([]);
    const [showMedicineModal, setShowMedicineModal] = useState(false);
    const [hoveredDay, setHoveredDay] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    // Load reminders from localStorage when component mounts
    useEffect(() => {
        const loadReminders = () => {
            const savedReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
            setReminders(savedReminders);
        };

        loadReminders();
        // Add event listener for reminders changes
        window.addEventListener('remindersChanged', loadReminders);

        return () => {
            window.removeEventListener('remindersChanged', loadReminders);
        };
    }, []);

    // Function to get medicines for a specific date
    const getMedicinesForDate = (date) => {
        if (!date) return [];
        return reminders.filter(reminder => {
            const reminderDate = new Date(reminder.date);
            return reminderDate.toDateString() === date.toDateString();
        });
    };

    // Function to render medicine tooltip
    const renderMedicineTooltip = (date) => {
        const medicines = getMedicinesForDate(date);
        if (!medicines || medicines.length === 0) return null;

        return (
            <div className="absolute z-50 bg-white rounded-lg shadow-xl p-4 min-w-[300px] border border-gray-200 transform -translate-x-1/2 left-1/2 bottom-full mb-2">
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {medicines.map((medicine, index) => {
                        const scheduledTime = new Date(medicine.date);
                        const canTake = canMarkAsTaken(medicine.date);
                        const timeMessage = getTimeDifferenceMessage(medicine.date);
                        
                        return (
                            <div 
                                key={index} 
                                className={`p-3 rounded-lg border ${
                                    medicine.completed 
                                        ? 'bg-green-50 border-green-200' 
                                        : timeMessage === 'Time window expired'
                                            ? 'bg-red-50 border-red-200'
                                            : 'bg-white border-gray-200'
                                }`}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h4 className="font-medium">{medicine.medicine}</h4>
                                        <p className="text-xs text-gray-600">
                                            Time: {scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            Dosage: {medicine.dosage || 'Not specified'}
                                        </p>
                                        {medicine.completed ? (
                                            <p className="text-xs text-green-600">
                                                Taken at: {new Date(medicine.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        ) : (
                                            <p className={`text-xs ${
                                                timeMessage === 'Time window expired' 
                                                    ? 'text-red-600' 
                                                    : canTake 
                                                        ? 'text-green-600'
                                                        : 'text-yellow-600'
                                            }`}>
                                                {timeMessage}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReminderComplete(medicine.id, medicine.date);
                                        }}
                                        disabled={!canTake || medicine.completed}
                                        className={`p-1.5 rounded-full ${
                                            medicine.completed
                                                ? 'bg-green-500 text-white cursor-not-allowed'
                                                : !canTake
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-green-500 text-white hover:bg-green-600'
                                        }`}
                                        title={
                                            medicine.completed
                                                ? "Already taken"
                                                : !canTake
                                                    ? "Cannot take now"
                                                    : "Mark as taken"
                                        }
                                    >
                                        <FaCheck className="text-sm" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Generate calendar days for the current month
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const days = [];
        let currentStreak = 0;
        let longestStreak = 0;
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push({ date: null, status: null });
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            
            // Get all reminders for this day
            const dayReminders = reminders.filter(r => {
                const reminderDate = new Date(r.date);
                return reminderDate.toDateString() === date.toDateString();
            });

            // Calculate status based on medicine completion
            let status = 'none'; // Default status (red)
            if (dayReminders.length > 0) {
                const completedCount = dayReminders.filter(r => r.completed).length;
                const totalCount = dayReminders.length;
                
                if (completedCount === totalCount) {
                    status = 'all'; // All medicines taken (green)
                    currentStreak++;
                    longestStreak = Math.max(longestStreak, currentStreak);
                } else if (completedCount > 0) {
                    status = 'some'; // Some medicines taken (yellow)
                    currentStreak = 0;
                } else {
                    status = 'none'; // No medicines taken (red)
                    currentStreak = 0;
                }
            }
            
            days.push({
                date,
                status,
                medicines: dayReminders.map(r => ({
                    name: r.medicineName,
                    time: r.time,
                    completed: r.completed,
                    dosage: r.dosage
                }))
            });
        }
        
        // Update streak data
        return {
            days,
            streakInfo: {
                currentStreak,
                longestStreak
            }
        };
    };

    useEffect(() => {
        const fetchTrackingData = async () => {
            try {
                setLoading(true);
                // Get reminders data from localStorage
                const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
                const prescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
                
                // Get medicines from prescriptions with their duration
                const prescriptionMedicines = prescriptions.map(prescription => ({
                    name: prescription.medicine,
                    dosage: prescription.dosage,
                    timing: prescription.timing,
                    duration: prescription.duration,
                    startDate: prescription.startDate,
                    endDate: prescription.endDate
                }));

                // Get manually added medicines
                const manualMedicines = JSON.parse(localStorage.getItem('manualMedicines') || '[]');

                // Combine both lists
                setMedicines([...prescriptionMedicines, ...manualMedicines]);

                // Generate tracking data for each day
                const startDate = new Date();
                const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                const days = [];
                
                for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                    // Get all reminders for this day
                    const dayReminders = reminders.filter(r => {
                        const reminderDate = new Date(r.date);
                        return reminderDate.toDateString() === date.toDateString();
                    });

                    // Group reminders by medicine and timing
                    const medicineGroups = dayReminders.reduce((acc, reminder) => {
                        const key = `${reminder.medicineName}-${reminder.timing}`;
                        if (!acc[key]) {
                            acc[key] = {
                                medicineName: reminder.medicineName,
                                timing: reminder.timing,
                                reminders: [],
                                duration: prescriptionMedicines.find(m => m.name === reminder.medicineName)?.duration || 'N/A',
                                startDate: prescriptionMedicines.find(m => m.name === reminder.medicineName)?.startDate || 'N/A',
                                endDate: prescriptionMedicines.find(m => m.name === reminder.medicineName)?.endDate || 'N/A'
                            };
                        }
                        acc[key].reminders.push(reminder);
                        return acc;
                    }, {});

                    let status = 'missed'; // Default status
                    
                    if (Object.keys(medicineGroups).length > 0) {
                        // Check if all medicines and their timings are completed
                        const allCompleted = Object.values(medicineGroups).every(group => 
                            group.reminders.every(r => r.completed)
                        );
                        
                        // Check if any medicine or timing is completed
                        const anyCompleted = Object.values(medicineGroups).some(group => 
                            group.reminders.some(r => r.completed)
                        );

                        if (allCompleted) {
                            status = 'completed';
                        } else if (anyCompleted) {
                            status = 'partial';
                        }
                    }

                    days.push({
                        date: new Date(date),
                        status,
                        details: Object.values(medicineGroups).map(group => ({
                            medicineName: group.medicineName,
                            timing: group.timing,
                            completed: group.reminders.every(r => r.completed),
                            duration: group.duration,
                            startDate: group.startDate,
                            endDate: group.endDate
                        }))
                    });
                }

                setTrackingData(days);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching tracking data:', err);
                setError('Failed to load tracking data');
                setLoading(false);
            }
        };

        fetchTrackingData();
    }, [currentDate]);

    useEffect(() => {
        const { streakInfo } = getCalendarDays();
        setStreakData(prev => ({
            ...prev,
            currentStreak: streakInfo.currentStreak,
            longestStreak: Math.max(prev.longestStreak, streakInfo.longestStreak)
        }));
    }, [currentDate, reminders]);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                // Get medicines from localStorage
                const storedMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
                const prescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
                const streakMedicines = JSON.parse(localStorage.getItem('streakMedicines') || '[]');
                
                // Combine medicines from prescriptions and stored medicines
                const allMedicines = [
                    ...storedMedicines,
                    ...prescriptions.flatMap(p => p.medicines || []),
                    ...streakMedicines
                ];

                // Remove duplicates
                const uniqueMedicines = Array.from(new Set(allMedicines.map(m => m.name)))
                    .map(name => allMedicines.find(m => m.name === name));

                setMedicines(uniqueMedicines);
                setStreakMedicines(streakMedicines);
            } catch (err) {
                console.error('Error fetching medicines:', err);
            }
        };

        fetchMedicines();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <FaCheck className="text-white" />;
            case 'partial':
                return <FaExclamation className="text-white" />;
            case 'missed':
                return <FaTimes className="text-white" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'partial':
                return 'bg-blue-500';
            case 'missed':
                return 'bg-red-500';
            default:
                return 'bg-gray-200';
        }
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const handleAddMedicine = () => {
        if (newMedicine.name.trim() === '') return;

        const medicineToAdd = {
            ...newMedicine,
            id: Date.now().toString()
        };

        setMedicines([...medicines, medicineToAdd]);
        setSelectedMedicines([...selectedMedicines, medicineToAdd]);
        
        // Save to localStorage
        const storedMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
        localStorage.setItem('medicines', JSON.stringify([...storedMedicines, medicineToAdd]));

        setNewMedicine({
            name: '',
            dosage: '',
            timing: 'Morning'
        });
        setShowAddMedicineModal(false);
    };

    const handleRemoveMedicine = (medicineId) => {
        // Remove from streakMedicines state
        const updatedStreakMedicines = streakMedicines.filter(m => m.id !== medicineId);
        setStreakMedicines(updatedStreakMedicines);
        
        // Update localStorage
        localStorage.setItem('streakMedicines', JSON.stringify(updatedStreakMedicines));
    };

    const handleSelectMedicine = (medicine) => {
        if (!selectedMedicines.some(m => m.id === medicine.id)) {
            setSelectedMedicines([...selectedMedicines, medicine]);
        }
    };

    const handleAddManualMedicine = () => {
        if (!newMedicine.name.trim()) return;

        const medicineToAdd = {
            ...newMedicine,
            id: Date.now().toString()
        };

        // Add to medicines list
        setMedicines([...medicines, medicineToAdd]);
        
        // Save to localStorage
        const storedMedicines = JSON.parse(localStorage.getItem('manualMedicines') || '[]');
        localStorage.setItem('manualMedicines', JSON.stringify([...storedMedicines, medicineToAdd]));

        // Reset form
        setNewMedicine({
            name: '',
            dosage: '',
            timing: 'Morning'
        });
        setShowManualForm(false);
    };

    const handleDateClick = (day) => {
        if (!day.date) return;

        // Get all reminders for the selected date
        const selectedReminders = reminders.filter(reminder => {
            const reminderDate = new Date(reminder.date);
            return reminderDate.toDateString() === day.date.toDateString();
        });

        setSelectedDateMedicines(selectedReminders);
        setShowMedicineModal(true);
    };

    const handleReminderComplete = async (medicineId, date) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tracking/mark-taken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    medicineId,
                    date,
                    prescriptionId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to mark medicine as taken');
            }

            // Refresh tracking data
            fetchTrackingData();
            setShowNotification(true);
            setNotificationMessage('Medicine marked as taken!');
            setTimeout(() => setShowNotification(false), 3000);
        } catch (error) {
            console.error('Error marking medicine as taken:', error);
            setError('Failed to mark medicine as taken. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    const { days } = getCalendarDays();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Function to render medicine details modal
    const renderMedicineModal = () => {
        if (!showMedicineModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                            Medicines for {selectedDateMedicines[0]?.date ? new Date(selectedDateMedicines[0].date).toLocaleDateString() : 'Selected Date'}
                        </h3>
                        <button 
                            onClick={() => setShowMedicineModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes />
                        </button>
                    </div>
                    
                    {selectedDateMedicines.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">No medicines scheduled for this date.</p>
                    ) : (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {selectedDateMedicines.map((medicine, index) => {
                                const scheduledTime = new Date(medicine.date);
                                const canTake = canMarkAsTaken(medicine.date);
                                const timeMessage = getTimeDifferenceMessage(medicine.date);
                                
                                return (
                                    <div 
                                        key={index} 
                                        className={`p-4 rounded-lg border ${
                                            medicine.completed 
                                                ? 'bg-green-50 border-green-200' 
                                                : timeMessage === 'Time window expired'
                                                    ? 'bg-red-50 border-red-200'
                                                    : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-lg">{medicine.medicine}</h4>
                                                <p className="text-sm text-gray-600">
                                                    Scheduled: {scheduledTime.toLocaleTimeString()}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Dosage: {medicine.dosage || 'Not specified'}
                                                </p>
                                                {medicine.completed && (
                                                    <p className="text-sm text-green-600">
                                                        Taken at: {new Date(medicine.completedAt).toLocaleTimeString()}
                                                    </p>
                                                )}
                                                {!medicine.completed && (
                                                    <p className={`text-sm ${
                                                        timeMessage === 'Time window expired' 
                                                            ? 'text-red-600' 
                                                            : canTake 
                                                                ? 'text-green-600'
                                                                : 'text-yellow-600'
                                                    }`}>
                                                        {timeMessage}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleReminderComplete(medicine.id, medicine.date)}
                                                    disabled={!canTake || medicine.completed}
                                                    className={`p-2 rounded-full ${
                                                        medicine.completed
                                                            ? 'bg-green-500 text-white cursor-not-allowed'
                                                            : !canTake
                                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                                : 'bg-green-500 text-white hover:bg-green-600'
                                                    }`}
                                                    title={
                                                        medicine.completed
                                                            ? "Already taken"
                                                            : !canTake
                                                                ? "Cannot take now"
                                                                : "Mark as taken"
                                                    }
                                                >
                                                    <FaCheck />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                >
                    <FaArrowLeft className="mr-2" /> Back
                </button>
                <h2 className="text-2xl font-bold text-center">Medicine Tracking</h2>
                <div className="w-24"></div>
            </div>

            {/* Calendar Navigation */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded"
                >
                    <FaChevronLeft />
                </button>
                <h3 className="text-xl font-semibold">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded"
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold p-2">
                        {day}
                    </div>
                ))}
                {days.map((day, index) => {
                    if (!day.date) {
                        return (
                            <div key={index} className="p-2 bg-gray-100 rounded-lg text-center">
                                &nbsp;
                            </div>
                        );
                    }

                    const dayMedicines = getMedicinesForDate(day.date);
                    const allTaken = dayMedicines.length > 0 && dayMedicines.every(m => m.completed);
                    const someTaken = dayMedicines.some(m => m.completed);
                    const hasExpired = dayMedicines.some(m => getTimeDifferenceMessage(m.date) === 'Time window expired');
                    
                    return (
                        <div
                            key={index}
                            onMouseEnter={() => setHoveredDay(index)}
                            onMouseLeave={() => setHoveredDay(null)}
                            className={`
                                p-2 rounded-lg text-center relative
                                ${allTaken ? 'bg-green-200 hover:bg-green-300' :
                                  someTaken ? 'bg-yellow-200 hover:bg-yellow-300' :
                                  hasExpired ? 'bg-red-200 hover:bg-red-300' :
                                  dayMedicines.length > 0 ? 'bg-white hover:bg-gray-100' :
                                  'bg-gray-50'}
                                ${day.date.toDateString() === new Date().toDateString() ? 'ring-2 ring-blue-500' : ''}
                                transition-all duration-200 ease-in-out
                                hover:shadow-md
                            `}
                        >
                            <span className="text-sm">{day.date.getDate()}</span>
                            {dayMedicines.length > 0 && (
                                <span className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                                    {dayMedicines.length}
                                </span>
                            )}
                            {hoveredDay === index && dayMedicines.length > 0 && renderMedicineTooltip(day.date)}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-center items-center space-x-4 mt-4 text-sm">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-200 rounded mr-2"></div>
                    <span>All Taken</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-200 rounded mr-2"></div>
                    <span>Partially Taken</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
                    <span>None Taken</span>
                </div>
            </div>

            {/* Streak Information */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-gray-600">Current Streak</p>
                        <p className="text-2xl font-bold">{streakData.currentStreak}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Longest Streak</p>
                        <p className="text-2xl font-bold">{streakData.longestStreak}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Total Completed</p>
                        <p className="text-2xl font-bold">{streakData.totalCompleted}</p>
                    </div>
                </div>
            </div>

            {/* Medicine Details Modal */}
            {renderMedicineModal()}

            {showNotification && (
                <MedicineNotification message={notificationMessage} />
            )}
        </div>
    );
};

export default MedicineTracking; 