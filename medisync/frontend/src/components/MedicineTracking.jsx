import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaExclamation, FaChevronLeft, FaChevronRight, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MedicineNotification from './MedicineNotification';

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
            const dayData = trackingData.find(d => 
                d.date && d.date.toDateString() === date.toDateString()
            );

            if (dayData) {
                if (dayData.status === 'completed') {
                    currentStreak++;
                    longestStreak = Math.max(longestStreak, currentStreak);
                } else {
                    currentStreak = 0;
                }
            }
            
            days.push({
                date,
                status: dayData ? dayData.status : null,
                details: dayData ? dayData.details : []
            });
        }
        
        return days;
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
        const calculateStreaks = () => {
            let currentStreak = 0;
            let longestStreak = 0;
            let tempStreak = 0;
            let totalCompleted = 0;

            trackingData.forEach(day => {
                if (day.status === 'completed') {
                    tempStreak++;
                    totalCompleted++;
                    if (tempStreak > longestStreak) {
                        longestStreak = tempStreak;
                    }
                } else {
                    if (tempStreak > 0) {
                        currentStreak = tempStreak;
                    }
                    tempStreak = 0;
                }
            });

            setStreakData({
                currentStreak,
                longestStreak,
                totalCompleted
            });
        };

        calculateStreaks();
    }, [trackingData]);

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
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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
        if (day.date) {
            setSelectedDate(day);
            setShowDateDetails(true);
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

    const calendarDays = getCalendarDays();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Medication Calendar</h2>
            </div>

            {/* Streak Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{streakData.currentStreak}</div>
                    <div className="text-sm text-gray-600">Current Streak</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{streakData.longestStreak}</div>
                    <div className="text-sm text-gray-600">Longest Streak</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{streakData.totalCompleted}</div>
                    <div className="text-sm text-gray-600">Total Completed</div>
                </div>
            </div>

            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <FaChevronLeft className="text-gray-600" />
                </button>
                <h3 className="text-lg font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <FaChevronRight className="text-gray-600" />
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
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Date Details Modal */}
            {showDateDetails && selectedDate && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">
                                {selectedDate.date.toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </h3>
                            <button
                                onClick={() => setShowDateDetails(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {selectedDate.details && selectedDate.details.length > 0 ? (
                            <div className="space-y-4">
                                {selectedDate.details.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-lg bg-white border border-gray-200"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">{detail.medicineName}</h4>
                                                <p className="text-sm text-gray-600">{detail.timing}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Duration: {detail.duration}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    From: {new Date(detail.startDate).toLocaleDateString()} to {new Date(detail.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full ${
                                                detail.completed ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-600">No medicines scheduled for this day</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>All Taken</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Some Taken</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>None Taken</span>
                </div>
            </div>

            {/* Add the MedicineNotification component */}
            <MedicineNotification />
        </div>
    );
};

export default MedicineTracking; 