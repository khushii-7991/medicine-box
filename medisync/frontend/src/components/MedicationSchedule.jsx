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
            case 'taken':
                return 'text-green-600';
            case 'skipped':
                return 'text-red-600';
            default:
                return 'text-yellow-600';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch(status) {
            case 'taken':
                return <FiCheckCircle className="h-5 w-5 text-green-600" />;
            case 'skipped':
                return <FiXCircle className="h-5 w-5 text-red-600" />;
            default:
                return <FiAlertCircle className="h-5 w-5 text-yellow-600" />;
        }
    };

    // Load today's schedule
    useEffect(() => {
        const fetchTodaySchedule = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('patientToken');
                if (!token) {
                    navigate('/login/patient');
                    return;
                }

                const response = await fetch('http://localhost:3000/schedule/today', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch today\'s schedule');
                }

                const data = await response.json();
                setTodaySchedule(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching schedule:', err);
                setError(err.message || 'Failed to load schedule');
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('patientToken');
                if (!token) {
                    navigate('/login/patient');
                    return;
                }

                const response = await fetch('http://localhost:3000/schedule/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }

                const data = await response.json();
                setStats(data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };

        const fetchAllSchedules = async () => {
            try {
                const token = localStorage.getItem('patientToken');
                if (!token) {
                    navigate('/login/patient');
                    return;
                }

                const response = await fetch('http://localhost:3000/schedule/patient', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch schedules');
                }

                const data = await response.json();
                setSchedules(data);
            } catch (err) {
                console.error('Error fetching schedules:', err);
            }
        };

        fetchTodaySchedule();
        fetchStats();
        fetchAllSchedules();
    }, [navigate]);

    // Update dose status
    const updateDoseStatus = async (scheduleId, medicineId, doseIndex, status) => {
        try {
            const token = localStorage.getItem('patientToken');
            if (!token) {
                navigate('/login/patient');
                return;
            }

            const response = await fetch('http://localhost:3000/schedule/update-dose', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    scheduleId,
                    date: new Date(),
                    medicineId,
                    doseIndex,
                    status,
                    notes: ''
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update dose status');
            }

            // Refresh today's schedule
            const updatedResponse = await fetch('http://localhost:3000/schedule/today', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!updatedResponse.ok) {
                throw new Error('Failed to refresh schedule');
            }

            const data = await updatedResponse.json();
            setTodaySchedule(data);

            // Refresh stats
            const statsResponse = await fetch('http://localhost:3000/schedule/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats(statsData);
            }
        } catch (err) {
            console.error('Error updating dose status:', err);
            setError(err.message || 'Failed to update dose status');
        }
    };

    // Handle date change
    const changeDate = (direction) => {
        const newDate = new Date(selectedDate);
        if (direction === 'prev') {
            newDate.setDate(newDate.getDate() - 1);
        } else {
            newDate.setDate(newDate.getDate() + 1);
        }
        setSelectedDate(newDate);
        
        // Find schedule for this date
        findScheduleForDate(newDate);
    };

    // Find schedule for a specific date
    const findScheduleForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        
        const dateSchedules = [];
        
        schedules.forEach(schedule => {
            const dailySchedule = schedule.dailySchedule.find(day => {
                const dayDate = new Date(day.date);
                return dayDate.toISOString().split('T')[0] === dateStr;
            });
            
            if (dailySchedule) {
                dateSchedules.push({
                    scheduleId: schedule._id,
                    prescriptionId: schedule.prescriptionId,
                    date: dailySchedule.date,
                    medicines: dailySchedule.medicines,
                    completed: dailySchedule.completed
                });
            }
        });
        
        setDateSchedule(dateSchedules);
    };

    // Handle tab change
    useEffect(() => {
        if (activeTab === 'calendar' && schedules.length > 0) {
            findScheduleForDate(selectedDate);
        }
    }, [activeTab, schedules, selectedDate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                    Medication Schedule
                </h1>
                <p className="text-gray-600 mb-8">
                    Track and manage your prescribed medications
                </p>

                {/* Stats Overview */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FiActivity className="mr-2 text-indigo-600" />
                        Medication Adherence
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-indigo-50 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-600 mb-1">Today's Doses</p>
                            <p className="text-2xl font-bold text-indigo-700">
                                {stats.todayStats.takenDoses}/{stats.todayStats.totalDoses}
                            </p>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-600 mb-1">Pending Doses</p>
                            <p className="text-2xl font-bold text-amber-600">
                                {stats.todayStats.pendingDoses}
                            </p>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-600 mb-1">Overall Adherence</p>
                            <p className="text-2xl font-bold text-green-600">
                                {Math.round(stats.adherenceRate)}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`px-6 py-3 text-sm font-medium ${
                                activeTab === 'today'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('today')}
                        >
                            <FiClock className="inline mr-2" />
                            Today's Schedule
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium ${
                                activeTab === 'calendar'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('calendar')}
                        >
                            <FiCalendar className="inline mr-2" />
                            Calendar View
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium ${
                                activeTab === 'stats'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('stats')}
                        >
                            <FiPieChart className="inline mr-2" />
                            Statistics
                        </button>
                    </div>

                    {/* Today's Schedule Tab */}
                    {activeTab === 'today' && (
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                {formatDate(new Date())}
                            </h2>
                            
                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading your schedule...</p>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 p-4 rounded-lg text-red-700">
                                    {error}
                                </div>
                            ) : todaySchedule.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <FiInfo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No medications scheduled for today</p>
                                </div>
                            ) : (
                                <div>
                                    {todaySchedule.map((schedule, scheduleIndex) => (
                                        <div key={scheduleIndex} className="mb-6">
                                            {schedule.prescriptionNotes && (
                                                <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800">
                                                    <strong>Doctor's Notes:</strong> {schedule.prescriptionNotes}
                                                </div>
                                            )}
                                            
                                            <div className="space-y-4">
                                                {schedule.medicines.map((medicine, medicineIndex) => (
                                                    <div 
                                                        key={medicine.medicineId} 
                                                        className={`bg-white border rounded-lg shadow-sm overflow-hidden transition-all duration-300 ${
                                                            selectedMedicine === medicine.medicineId ? 'ring-2 ring-indigo-500' : ''
                                                        }`}
                                                    >
                                                        <div 
                                                            className="p-4 cursor-pointer flex justify-between items-center"
                                                            onClick={() => setSelectedMedicine(
                                                                selectedMedicine === medicine.medicineId ? null : medicine.medicineId
                                                            )}
                                                        >
                                                            <div>
                                                                <h3 className="font-medium text-gray-900">
                                                                    {medicine.name}
                                                                </h3>
                                                                <p className="text-sm text-gray-600">
                                                                    {medicine.dosage} • {medicine.whenToTake === 'before_meal' ? 'Before meals' : 'After meals'}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <span className="text-sm text-gray-600 mr-2">
                                                                    {medicine.doses.filter(d => d.status === 'taken').length}/{medicine.doses.length} taken
                                                                </span>
                                                                <div className={`transform transition-transform duration-300 ${
                                                                    selectedMedicine === medicine.medicineId ? 'rotate-180' : ''
                                                                }`}>
                                                                    <FiChevronRight className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {selectedMedicine === medicine.medicineId && (
                                                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                                                                <h4 className="text-sm font-medium text-gray-700 mb-3">
                                                                    Today's Doses
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {medicine.doses.map((dose, doseIndex) => (
                                                                        <div key={doseIndex} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                                                            <div className="flex items-center">
                                                                                {getStatusIcon(dose.status)}
                                                                                <span className="ml-2 text-sm font-medium">
                                                                                    {formatTime(dose.time)}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex space-x-2">
                                                                                <button
                                                                                    onClick={() => updateDoseStatus(
                                                                                        schedule.scheduleId,
                                                                                        medicine.medicineId,
                                                                                        doseIndex,
                                                                                        'taken'
                                                                                    )}
                                                                                    disabled={dose.status === 'taken'}
                                                                                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                                                                                        dose.status === 'taken'
                                                                                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                                                                            : 'bg-green-600 text-white hover:bg-green-700'
                                                                                    }`}
                                                                                >
                                                                                    Taken
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => updateDoseStatus(
                                                                                        schedule.scheduleId,
                                                                                        medicine.medicineId,
                                                                                        doseIndex,
                                                                                        'skipped'
                                                                                    )}
                                                                                    disabled={dose.status === 'skipped'}
                                                                                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                                                                                        dose.status === 'skipped'
                                                                                            ? 'bg-red-100 text-red-800 cursor-not-allowed'
                                                                                            : 'bg-red-600 text-white hover:bg-red-700'
                                                                                    }`}
                                                                                >
                                                                                    Skip
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Calendar View Tab */}
                    {activeTab === 'calendar' && (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => changeDate('prev')}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <FiChevronLeft className="h-5 w-5 text-gray-600" />
                                </button>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {formatDate(selectedDate)}
                                </h2>
                                <button
                                    onClick={() => changeDate('next')}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <FiChevronRight className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>
                            
                            {dateSchedule.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <FiInfo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No medications scheduled for this date</p>
                                </div>
                            ) : (
                                <div>
                                    {dateSchedule.map((schedule, scheduleIndex) => (
                                        <div key={scheduleIndex} className="mb-6">
                                            <div className="space-y-4">
                                                {schedule.medicines.map((medicine, medicineIndex) => (
                                                    <div 
                                                        key={medicine.medicineId} 
                                                        className="bg-white border rounded-lg shadow-sm overflow-hidden"
                                                    >
                                                        <div className="p-4">
                                                            <h3 className="font-medium text-gray-900">
                                                                {medicine.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {medicine.dosage} • {medicine.whenToTake === 'before_meal' ? 'Before meals' : 'After meals'}
                                                            </p>
                                                            
                                                            <div className="mt-3 space-y-2">
                                                                {medicine.doses.map((dose, doseIndex) => (
                                                                    <div key={doseIndex} className="flex items-center text-sm">
                                                                        {getStatusIcon(dose.status)}
                                                                        <span className={`ml-2 ${getStatusColor(dose.status)}`}>
                                                                            {formatTime(dose.time)} - {dose.status.charAt(0).toUpperCase() + dose.status.slice(1)}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Statistics Tab */}
                    {activeTab === 'stats' && (
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                                Medication Statistics
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg shadow-sm border p-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                                        Overall Adherence
                                    </h3>
                                    <div className="flex items-center justify-center">
                                        <div className="relative h-32 w-32">
                                            <svg className="h-full w-full" viewBox="0 0 36 36">
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#eee"
                                                    strokeWidth="3"
                                                />
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#4f46e5"
                                                    strokeWidth="3"
                                                    strokeDasharray={`${stats.adherenceRate}, 100`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-indigo-600">
                                                    {Math.round(stats.adherenceRate)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-lg shadow-sm border p-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                                        Schedule Summary
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Total Schedules</span>
                                            <span className="font-medium">{stats.totalSchedules || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Active Schedules</span>
                                            <span className="font-medium">{stats.activeSchedules || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Completed Schedules</span>
                                            <span className="font-medium">{stats.completedSchedules || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Today's Adherence</span>
                                            <span className="font-medium">
                                                {Math.round(stats.todayStats.adherenceRate || 0)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-indigo-800 mb-2">
                                        Tips for Better Medication Adherence
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                                        <li>Set daily reminders on your phone</li>
                                        <li>Keep medications in a visible place</li>
                                        <li>Use a pill organizer for multiple medications</li>
                                        <li>Incorporate taking medication into your daily routine</li>
                                        <li>Ask a family member to help remind you</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicationSchedule;
