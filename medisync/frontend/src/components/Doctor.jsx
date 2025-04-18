import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiCalendar, FiClock, FiUser, FiUsers, FiFileText, FiPlusCircle, 
    FiActivity, FiClipboard, FiLogOut, FiMenu, FiBell, FiSettings
} from 'react-icons/fi';
import Navbar from './Navbar';
import { 
    AreaChart, Area, BarChart, Bar, PieChart, Pie, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Cell, RadialBarChart, RadialBar
} from 'recharts';

const Doctor = () => {
    const navigate = useNavigate();
    const doctorData = JSON.parse(localStorage.getItem('doctorData') || '{}');
    
    // Sample statistics data - in a real app, this would come from an API
    const [stats, setStats] = useState({
        todayAppointments: 8,
        totalPatients: 124,
        pendingReports: 3,
        completedAppointments: 456
    });
    
    // Sample recent activity - in a real app, this would come from an API
    const [recentActivity, setRecentActivity] = useState([
        {
            id: 1,
            type: 'appointment',
            patient: 'John Doe',
            action: 'Completed checkup',
            time: '2 hours ago',
            image: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            id: 2,
            type: 'report',
            patient: 'Jane Smith',
            action: 'Added blood test report',
            time: '4 hours ago',
            image: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
            id: 3,
            type: 'prescription',
            patient: 'Robert Johnson',
            action: 'Created new prescription',
            time: 'Yesterday',
            image: 'https://randomuser.me/api/portraits/men/92.jpg'
        }
    ]);
    
    // Sample chart data - in a real app, this would come from an API
    const [appointmentTrends, setAppointmentTrends] = useState([
        { name: 'Mon', appointments: 4 },
        { name: 'Tue', appointments: 6 },
        { name: 'Wed', appointments: 8 },
        { name: 'Thu', appointments: 5 },
        { name: 'Fri', appointments: 9 },
        { name: 'Sat', appointments: 3 },
        { name: 'Sun', appointments: 2 },
    ]);
    
    const [patientDemographics, setPatientDemographics] = useState([
        { name: '0-18', value: 15, fill: '#8884d8' },
        { name: '19-35', value: 30, fill: '#83a6ed' },
        { name: '36-50', value: 45, fill: '#8dd1e1' },
        { name: '51-65', value: 25, fill: '#82ca9d' },
        { name: '65+', value: 9, fill: '#ffc658' },
    ]);
    
    const [patientConditions, setPatientConditions] = useState([
        { name: 'Hypertension', count: 28 },
        { name: 'Diabetes', count: 22 },
        { name: 'Asthma', count: 16 },
        { name: 'Arthritis', count: 12 },
        { name: 'Heart Disease', count: 8 },
    ]);
    
    const [healthMetrics, setHealthMetrics] = useState([
        {
            name: 'Jan',
            bloodPressure: 120,
            cholesterol: 180,
            glucose: 95,
        },
        {
            name: 'Feb',
            bloodPressure: 125,
            cholesterol: 190,
            glucose: 100,
        },
        {
            name: 'Mar',
            bloodPressure: 118,
            cholesterol: 175,
            glucose: 90,
        },
        {
            name: 'Apr',
            bloodPressure: 122,
            cholesterol: 185,
            glucose: 98,
        },
        {
            name: 'May',
            bloodPressure: 130,
            cholesterol: 195,
            glucose: 105,
        },
        {
            name: 'Jun',
            bloodPressure: 125,
            cholesterol: 180,
            glucose: 100,
        },
    ]);
    
    const [completionRates, setCompletionRates] = useState([
        { name: 'Appointments', value: 92 },
        { name: 'Prescriptions', value: 85 },
        { name: 'Lab Tests', value: 78 },
        { name: 'Follow-ups', value: 65 },
    ]);

    const handleLogout = () => {
        localStorage.removeItem('doctorToken');
        localStorage.removeItem('doctorData');
        navigate('/login/doctor');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar userType="doctor" />
            
            <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
                {/* Welcome header */}
                <div className="mb-8 animate-fadeIn">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Welcome back, Dr. {doctorData.name || 'Doctor'}!
                    </h2>
                    <p className="mt-2 text-gray-600">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                
                {/* Stats overview */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {/* Today's Appointments */}
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-blue-50">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                    <FiCalendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Today's Appointments
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {stats.todayAppointments}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                            <div className="text-sm">
                                <a href="/todays-appointment" className="font-medium text-blue-600 hover:text-blue-500">
                                    View all<span className="sr-only"> today's appointments</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Total Patients */}
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-indigo-50">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                    <FiUsers className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Patients
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {stats.totalPatients}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                            <div className="text-sm">
                                <a href="/patient-list" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    View all<span className="sr-only"> patients</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Pending Reports */}
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-amber-50">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                                    <FiFileText className="h-6 w-6 text-amber-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Pending Reports
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {stats.pendingReports}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                            <div className="text-sm">
                                <a href="/reports" className="font-medium text-amber-600 hover:text-amber-500">
                                    View all<span className="sr-only"> reports</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Total Appointments */}
                    <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-teal-50">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-teal-100 rounded-md p-3">
                                    <FiActivity className="h-6 w-6 text-teal-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Total Appointments
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {stats.completedAppointments}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:px-6">
                            <div className="text-sm">
                                <a href="/view-appointments" className="font-medium text-teal-600 hover:text-teal-500">
                                    View all<span className="sr-only"> appointments</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Recent activity and quick actions */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    {/* Recent activity */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    View all
                                </a>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <img className="h-10 w-10 rounded-full" src={activity.image} alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {activity.patient}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {activity.action}
                                                </p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {activity.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Quick actions */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <a href="/add-prescription" className="block">
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                                        <div className="flex items-center">
                                            <FiPlusCircle className="mr-3 h-5 w-5" />
                                            <span>New Prescription</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </a>
                                <a href="/patient-list" className="block">
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-indigo-100 hover:to-indigo-200 transition-all duration-200">
                                        <div className="flex items-center">
                                            <FiUser className="mr-3 h-5 w-5" />
                                            <span>Add New Patient</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </a>
                                <a href="/reports" className="block">
                                    <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-amber-100 hover:to-amber-200 transition-all duration-200">
                                        <div className="flex items-center">
                                            <FiClipboard className="mr-3 h-5 w-5" />
                                            <span>View Reports</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </a>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-red-100 hover:to-red-200 transition-all duration-200"
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
                </div>

                {/* Main feature cards */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">Main Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                        {/* Add Prescription Card */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                            <div className="p-6 relative z-10">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="p-4 rounded-full bg-blue-100 mb-4 group-hover:bg-blue-200 transition-colors duration-300 group-hover:scale-110 transform">
                                        <FiFileText className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 text-center">Add Prescription</h3>
                                </div>
                                <p className="text-gray-600 mb-6 text-sm text-center">Create and manage prescriptions for your patients with detailed instructions.</p>
                                <a href="/add-prescription" className="block w-full">
                                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-blue-600 group-hover:to-blue-700">
                                        <span>Create New</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </a>
                            </div>
                        </div>

                        {/* View Appointments Card */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="h-2 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
                            <div className="p-6 relative z-10">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="p-4 rounded-full bg-indigo-100 mb-4 group-hover:bg-indigo-200 transition-colors duration-300 group-hover:scale-110 transform">
                                        <FiCalendar className="h-8 w-8 text-indigo-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 text-center">View Appointments</h3>
                                </div>
                                <p className="text-gray-600 mb-6 text-sm text-center">View and manage all upcoming and past appointments with patients.</p>
                                <a href="/view-appointments" className="block w-full">
                                    <button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-indigo-600 group-hover:to-indigo-700">
                                        <span>View All</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </a>
                            </div>
                        </div>

                        {/* Today's Appointments Card */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600"></div>
                            <div className="p-6 relative z-10">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="p-4 rounded-full bg-amber-100 mb-4 group-hover:bg-amber-200 transition-colors duration-300 group-hover:scale-110 transform">
                                        <FiClock className="h-8 w-8 text-amber-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 text-center">Today's Appointments</h3>
                                </div>
                                <p className="text-gray-600 mb-6 text-sm text-center">Quick access to all appointments scheduled for today.</p>
                                <a href="/todays-appointment" className="block w-full">
                                    <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-amber-600 group-hover:to-amber-700">
                                        <span>View Today</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </a>
                            </div>
                        </div>

                        {/* Patient List Card */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="h-2 bg-gradient-to-r from-teal-500 to-teal-600"></div>
                            <div className="p-6 relative z-10">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="p-4 rounded-full bg-teal-100 mb-4 group-hover:bg-teal-200 transition-colors duration-300 group-hover:scale-110 transform">
                                        <FiUsers className="h-8 w-8 text-teal-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 text-center">Patient List</h3>
                                </div>
                                <p className="text-gray-600 mb-6 text-sm text-center">View and manage your complete list of registered patients.</p>
                                <a href="/patient-list" className="block w-full">
                                    <button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-teal-600 group-hover:to-teal-700">
                                        <span>View List</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Charts and Analytics */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">Analytics Dashboard</h3>
                    
                    {/* First row of charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Weekly Appointment Trends */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Appointment Trends</h4>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={appointmentTrends}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis dataKey="name" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                            }} 
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="appointments" 
                                            stroke="#8884d8" 
                                            fillOpacity={1} 
                                            fill="url(#colorAppointments)" 
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        {/* Patient Demographics */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Patient Age Demographics</h4>
                            <div className="h-80 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={patientDemographics}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={2}
                                            dataKey="value"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        >
                                            {patientDemographics.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value) => [`${value} patients`, 'Count']}
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                            }} 
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    
                    {/* Second row of charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Common Patient Conditions */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Common Patient Conditions</h4>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={patientConditions}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis type="number" stroke="#6b7280" />
                                        <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                                        <Tooltip 
                                            formatter={(value) => [`${value} patients`, 'Count']}
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                            }} 
                                        />
                                        <Bar 
                                            dataKey="count" 
                                            radius={[0, 4, 4, 0]}
                                        >
                                            {patientConditions.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} 
                                                    opacity={0.8 - (index * 0.1)}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        {/* Health Metrics Trends */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Health Metrics Trends</h4>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={healthMetrics}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                        <XAxis dataKey="name" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                            }} 
                                        />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="bloodPressure" 
                                            stroke="#8884d8" 
                                            strokeWidth={2}
                                            activeDot={{ r: 8 }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="cholesterol" 
                                            stroke="#82ca9d" 
                                            strokeWidth={2}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="glucose" 
                                            stroke="#ffc658" 
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    
                    {/* Completion rates radial chart */}
                    <div className="mt-6">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Task Completion Rates (%)</h4>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius="20%" 
                                        outerRadius="80%" 
                                        barSize={20} 
                                        data={completionRates}
                                    >
                                        <RadialBar
                                            minAngle={15}
                                            background
                                            clockWise
                                            dataKey="value"
                                            cornerRadius={8}
                                        >
                                            {completionRates.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={
                                                        index === 0 ? '#8884d8' : 
                                                        index === 1 ? '#83a6ed' : 
                                                        index === 2 ? '#8dd1e1' : '#82ca9d'
                                                    } 
                                                />
                                            ))}
                                        </RadialBar>
                                        <Legend 
                                            iconSize={10} 
                                            layout="vertical" 
                                            verticalAlign="middle" 
                                            align="right"
                                            wrapperStyle={{
                                                paddingLeft: '10px'
                                            }}
                                        />
                                        <Tooltip 
                                            formatter={(value) => [`${value}%`, 'Completion Rate']}
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                            }} 
                                        />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 1s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    )
}

export default Doctor;