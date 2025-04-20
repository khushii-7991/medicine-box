import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaExclamation, FaChevronLeft, FaChevronRight, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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

    // Generate calendar days for the current month
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push({ date: null, status: null });
        }
        
        // Add days of the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(year, month, i);
            const dayData = trackingData.find(d => 
                new Date(d.date).toDateString() === date.toDateString()
            );
            
            days.push({
                date,
                status: dayData ? dayData.status : null
            });
        }
        
        return days;
    };

    // Calculate streaks
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

    useEffect(() => {
        const fetchTrackingData = async () => {
            try {
                // Get reminders data from localStorage
                const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
                
                // Get medicines from reminders
                const reminderMedicines = reminders.reduce((acc, reminder) => {
                    if (!acc.some(m => m.name === reminder.medicineName)) {
                        acc.push({
                            name: reminder.medicineName,
                            dosage: reminder.dosage,
                            timing: reminder.timing
                        });
                    }
                    return acc;
                }, []);

                // Get manually added medicines
                const manualMedicines = JSON.parse(localStorage.getItem('manualMedicines') || '[]');

                // Combine both lists
                setMedicines([...reminderMedicines, ...manualMedicines]);

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
                                reminders: []
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
                            completed: group.reminders.every(r => r.completed)
                        }))
                    });
                }

                setTrackingData(days);
                calculateStreaks();
                setLoading(false);
            } catch (err) {
                console.error('Error fetching tracking data:', err);
                setError('Failed to load tracking data');
                setLoading(false);
            }
        };

        fetchTrackingData();

        // Listen for reminder changes
        const handleRemindersChange = () => {
            fetchTrackingData();
        };

        window.addEventListener('remindersChanged', handleRemindersChange);
        return () => {
            window.removeEventListener('remindersChanged', handleRemindersChange);
        };
    }, [prescriptionId]);

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'partial':
                return 'bg-yellow-500';
            case 'missed':
                return 'bg-red-500';
            default:
                return 'bg-gray-100';
        }
    };

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
                {/* Weekday Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600">
                        {day}
                    </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        className={`aspect-square rounded-lg flex items-center justify-center ${
                            day.date ? getStatusColor(day.status) : 'bg-transparent'
                        }`}
                        title={day.date ? `${day.date.toLocaleDateString()}: ${day.status || 'No data'}` : ''}
                    >
                        {day.date && (
                            <>
                                <div className="text-xs text-white font-medium">
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

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span>Partial</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Missed</span>
                </div>
            </div>

            {/* Medicines List Section */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Your Medicines</h3>
                    <button
                        onClick={() => setShowManualForm(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                    >
                        <FaPlus /> Add Medicine
                    </button>
                </div>
                {medicines.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">No medicines added yet</p>
                        <p className="text-sm text-gray-500">Add medicines in the Health Reminders page or manually here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {medicines.map(medicine => (
                            <div
                                key={medicine.id || medicine.name}
                                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm">{medicine.name}</h4>
                                    <p className="text-xs text-gray-600">
                                        {medicine.dosage} - {medicine.timing}
                                    </p>
                                </div>
                                {medicine.id && (
                                    <button
                                        onClick={() => {
                                            const updatedMedicines = medicines.filter(m => m.id !== medicine.id);
                                            setMedicines(updatedMedicines);
                                            localStorage.setItem('manualMedicines', JSON.stringify(updatedMedicines.filter(m => m.id)));
                                        }}
                                        className="text-red-500 hover:text-red-600 flex items-center gap-0.5 text-xs"
                                    >
                                        <FaTimes className="text-xs" /> Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Medicine Modal */}
            {showAddMedicineModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add Medicine</h3>
                        
                        {/* Existing Medicines List */}
                        <div className="mb-4">
                            <h4 className="font-medium mb-2">Select from existing medicines:</h4>
                            <div className="max-h-40 overflow-y-auto">
                                {medicines.map(medicine => (
                                    <div
                                        key={medicine.id}
                                        onClick={() => handleSelectMedicine(medicine)}
                                        className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                                    >
                                        {medicine.name} - {medicine.dosage} ({medicine.timing})
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add New Medicine Form */}
                        <div className="mb-4">
                            <h4 className="font-medium mb-2">Or add new medicine:</h4>
                            <input
                                type="text"
                                placeholder="Medicine Name"
                                value={newMedicine.name}
                                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="text"
                                placeholder="Dosage"
                                value={newMedicine.dosage}
                                onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <select
                                value={newMedicine.timing}
                                onChange={(e) => setNewMedicine({ ...newMedicine, timing: e.target.value })}
                                className="w-full p-2 border rounded mb-2"
                            >
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                                <option value="Night">Night</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowAddMedicineModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMedicine}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Medicine Addition Modal */}
            {showManualForm && (
                <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Add New Medicine</h3>
                            <button
                                onClick={() => setShowManualForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Medicine Name
                                </label>
                                <input
                                    type="text"
                                    value={newMedicine.name}
                                    onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter medicine name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dosage
                                </label>
                                <input
                                    type="text"
                                    value={newMedicine.dosage}
                                    onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    placeholder="Enter dosage"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Timing
                                </label>
                                <select
                                    value={newMedicine.timing}
                                    onChange={(e) => setNewMedicine({ ...newMedicine, timing: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="Morning">Morning</option>
                                    <option value="Afternoon">Afternoon</option>
                                    <option value="Evening">Evening</option>
                                    <option value="Night">Night</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddManualMedicine}
                                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Add Medicine
                                </button>
                                <button
                                    onClick={() => setShowManualForm(false)}
                                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicineTracking; 