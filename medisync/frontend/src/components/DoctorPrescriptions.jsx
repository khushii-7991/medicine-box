import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPills, FaCalendarAlt, FaClock, FaInfoCircle, FaNotesMedical, FaSync } from 'react-icons/fa';

const DoctorPrescriptions = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activePrescriptions, setActivePrescriptions] = useState([]);

    useEffect(() => {
        fetchActivePrescriptions();
    }, []);

    // Function to fetch active prescriptions for the current patient
    const fetchActivePrescriptions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get patient token from localStorage
            const token = localStorage.getItem('patientToken');
            if (!token) {
                console.error('No patient token found in localStorage');
                navigate('/login/patient');
                return;
            }
            
            // Get patient ID from localStorage
            const patientData = JSON.parse(localStorage.getItem('patientData') || '{}');
            const patientId = patientData._id || patientData.id;
            
            if (!patientId) {
                console.error('No patient ID found');
                return;
            }
            
            console.log('Fetching prescriptions for patient ID:', patientId);
            
            // Fetch active prescriptions for this patient
            const response = await fetch(`/prescription/patient/${patientId}/active`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Prescription response status:', response.status);
            
            if (!response.ok) {
                if (response.status === 401) {
                    console.error('Unauthorized access. Redirecting to login.');
                    localStorage.removeItem('patientToken');
                    navigate('/login/patient');
                    return;
                }
                
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Fetched prescriptions:', data);
            
            if (Array.isArray(data) && data.length > 0) {
                console.log('Found', data.length, 'prescriptions');
                // Log the first prescription for debugging
                if (data[0]) {
                    console.log('Sample prescription:', {
                        id: data[0]._id,
                        doctorId: data[0].doctorId,
                        medicines: data[0].medicines,
                        duration: data[0].duration,
                        createdAt: data[0].createdAt
                    });
                }
            } else {
                console.log('No prescriptions found or invalid data format');
            }
            
            setActivePrescriptions(data);
            
        } catch (err) {
            console.error('Error fetching prescriptions:', err);
            setError('Failed to load prescriptions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-500">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-800">Doctor Prescribed Medications</h2>
                <button 
                    onClick={fetchActivePrescriptions}
                    className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                >
                    <FaSync className="mr-1" />
                    <span>Refresh</span>
                </button>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    <p>{error}</p>
                    <button 
                        onClick={fetchActivePrescriptions}
                        className="mt-2 text-sm font-medium text-red-700 hover:text-red-900"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {activePrescriptions.length > 0 ? (
                        activePrescriptions.map((prescription, index) => (
                            <div key={prescription._id || index} className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                                <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-white text-lg flex items-center">
                                            <FaNotesMedical className="mr-2" />
                                            Prescription from {prescription.doctorId?.name || 'Doctor'}
                                        </h3>
                                        <div className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-1" />
                                                {new Date(prescription.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="mb-4 flex items-center text-gray-700 bg-green-50 p-2 rounded-lg">
                                        <FaClock className="mr-2 text-green-600" />
                                        <span className="font-medium">Duration: {prescription.duration} days</span>
                                        <span className="ml-auto text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                            Active
                                        </span>
                                    </div>
                                    
                                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                        <FaPills className="mr-2 text-green-600" />
                                        Medicines
                                    </h4>
                                    <div className="space-y-4">
                                        {prescription.medicines.map((medicine, idx) => (
                                            <div key={idx} className="bg-green-50 rounded-lg p-4 border border-green-100">
                                                <div className="flex items-start">
                                                    <div className="bg-green-100 p-2 rounded-full mr-3">
                                                        <FaPills className="text-green-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="font-medium text-gray-900">{medicine.name}</h5>
                                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                            <div>
                                                                <span className="font-medium">Dosage:</span> {medicine.dosage}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">When to take:</span> {medicine.whenToTake === 'before_meal' ? 'Before meal' : 'After meal'}
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <span className="font-medium">Timings:</span> {medicine.timings.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {prescription.notes && (
                                        <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                                            <div className="flex items-start">
                                                <FaInfoCircle className="text-yellow-600 mr-2 mt-1" />
                                                <div>
                                                    <h5 className="font-medium text-gray-900 mb-1">Doctor's Notes</h5>
                                                    <p className="text-gray-700">{prescription.notes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-green-50 rounded-xl border border-green-100">
                            <div className="bg-green-100 p-3 rounded-full inline-flex mb-4">
                                <FaNotesMedical className="text-green-600 text-xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Prescriptions</h3>
                            <p className="text-gray-600 max-w-md mx-auto">You don't have any active prescriptions from your doctor at the moment. Prescriptions will appear here after your appointments.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorPrescriptions;
