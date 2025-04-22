import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPlus, FiDownload, FiUser, FiCalendar, FiPhone, FiMail, FiHeart, FiActivity } from 'react-icons/fi';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc'); // 'grid' or 'table'
    const [viewMode, setViewMode] = useState('grid');

    // Random profile picture URLs for patients
    const profilePictures = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
        "https://randomuser.me/api/portraits/men/3.jpg",
        "https://randomuser.me/api/portraits/women/4.jpg",
        "https://randomuser.me/api/portraits/men/5.jpg",
        "https://randomuser.me/api/portraits/women/6.jpg",
        "https://randomuser.me/api/portraits/men/7.jpg",
        "https://randomuser.me/api/portraits/women/8.jpg",
        "https://randomuser.me/api/portraits/men/9.jpg",
        "https://randomuser.me/api/portraits/women/10.jpg",
        "https://randomuser.me/api/portraits/men/11.jpg",
        "https://randomuser.me/api/portraits/women/12.jpg",
        "https://randomuser.me/api/portraits/men/13.jpg",
        "https://randomuser.me/api/portraits/women/14.jpg",
        "https://randomuser.me/api/portraits/men/15.jpg",
    ];

    // Function to get a random profile picture
    const getRandomProfilePicture = () => {
        const randomIndex = Math.floor(Math.random() * profilePictures.length);
        return profilePictures[randomIndex];
    };

    // Fetch patients from the backend
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get the doctor token
                const token = localStorage.getItem('doctorToken');
                if (!token) {
                    throw new Error('Authentication required');
                }

                // Fetch patients from the backend
                const response = await fetch(`http://localhost:3000/patient/all?page=${currentPage}&limit=10`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error fetching patients: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched patients:', data);

                // Enhance patient data with random profile pictures and default values
                const enhancedPatients = data.patients.map(patient => ({
                    ...patient,
                    id: patient._id,
                    image: getRandomProfilePicture(),
                    phone: patient.phone || '+1234567890',
                    email: patient.email || 'patient@example.com',
                    lastVisit: patient.lastVisit || '2025-04-15',
                    nextAppointment: patient.nextAppointment || '2025-05-01',
                    bloodGroup: patient.bloodGroup || 'O+',
                    status: patient.status || 'active',
                    conditions: patient.conditions || ['Check-up'],
                    riskLevel: patient.riskLevel || 'low',
                    doctor: 'Dr. ' + JSON.parse(localStorage.getItem('doctorData') || '{}').name || 'Unknown',
                    medications: patient.medications || [],
                    notes: patient.notes || 'Regular check-up patient.'
                }));

                setPatients(enhancedPatients);
                setTotalPages(data.pagination.pages);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [currentPage]);

    // Filter patients based on search term and active filter
    const filteredPatients = patients.filter(patient => {
        // Search filter
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             patient.phone.includes(searchTerm);

        // Status filter
        const matchesFilter = filterStatus === 'all' ||
                             (filterStatus === 'active' && patient.status === 'active') ||
                             (filterStatus === 'inactive' && patient.status === 'inactive');

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
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            filterStatus === 'all' 
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        All Patients
                    </button>
                    <button 
                        onClick={() => setFilterStatus('active')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            filterStatus === 'active' 
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Active
                    </button>
                    <button 
                        onClick={() => setFilterStatus('inactive')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            filterStatus === 'inactive' 
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