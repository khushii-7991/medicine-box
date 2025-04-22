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
import { FaSearch, FaCalendarAlt, FaUserMd, FaPills, FaChartLine } from 'react-icons/fa';

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
                }

            } catch (error) {
                console.error('Error fetching patient dashboard data:', error);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('patientToken');
        localStorage.removeItem('patientData');
        navigate('/');
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [doctors, setDoctors] = useState([
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialization: 'General Physician',
            experience: '15 years',
            rating: 4.8,
            available: 'Today, 2:00 PM'
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialization: 'Cardiologist',
            experience: '12 years',
            rating: 4.7,
            available: 'Today, 4:30 PM'
        },
        {
            id: 3,
            name: 'Dr. Emily Parker',
            specialization: 'Neurologist',
            experience: '10 years',
            rating: 4.9,
            available: 'Tomorrow, 10:00 AM'
        },
        {
            id: 4,
            name: 'Dr. Robert Wilson',
            specialization: 'Pediatrician',
            experience: '8 years',
            rating: 4.6,
            available: 'Today, 3:00 PM'
        }
    ]);

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                    <Link to="/view-prescriptions" className="text-sm text-yellow-600 hover:text-yellow-800 font-medium">View medications →</Link>
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
                                    <Link to="/view-prescriptions" className="text-sm text-green-600 hover:text-green-800 font-medium">View history →</Link>
                                </div>
                            </div>

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

                        {/* Main Content Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                            {/* Left Column - Recent Activity */}
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
                            </div>

                            {/* Right Column - Health Metrics Trends */}
                            <div className="lg:col-span-2">
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
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="w-full mb-12">
                            <div className="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                                </div>
                                <div className="p-4 space-y-3">
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Patient;