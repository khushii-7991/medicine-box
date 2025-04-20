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
        frequency: '',
        startDate: '',
        endDate: ''
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
                
                // For default prescription, get all reminders
                const prescriptionReminders = prescriptionId === 'default' 
                    ? reminders 
                    : reminders.filter(r => r.prescriptionId === prescriptionId);

                // Generate tracking data for each day
                const startDate = new Date();
                const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                const days = [];
                
                for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                    const dayReminders = prescriptionReminders.filter(r => {
                        const reminderDate = new Date(r.date);
                        return reminderDate.toDateString() === date.toDateString();
                    });

                    let status = 'missed'; // Default status
                    if (dayReminders.length > 0) {
                        const takenCount = dayReminders.filter(r => r.completed).length;
                        const totalCount = dayReminders.length;
                        
                        if (takenCount === totalCount) {
                            status = 'completed';
                        } else if (takenCount > 0) {
                            status = 'partial';
                        }
                    }

                    days.push({
                        date: new Date(date),
                        status
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
            frequency: 'Once a Day',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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

        // Add to streak medicines
        const updatedStreakMedicines = [...selectedMedicines, medicineToAdd];
        setSelectedMedicines(updatedStreakMedicines);
        localStorage.setItem('streakMedicines', JSON.stringify(updatedStreakMedicines));

        // Reset form
        setNewMedicine({
            name: '',
            dosage: '',
            frequency: 'Once a Day',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
                <h3 className="text-xl font-semibold mb-4">Your Medicines</h3>
                {streakMedicines.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">No medicines added yet</p>
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => navigate('/view-prescriptions')}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                            >
                                <FaPlus /> Add from Prescriptions
                            </button>
                            <button
                                onClick={() => setShowManualForm(true)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                            >
                                <FaPlus /> Add Manually
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {streakMedicines.map(medicine => (
                            <div
                                key={medicine.id}
                                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm">{medicine.name}</h4>
                                    <p className="text-xs text-gray-600">
                                        {medicine.dosage} - {medicine.frequency}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(medicine.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(medicine.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                    <button
                                        onClick={() => handleRemoveMedicine(medicine.id)}
                                        className="text-red-500 hover:text-red-600 flex items-center gap-0.5 text-xs"
                                    >
                                        <FaTimes className="text-xs" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center gap-2 mt-4">
                            <button
                                onClick={() => navigate('/view-prescriptions')}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                            >
                                <FaPlus /> Add More from Prescriptions
                            </button>
                            <button
                                onClick={() => setShowManualForm(true)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                            >
                                <FaPlus /> Add Manually
                            </button>
                        </div>
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
                                        {medicine.name} - {medicine.dosage} ({medicine.frequency})
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
                                value={newMedicine.frequency}
                                onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                                className="w-full p-2 border rounded mb-2"
                            >
                                <option value="Once a Day">Once a Day</option>
                                <option value="2 Times a Day">2 Times a Day</option>
                                <option value="3 Times a Day">3 Times a Day</option>
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

            {/* Remove Medicine Modal */}
            {showRemoveMedicineModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Remove Medicine</h3>
                        <div className="max-h-60 overflow-y-auto">
                            {selectedMedicines.map(medicine => (
                                <div
                                    key={medicine.id}
                                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                                >
                                    <span>{medicine.name} - {medicine.dosage} ({medicine.frequency})</span>
                                    <button
                                        onClick={() => handleRemoveMedicine(medicine.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowRemoveMedicineModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Medicine Addition Modal */}
            {showManualForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
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
                                    Frequency
                                </label>
                                <select
                                    value={newMedicine.frequency}
                                    onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="Once a Day">Once a Day</option>
                                    <option value="2 Times a Day">2 Times a Day</option>
                                    <option value="3 Times a Day">3 Times a Day</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={newMedicine.startDate}
                                    onChange={(e) => setNewMedicine({ ...newMedicine, startDate: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={newMedicine.endDate}
                                    onChange={(e) => setNewMedicine({ ...newMedicine, endDate: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddManualMedicine}
                                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Add to Streak
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