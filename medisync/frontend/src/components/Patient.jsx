import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
    FiCalendar, FiClock, FiFileText, FiUpload, FiBell, 
    FiPhoneCall, FiActivity, FiPieChart, FiTrendingUp, FiUser, FiCheckCircle, FiAlertTriangle,
    FiPlus, FiCheck, FiX, FiLogOut, FiSearch, FiAward
} from 'react-icons/fi';
import { 
    AreaChart, Area, BarChart, Bar, PieChart, Pie, LineChart, Line, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    RadialBarChart, RadialBar, Cell
} from 'recharts';
import MedicineTracking from './MedicineTracking';

const Patient = () => {
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Statistics data
    const [stats, setStats] = useState({
        upcomingAppointments: 0,
        activePrescriptions: 0,
        pendingMedications: 0,
        completedMedications: 0
    });
    
    // Medication adherence percentage
    const [medicationAdherence, setMedicationAdherence] = useState(78);
    
    // Recent activities data
    const [recentActivities, setRecentActivities] = useState([
        { 
            type: 'appointment', 
            message: 'Appointment with Dr. Smith', 
            status: 'upcoming', 
            date: new Date(2023, 6, 15) 
        },
        { 
            type: 'prescription', 
            message: 'New prescription added', 
            status: 'completed', 
            date: new Date(2023, 6, 10) 
        },
        { 
            type: 'medication', 
            message: 'Missed evening dose of Amoxicillin', 
            status: 'missed', 
            date: new Date(2023, 6, 9) 
        },
        { 
            type: 'report', 
            message: 'Blood test results uploaded', 
            status: 'completed', 
            date: new Date(2023, 6, 5) 
        }
    ]);
    
    // Chart data
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    
    const appointmentData = [
        { name: 'Mon', appointments: 1 },
        { name: 'Tue', appointments: 0 },
        { name: 'Wed', appointments: 2 },
        { name: 'Thu', appointments: 0 },
        { name: 'Fri', appointments: 1 },
        { name: 'Sat', appointments: 0 },
        { name: 'Sun', appointments: 0 },
    ];
    
    const conditionData = [
        { name: 'Hypertension', value: 35 },
        { name: 'Diabetes', value: 25 },
        { name: 'Asthma', value: 20 },
        { name: 'Arthritis', value: 15 },
        { name: 'Other', value: 5 },
    ];
    
    const healthMetrics = [
        { name: 'Jan', bloodPressure: 120, bloodSugar: 95, weight: 75 },
        { name: 'Feb', bloodPressure: 125, bloodSugar: 100, weight: 76 },
        { name: 'Mar', bloodPressure: 130, bloodSugar: 105, weight: 77 },
        { name: 'Apr', bloodPressure: 125, bloodSugar: 98, weight: 76 },
        { name: 'May', bloodPressure: 120, bloodSugar: 95, weight: 75 },
        { name: 'Jun', bloodPressure: 115, bloodSugar: 90, weight: 74 },
    ];
    
    // Helper functions for activity icons and status badges
    const getActivityIcon = (type) => {
        switch (type) {
            case 'appointment':
                return <FiCalendar className="text-blue-600" />;
            case 'prescription':
                return <FiFileText className="text-purple-600" />;
            case 'medication':
                return <FiClock className="text-yellow-600" />;
            case 'report':
                return <FiPlus className="text-green-600" />;
            default:
                return <FiActivity className="text-gray-600" />;
        }
    };
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'upcoming':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Upcoming
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheck className="mr-1" /> Completed
                    </span>
                );
            case 'missed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiX className="mr-1" /> Missed
                    </span>
                );
            default:
                return null;
        }
    };

    // Fetch patient dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Get patient data from localStorage
                const storedPatientData = JSON.parse(localStorage.getItem('patientData') || '{}');
                setPatientData(storedPatientData);
                
                if (!storedPatientData.id) {
                    setError('Patient data not found. Please login again.');
                    setLoading(false);
                    return;
                }
                
                // Fetch schedule statistics
                const scheduleResponse = await axios.get(`/api/schedule/stats/${storedPatientData.id}`);
                
                if (scheduleResponse.data) {
                    setStats({
                        upcomingAppointments: scheduleResponse.data.upcomingAppointments || 2,
                        activePrescriptions: scheduleResponse.data.activePrescriptions || 3,
                        pendingMedications: scheduleResponse.data.pendingMedications || 5,
                        completedMedications: scheduleResponse.data.completedMedications || 12
                    });
                    
                    setMedicationAdherence(scheduleResponse.data.adherencePercentage || 78);
                }
                
                // Fetch recent activities
                // This would be replaced with actual API call in production
                // const activitiesResponse = await axios.get(`/api/patient/activities/${storedPatientData.id}`);
                // setRecentActivities(activitiesResponse.data);
                
                // Fetch health metrics
                // This would be replaced with actual API call in production
                // const metricsResponse = await axios.get(`/api/patient/health-metrics/${storedPatientData.id}`);
                // setHealthMetrics(metricsResponse.data);
                
            } catch (error) {
                console.error('Error fetching patient dashboard data:', error);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Medication data for pie chart (using stats)
    const medicationData = [
        { name: 'Completed', value: stats.completedMedications, color: '#10B981' },
        { name: 'Pending', value: stats.pendingMedications, color: '#F59E0B' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('patientToken');
        localStorage.removeItem('patientData');
        navigate('/');
    };

    const [showTracking, setShowTracking] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState({
        id: 'default',
        name: 'Daily Medications',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    const [streakData, setStreakData] = useState({
        currentStreak: 7,
        longestStreak: 14,
        totalCompleted: 42,
        streakHistory: [
            { date: '2024-03-01', status: 'completed' },
            { date: '2024-03-02', status: 'completed' },
            { date: '2024-03-03', status: 'completed' },
            { date: '2024-03-04', status: 'completed' },
            { date: '2024-03-05', status: 'completed' },
            { date: '2024-03-06', status: 'completed' },
            { date: '2024-03-07', status: 'completed' },
            { date: '2024-03-08', status: 'missed' },
            { date: '2024-03-09', status: 'completed' },
            { date: '2024-03-10', status: 'completed' },
        ]
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto py-8 px-6">
                {/* Header with welcome message and stats */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-2">
                            Welcome, {patientData.name || 'Patient'}!
                        </h1>
                        <p className="text-gray-600">
                            Your health dashboard - manage your medications, appointments, and health records
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="bg-white rounded-xl shadow-md p-3 flex items-center">
                            <div className="bg-green-100 p-2 rounded-full">
                                <FiUser className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">{patientData.email}</p>
                                <p className="text-xs text-gray-500">Patient ID: {patientData.id?.substring(0, 8)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Find Doctor Card */}
                            <div onClick={() => navigate('/find-doctor')} className="bg-white rounded-xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Find Doctor</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">Search</p>
                                    </div>
                                    <div className="bg-indigo-100 p-3 rounded-full">
                                        <FiSearch className="h-6 w-6 text-indigo-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link to="/find-doctor" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Find doctors near you →</Link>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.upcomingAppointments}</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <FiCalendar className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link to="/my-appointments" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all appointments →</Link>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-500 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Prescriptions</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.activePrescriptions}</p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <FiFileText className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link to="/view-prescriptions" className="text-sm text-purple-600 hover:text-purple-800 font-medium">View prescriptions →</Link>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-500 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Pending Medications</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.pendingMedications}</p>
                                    </div>
                                    <div className="bg-yellow-100 p-3 rounded-full">
                                        <FiAlertTriangle className="h-6 w-6 text-yellow-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link to="/medication-schedule" className="text-sm text-yellow-600 hover:text-yellow-800 font-medium">View medication schedule →</Link>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Completed Medications</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.completedMedications}</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <FiCheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link to="/medication-schedule" className="text-sm text-green-600 hover:text-green-800 font-medium">View medication schedule →</Link>
                                </div>
                            </div>

                            {/* Streak Stats Card */}
                            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-amber-500 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Current Streak</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{streakData.currentStreak} days</p>
                                    </div>
                                    <div className="bg-amber-100 p-3 rounded-full">
                                        <FiAward className="h-6 w-6 text-amber-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Longest Streak:</span>
                                        <span className="font-medium">{streakData.longestStreak} days</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-1">
                                        <span className="text-gray-600">Total Completed:</span>
                                        <span className="font-medium">{streakData.totalCompleted} doses</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                            {/* Left Column - Recent Activity and Medication Adherence */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <FiActivity className="mr-2 text-teal-600" /> Recent Activity
                                    </h2>
                                    <div className="space-y-4">
                                        {recentActivities.map((activity, index) => (
                                            <div key={index} className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                                                <div className="bg-gray-100 p-2 rounded-full mr-3">
                                                    {getActivityIcon(activity.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                                                        {getStatusBadge(activity.status)}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(activity.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Streak History */}
                                <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <FiAward className="mr-2 text-amber-600" /> Streak History
                                    </h2>
                                    <div className="grid grid-cols-10 gap-2">
                                        {streakData.streakHistory.map((day, index) => (
                                            <div
                                                key={index}
                                                className={`aspect-square rounded flex items-center justify-center ${
                                                    day.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                                                }`}
                                                title={`${new Date(day.date).toLocaleDateString()}: ${day.status}`}
                                            >
                                                {day.status === 'completed' ? (
                                                    <FiCheck className="text-white" />
                                                ) : (
                                                    <FiX className="text-white" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        Last 10 days of medication adherence
                                    </div>
                                </div>

                                {/* Medication Adherence */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <FiPieChart className="mr-2 text-teal-600" /> Medication Adherence
                                    </h2>
                                    <div className="flex flex-col items-center">
                                        <div className="relative h-40 w-40 mb-4">
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
                                                    stroke="#10B981"
                                                    strokeWidth="3"
                                                    strokeDasharray={`${medicationAdherence}, 100`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-3xl font-bold text-gray-800">{Math.round(medicationAdherence)}%</span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Your medication adherence score</p>
                                            <Link to="/medication-schedule" className="text-sm text-teal-600 hover:text-teal-800 font-medium mt-2 inline-block">
                                                Improve your score →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Health Metrics Trends and Medication Calendar */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Health Metrics Trends - Moved to top */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <FiTrendingUp className="mr-2 text-teal-600" /> Health Metrics Trends
                                    </h2>
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={healthMetrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" />
                                                <YAxis yAxisId="left" orientation="left" stroke="#0EA5E9" />
                                                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                                                <Tooltip />
                                                <Legend />
                                                <Line yAxisId="left" type="monotone" dataKey="bloodPressure" stroke="#0EA5E9" activeDot={{ r: 8 }} name="Blood Pressure" />
                                                <Line yAxisId="left" type="monotone" dataKey="bloodSugar" stroke="#8B5CF6" name="Blood Sugar" />
                                                <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#10B981" name="Weight (kg)" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Medicine Tracking Calendar - Made wider */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                            <FiCalendar className="mr-2 text-teal-600" /> Medication Calendar
                                        </h2>
                                        <button
                                            onClick={() => setShowTracking(!showTracking)}
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                        >
                                            {showTracking ? 'Hide Calendar' : 'Show Calendar'}
                                        </button>
                                    </div>
                                    {showTracking && (
                                        <MedicineTracking prescriptionId={selectedPrescription.id} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="w-full mb-12">
                            <div className="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    <Link to="/medication-schedule" className="block">
                                        <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-lg hover:shadow-md transition-all duration-300 group-hover:from-indigo-100 hover:to-indigo-200 transition-all duration-200">
                                            <div className="flex items-center">
                                                <FiClock className="mr-3 h-5 w-5" />
                                                <span>Medication Schedule</span>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Link>
                                    <Link to="/view-prescriptions" className="block">
                                        <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 rounded-lg hover:shadow-md transition-all duration-300 group-hover:from-pink-100 hover:to-pink-200 transition-all duration-200">
                                            <div className="flex items-center">
                                                <FiFileText className="mr-3 h-5 w-5" />
                                                <span>View Prescriptions</span>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Link>
                                    <Link to="/find-doctor" className="block">
                                        <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-lg hover:shadow-md transition-all duration-300 group-hover:from-indigo-100 hover:to-indigo-200 transition-all duration-200">
                                            <div className="flex items-center">
                                                <FiSearch className="mr-3 h-5 w-5" />
                                                <span>Find Doctor</span>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Link>
                                    <Link to="/book-appointment" className="block">
                                        <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:shadow-md transition-all duration-300 group-hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                                            <div className="flex items-center">
                                                <FiCalendar className="mr-3 h-5 w-5" />
                                                <span>Book Appointment</span>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg hover:shadow-md transition-all duration-300 group-hover:from-red-100 hover:to-red-200 transition-all duration-200"
                                    >
                                        <div className="flex items-center">
                                            <FiLogOut className="mr-3 h-5 w-5" />
                                            <span>Logout</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Features Cards */}
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-6">Main Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                
                                {/* View Prescriptions Card */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="h-2 bg-gradient-to-r from-pink-500 to-pink-600"></div>
                                    <div className="p-6 relative z-10">
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="p-4 rounded-full bg-pink-100 mb-4 group-hover:bg-pink-200 transition-colors duration-300 group-hover:scale-110 transform">
                                                <FiFileText className="h-8 w-8 text-pink-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 text-center">View Prescriptions</h3>
                                        </div>
                                        <p className="text-gray-600 mb-6 text-sm text-center">Access all your prescriptions, medicine schedules, and doctor's notes in one place.</p>
                                        <Link to="/view-prescriptions" className="block w-full">
                                            <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-pink-600 group-hover:to-pink-700">
                                                <span>View All</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Medication Schedule Card */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                                    <div className="p-6 relative z-10">
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="p-4 rounded-full bg-indigo-100 mb-4 group-hover:bg-indigo-200 transition-colors duration-300 group-hover:scale-110 transform">
                                                <FiClock className="h-8 w-8 text-indigo-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 text-center">Medication Schedule</h3>
                                        </div>
                                        <p className="text-gray-600 mb-6 text-sm text-center">Track your medication schedule, mark doses as taken, and never miss a dose.</p>
                                        <Link to="/medication-schedule" className="block w-full">
                                            <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-indigo-600 group-hover:to-purple-700">
                                                <span>View Schedule</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Book Appointment Card */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                                    <div className="p-6 relative z-10">
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="p-4 rounded-full bg-blue-100 mb-4 group-hover:bg-blue-200 transition-colors duration-300 group-hover:scale-110 transform">
                                                <FiCalendar className="h-8 w-8 text-blue-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 text-center">Book Appointment</h3>
                                        </div>
                                        <p className="text-gray-600 mb-6 text-sm text-center">Schedule a new appointment with your doctor quickly and easily.</p>
                                        <Link to="/book-appointment" className="block w-full">
                                            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-blue-600 group-hover:to-blue-700">
                                                <span>Book Now</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Upload Reports Card */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                                    <div className="p-6 relative z-10">
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="p-4 rounded-full bg-purple-100 mb-4 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110 transform">
                                                <FiUpload className="h-8 w-8 text-purple-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 text-center">Upload Reports</h3>
                                        </div>
                                        <p className="text-gray-600 mb-6 text-sm text-center">Upload your medical reports and test results for your doctor to review.</p>
                                        <Link to="/upload-reports" className="block w-full">
                                            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-purple-600 group-hover:to-purple-700">
                                                <span>Upload Now</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Health Reminders Card */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600"></div>
                                    <div className="p-6 relative z-10">
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="p-4 rounded-full bg-amber-100 mb-4 group-hover:bg-amber-200 transition-colors duration-300 group-hover:scale-110 transform">
                                                <FiBell className="h-8 w-8 text-amber-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 text-center">Health Reminders</h3>
                                        </div>
                                        <p className="text-gray-600 mb-6 text-sm text-center">Set up reminders for medications, appointments, and other health activities.</p>
                                        <Link to="/health-reminders" className="block w-full">
                                            <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-amber-600 group-hover:to-amber-700">
                                                <span>Manage Reminders</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Emergency Help Card */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="h-2 bg-gradient-to-r from-red-500 to-red-600"></div>
                                    <div className="p-6 relative z-10">
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="p-4 rounded-full bg-red-100 mb-4 group-hover:bg-red-200 transition-colors duration-300 group-hover:scale-110 transform">
                                                <FiPhoneCall className="h-8 w-8 text-red-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 text-center">Emergency Help</h3>
                                        </div>
                                        <p className="text-gray-600 mb-6 text-sm text-center">Quick access to emergency contacts and services when you need them most.</p>
                                        <Link to="/emergency-help" className="block w-full">
                                            <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-red-600 group-hover:to-red-700">
                                                <span>Call Now</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* My Appointments Card */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="h-2 bg-gradient-to-r from-teal-500 to-teal-600"></div>
                                    <div className="p-6 relative z-10">
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="p-4 rounded-full bg-teal-100 mb-4 group-hover:bg-teal-200 transition-colors duration-300 group-hover:scale-110 transform">
                                                <FiCalendar className="h-8 w-8 text-teal-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 text-center">My Appointments</h3>
                                        </div>
                                        <p className="text-gray-600 mb-6 text-sm text-center">View and manage all your upcoming and past appointments.</p>
                                        <Link to="/my-appointments" className="block w-full">
                                            <button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-teal-600 group-hover:to-teal-700">
                                                <span>View Appointments</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                {/* My Profile Card */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
                                    <div className="p-6 relative z-10">
                                        <div className="flex flex-col items-center mb-6">
                                            <div className="p-4 rounded-full bg-green-100 mb-4 group-hover:bg-green-200 transition-colors duration-300 group-hover:scale-110 transform">
                                                <FiUser className="h-8 w-8 text-green-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 text-center">My Profile</h3>
                                        </div>
                                        <p className="text-gray-600 mb-6 text-sm text-center">View and update your personal information and medical history.</p>
                                        <Link to="/profile" className="block w-full">
                                            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-green-600 group-hover:to-green-700">
                                                <span>View Profile</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Patient;