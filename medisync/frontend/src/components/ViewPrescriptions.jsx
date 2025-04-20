import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiCalendar, FiClock, FiFileText, FiUser, FiAlertCircle, 
    FiCheckCircle, FiChevronDown, FiChevronUp, FiInfo
} from 'react-icons/fi';

const ViewPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedPrescription, setExpandedPrescription] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('patientToken');
            
            if (!token) {
                navigate('/login/patient');
                return;
            }

            // Get the patient ID from the token
            const patientId = JSON.parse(atob(token.split('.')[1])).id;
            
            const response = await fetch(`http://localhost:3000/prescription/patient/${patientId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch prescriptions');
            }

            const data = await response.json();
            console.log('Prescriptions data:', data);
            setPrescriptions(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching prescriptions:', err);
            setError(err.message || 'Failed to load prescriptions');
            setLoading(false);
        }
    };

    const togglePrescription = (id) => {
        if (expandedPrescription === id) {
            setExpandedPrescription(null);
        } else {
            setExpandedPrescription(id);
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const calculateEndDate = (startDate, duration) => {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);
        return endDate;
    };

    const isPrescriptionActive = (startDate, duration) => {
        const endDate = calculateEndDate(startDate, duration);
        return endDate >= new Date();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                    Your Prescriptions
                </h1>
                <p className="text-gray-600 mb-8">
                    View and manage your medication prescriptions
                </p>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your prescriptions...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Prescriptions</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : prescriptions.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <FiInfo className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No Prescriptions Found</h3>
                        <p className="text-gray-600 mb-4">You don't have any prescriptions yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {prescriptions.map((prescription) => (
                            <div 
                                key={prescription._id} 
                                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                                    expandedPrescription === prescription._id ? 'ring-2 ring-indigo-500' : ''
                                }`}
                            >
                                <div 
                                    className="p-6 cursor-pointer flex justify-between items-center"
                                    onClick={() => togglePrescription(prescription._id)}
                                >
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <FiFileText className="text-indigo-600 mr-2" />
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                Prescription #{prescription._id.substring(prescription._id.length - 6)}
                                            </h3>
                                            {isPrescriptionActive(prescription.createdAt, prescription.duration) ? (
                                                <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <FiUser className="mr-1" />
                                                <span>Dr. {prescription.doctorId?.name || 'Unknown'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FiCalendar className="mr-1" />
                                                <span>{formatDate(prescription.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FiClock className="mr-1" />
                                                <span>{prescription.duration} days</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`transform transition-transform duration-300 ${
                                        expandedPrescription === prescription._id ? 'rotate-180' : ''
                                    }`}>
                                        <FiChevronDown className="h-6 w-6 text-indigo-500" />
                                    </div>
                                </div>

                                {expandedPrescription === prescription._id && (
                                    <div className="border-t border-gray-100 bg-gray-50 p-6">
                                        {prescription.notes && (
                                            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                                                <h4 className="font-medium text-blue-800 mb-1">Doctor's Notes</h4>
                                                <p className="text-blue-700">{prescription.notes}</p>
                                            </div>
                                        )}

                                        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                                            <FiCheckCircle className="mr-2 text-indigo-600" />
                                            Prescribed Medications
                                        </h4>

                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Medicine
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Dosage
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Timing
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            When to Take
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {prescription.medicines.map((medicine, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {medicine.name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {medicine.dosage}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {medicine.timings.join(', ')}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {medicine.whenToTake === 'before_meal' ? 'Before meals' : 'After meals'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-indigo-50 p-4 rounded-lg">
                                                <h5 className="font-medium text-indigo-800 mb-2">Prescription Details</h5>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-indigo-700">Start Date:</span>
                                                        <span className="text-gray-700">{formatDate(prescription.createdAt)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-indigo-700">End Date:</span>
                                                        <span className="text-gray-700">{formatDate(calculateEndDate(prescription.createdAt, prescription.duration))}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-indigo-700">Duration:</span>
                                                        <span className="text-gray-700">{prescription.duration} days</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <h5 className="font-medium text-green-800 mb-2">Medication Reminders</h5>
                                                <ul className="space-y-2 text-green-700">
                                                    <li className="flex items-start">
                                                        <FiCheckCircle className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                                                        <span>Take your medications as prescribed by your doctor</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <FiCheckCircle className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                                                        <span>Set reminders to avoid missing doses</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <FiCheckCircle className="h-5 w-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                                                        <span>Complete the full course even if you feel better</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewPrescriptions;