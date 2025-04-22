import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPlus, FiDownload, FiUser, FiCalendar, FiPhone, FiMail, FiHeart, FiActivity } from 'react-icons/fi';

const PatientList = () => {
    // Sample patient data - in a real app, this would come from an API
    const [patients, setPatients] = useState([
        {
            id: 1,
            name: "John Doe",
            age: 45,
            gender: "Male",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            phone: "+1234567890",
            email: "john.doe@example.com",
            lastVisit: "2025-04-10",
            nextAppointment: "2025-04-25",
            bloodGroup: "O+",
            status: "active",
            conditions: ["Hypertension", "Diabetes"],
            riskLevel: "medium",
            doctor: "Dr. Emily Chen",
            medications: ["Lisinopril", "Metformin"],
            notes: "Patient is responding well to current treatment plan."
        },
        {
            id: 2,
            name: "Jane Smith",
            age: 30,
            gender: "Female",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            phone: "+0987654321",
            email: "jane.smith@example.com",
            lastVisit: "2025-04-05",
            nextAppointment: "2025-04-20",
            bloodGroup: "A+",
            status: "active",
            conditions: ["Asthma"],
            riskLevel: "low",
            doctor: "Dr. Michael Rodriguez",
            medications: ["Albuterol"],
            notes: "Patient needs regular follow-up for asthma management."
        },
        {
            id: 3,
            name: "Michael Lee",
            age: 60,
            gender: "Male",
            image: "https://randomuser.me/api/portraits/men/15.jpg",
            phone: "+1122334455",
            email: "michael.lee@example.com",
            lastVisit: "2025-04-12",
            nextAppointment: "2025-04-30",
            bloodGroup: "B-",
            status: "critical",
            conditions: ["Coronary Artery Disease", "COPD"],
            riskLevel: "high",
            doctor: "Dr. Sarah Johnson",
            medications: ["Atorvastatin", "Clopidogrel", "Tiotropium"],
            notes: "Patient requires close monitoring due to recent cardiac event."
        },
        {
            id: 4,
            name: "Emily Wilson",
            age: 28,
            gender: "Female",
            image: "https://randomuser.me/api/portraits/women/67.jpg",
            phone: "+2233445566",
            email: "emily.wilson@example.com",
            lastVisit: "2025-03-25",
            nextAppointment: "2025-04-22",
            bloodGroup: "AB+",
            status: "active",
            conditions: ["Migraine", "Anxiety"],
            riskLevel: "low",
            doctor: "Dr. David Kim",
            medications: ["Sumatriptan", "Sertraline"],
            notes: "Patient reports improvement in migraine frequency with current medication."
        },
        {
            id: 5,
            name: "Robert Johnson",
            age: 52,
            gender: "Male",
            image: "https://randomuser.me/api/portraits/men/92.jpg",
            phone: "+3344556677",
            email: "robert.johnson@example.com",
            lastVisit: "2025-04-08",
            nextAppointment: "2025-05-10",
            bloodGroup: "A-",
            status: "inactive",
            conditions: ["Arthritis", "Hyperlipidemia"],
            riskLevel: "medium",
            doctor: "Dr. Lisa Wong",
            medications: ["Celecoxib", "Rosuvastatin"],
            notes: "Patient has not attended last two follow-up appointments."
        },
        {
            id: 6,
            name: "Sophia Martinez",
            age: 35,
            gender: "Female",
            image: "https://randomuser.me/api/portraits/women/22.jpg",
            phone: "+4455667788",
            email: "sophia.martinez@example.com",
            lastVisit: "2025-04-15",
            nextAppointment: "2025-05-15",
            bloodGroup: "O-",
            status: "active",
            conditions: ["Hypothyroidism"],
            riskLevel: "low",
            doctor: "Dr. James Wilson",
            medications: ["Levothyroxine"],
            notes: "Thyroid levels stable on current medication dosage."
        }
    ]);

    // State for search, filtering, and selected patient
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    
    // Filter patients based on search term and active filter
    const filteredPatients = patients.filter(patient => {
        // Search filter
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             patient.phone.includes(searchTerm);
        
        // Status filter
        const matchesFilter = activeFilter === 'all' || 
                             (activeFilter === 'critical' && patient.riskLevel === 'high') ||
                             (activeFilter === 'active' && patient.status === 'active') ||
                             (activeFilter === 'inactive' && patient.status === 'inactive');
        
        return matchesSearch && matchesFilter;
    });

    // Format date to be more readable
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    
    // Get risk level badge styling
    const getRiskBadge = (riskLevel) => {
        switch(riskLevel) {
            case 'low':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'high':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 animate-fadeIn">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Patient Directory
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Manage your patients and access their medical records.
                </p>
            </div>

            {/* Search and filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search patients by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setActiveFilter('all')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeFilter === 'all' 
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        All Patients
                    </button>
                    <button 
                        onClick={() => setActiveFilter('active')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeFilter === 'active' 
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Active
                    </button>
                    <button 
                        onClick={() => setActiveFilter('critical')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeFilter === 'critical' 
                                ? 'bg-red-100 text-red-700 border border-red-300' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Critical
                    </button>
                    <button 
                        onClick={() => setActiveFilter('inactive')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeFilter === 'inactive' 
                                ? 'bg-gray-200 text-gray-700 border border-gray-300' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Inactive
                    </button>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors duration-200 ${
                            viewMode === 'grid' 
                                ? 'bg-indigo-100 text-indigo-700' 
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                        aria-label="Grid view"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-md transition-colors duration-200 ${
                            viewMode === 'table' 
                                ? 'bg-indigo-100 text-indigo-700' 
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                        aria-label="Table view"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Action buttons */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium text-gray-700">{filteredPatients.length}</span> of <span className="font-medium text-gray-700">{patients.length}</span> patients
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                        <FiDownload className="mr-2 h-4 w-4" />
                        Export
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none">
                        <FiPlus className="mr-2 h-4 w-4" />
                        Add Patient
                    </button>
                </div>
            </div>

            {/* Patient list */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPatients.map((patient) => (
                        <div key={patient.id} className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center mb-4">
                                <img src={patient.image} alt={patient.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h2 className="text-lg font-bold">{patient.name}</h2>
                                    <p className="text-sm text-gray-500">{patient.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`px-3 py-1.5 text-sm font-medium rounded-md ${getRiskBadge(patient.riskLevel)}`}>{patient.riskLevel}</span>
                                <span className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-100 text-blue-700 border border-blue-300">{patient.status}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500">Last Visit: {formatDate(patient.lastVisit)}</p>
                                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">View Details</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-3 py-1.5 text-sm font-medium rounded-md ${getRiskBadge(patient.riskLevel)}`}>{patient.riskLevel}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-100 text-blue-700 border border-blue-300">{patient.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(patient.lastVisit)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PatientList;