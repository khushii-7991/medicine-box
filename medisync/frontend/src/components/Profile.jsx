import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit2, FiSave } from 'react-icons/fi';

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
        medicalHistory: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Load patient data from localStorage
        const loadPatientData = () => {
            try {
                const savedData = JSON.parse(localStorage.getItem('patientData') || '{}');
                setPatientData(savedData);
                setLoading(false);
            } catch (err) {
                setError('Error loading profile data');
                setLoading(false);
            }
        };

        loadPatientData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        try {
            localStorage.setItem('patientData', JSON.stringify(patientData));
            setIsEditing(false);
        } catch (err) {
            setError('Error saving profile data');
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
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-green-500 to-green-600">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg leading-6 font-medium text-white">
                                My Profile
                            </h3>
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
                                        Edit Profile
                                    </>
                                )}
                            </button>
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

                            {/* Medical Information */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-gray-900">Medical Information</h4>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={patientData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.dateOfBirth}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    {isEditing ? (
                                        <select
                                            name="gender"
                                            value={patientData.gender}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.gender}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                                    {isEditing ? (
                                        <select
                                            name="bloodGroup"
                                            value={patientData.bloodGroup}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.bloodGroup}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="height"
                                                value={patientData.height}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">{patientData.height} cm</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                name="weight"
                                                value={patientData.weight}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">{patientData.weight} kg</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Allergies</label>
                                    {isEditing ? (
                                        <textarea
                                            name="allergies"
                                            value={patientData.allergies}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.allergies || 'None'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Medical History</label>
                                    {isEditing ? (
                                        <textarea
                                            name="medicalHistory"
                                            value={patientData.medicalHistory}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-900">{patientData.medicalHistory || 'None'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 