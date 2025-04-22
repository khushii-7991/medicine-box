import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit2, FiSave, FiActivity, FiHeart } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const [patientData, setPatientData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        height: '',
        weight: '',
        allergies: '',
        medicalHistory: '',
        // New medical metrics
        bloodPressure: {
            systolic: '',
            diastolic: '',
            lastChecked: ''
        },
        bloodSugar: {
            fasting: '',
            postMeal: '',
            lastChecked: ''
        },
        heartRate: '',
        temperature: '',
        oxygenSaturation: '',
        bmi: '',
        chronicConditions: '',
        currentMedications: '',
        lastCheckup: '',
        medicalNotes: '',
        vitalHistory: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDoctor, setIsDoctor] = useState(false);

    useEffect(() => {
        // Check if user is a doctor
        const doctorToken = localStorage.getItem('doctorToken');
        setIsDoctor(!!doctorToken);

        // Load patient data
        loadPatientData();
    }, []);

    const loadPatientData = async () => {
        try {
            const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
            
            // If we have a doctor token, fetch the complete patient data from the backend
            const doctorToken = localStorage.getItem('doctorToken');
            if (doctorToken && savedData.id) {
                const response = await axios.get(`http://localhost:3000/patient/${savedData.id}`, {
                    headers: {
                        'Authorization': `Bearer ${doctorToken}`
                    }
                });
                setPatientData({ ...savedData, ...response.data });
            } else {
                setPatientData(savedData);
            }
            setLoading(false);
        } catch (err) {
            setError('Error loading profile data');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setPatientData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setPatientData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const calculateBMI = () => {
        if (patientData.height && patientData.weight) {
            const heightInMeters = patientData.height / 100;
            const bmi = (patientData.weight / (heightInMeters * heightInMeters)).toFixed(1);
            setPatientData(prev => ({ ...prev, bmi }));
        }
    };

    const handleSave = async () => {
        try {
            // Calculate BMI before saving
            calculateBMI();

            // If it's a doctor updating the profile, save to backend
            if (isDoctor) {
                const doctorToken = localStorage.getItem('doctorToken');
                await axios.put(
                    `http://localhost:3000/patient/${patientData.id}`,
                    patientData,
                    {
                        headers: {
                            'Authorization': `Bearer ${doctorToken}`
                        }
                    }
                );
                
                // Add new vital record to history
                const vitalRecord = {
                    date: new Date().toISOString(),
                    bloodPressure: patientData.bloodPressure,
                    bloodSugar: patientData.bloodSugar,
                    heartRate: patientData.heartRate,
                    temperature: patientData.temperature,
                    oxygenSaturation: patientData.oxygenSaturation,
                    weight: patientData.weight,
                    bmi: patientData.bmi
                };
                
                setPatientData(prev => ({
                    ...prev,
                    vitalHistory: [...(prev.vitalHistory || []), vitalRecord]
                }));

                toast.success('Patient profile updated successfully');
            }

            // Always save basic info to localStorage
            localStorage.setItem('patientData', JSON.stringify(patientData));
            setIsEditing(false);
        } catch (err) {
            setError('Error saving profile data');
            toast.error('Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-green-500 to-green-600">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg leading-6 font-medium text-white">
                                {isDoctor ? 'Patient Profile' : 'My Profile'}
                            </h3>
                            {(isDoctor || !isEditing) && (
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    {isEditing ? (
                                        <>
                                            <FiSave className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <FiEdit2 className="mr-2 h-4 w-4" />
                                            {isDoctor ? 'Update Patient' : 'Edit Profile'}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="px-4 py-5 sm:p-6">
                        {error && (
                            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-gray-900">Personal Information</h4>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={patientData.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={patientData.email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={patientData.phone}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="address"
                                            value={patientData.address}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.address}</p>
                                    )}
                                </div>
                            </div>

                            {/* Vital Signs & Measurements */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-gray-900">Vital Signs & Measurements</h4>
                                
                                {/* Blood Pressure */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Systolic BP (mmHg)</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="bloodPressure.systolic"
                                                value={patientData.bloodPressure.systolic}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">{patientData.bloodPressure.systolic}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Diastolic BP (mmHg)</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="bloodPressure.diastolic"
                                                value={patientData.bloodPressure.diastolic}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">{patientData.bloodPressure.diastolic}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Blood Sugar */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Fasting Blood Sugar (mg/dL)</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="bloodSugar.fasting"
                                                value={patientData.bloodSugar.fasting}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">{patientData.bloodSugar.fasting}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Post-meal Blood Sugar (mg/dL)</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="bloodSugar.postMeal"
                                                value={patientData.bloodSugar.postMeal}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">{patientData.bloodSugar.postMeal}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Other Vital Signs */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="heartRate"
                                                value={patientData.heartRate}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">{patientData.heartRate}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                step="0.1"
                                                name="temperature"
                                                value={patientData.temperature}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">{patientData.temperature}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">SpO2 (%)</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="oxygenSaturation"
                                                value={patientData.oxygenSaturation}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">{patientData.oxygenSaturation}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Medical History & Conditions */}
                            <div className="space-y-4 sm:col-span-2">
                                <h4 className="text-lg font-medium text-gray-900">Medical History & Conditions</h4>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Chronic Conditions</label>
                                    {isEditing ? (
                                        <textarea
                                            name="chronicConditions"
                                            value={patientData.chronicConditions}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            placeholder="List any chronic conditions..."
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.chronicConditions || 'None'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Current Medications</label>
                                    {isEditing ? (
                                        <textarea
                                            name="currentMedications"
                                            value={patientData.currentMedications}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            placeholder="List current medications..."
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.currentMedications || 'None'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Medical Notes</label>
                                    {isEditing ? (
                                        <textarea
                                            name="medicalNotes"
                                            value={patientData.medicalNotes}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            placeholder="Add any relevant medical notes..."
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.medicalNotes || 'No notes available'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Vital History */}
                            {patientData.vitalHistory && patientData.vitalHistory.length > 0 && (
                                <div className="sm:col-span-2">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Vital History</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Sugar</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heart Rate</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SpO2</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {patientData.vitalHistory.map((record, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {new Date(record.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            F: {record.bloodSugar.fasting} | P: {record.bloodSugar.postMeal}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {record.heartRate}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {record.temperature}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {record.oxygenSaturation}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {record.weight}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {record.bmi}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 