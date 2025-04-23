import React, { useState } from 'react';
import { FaHospital, FaAmbulance, FaPhone, FaUserFriends, FaFirstAid, FaPills, FaExclamationTriangle, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

const EmergencyHelp = () => {
    const [emergencyContacts, setEmergencyContacts] = useState([
        { name: 'Family Member', phone: '+1234567890' },
        { name: 'Friend', phone: '+0987654321' }
    ]);
    const [medicalDetails, setMedicalDetails] = useState({
        bloodGroup: 'O+',
        allergies: 'None',
        currentMedications: ['Paracetamol', 'Vitamin C']
    });
    const [showSOSAlert, setShowSOSAlert] = useState(false);
    const [showAddHospitalForm, setShowAddHospitalForm] = useState(false);
    const [newHospital, setNewHospital] = useState({
        name: '',
        address: '',
        phone: '',
        rating: 'N/A'
    });

    const [hospitals, setHospitals] = useState([
        {
            id: 1,
            name: 'City General Hospital',
            address: '123 Medical Center Drive',
            phone: '123-456-7890',
            distance: '2.5 km',
            emergency: true
        },
        {
            id: 2,
            name: 'St. Mary\'s Medical Center',
            address: '456 Health Avenue',
            phone: '234-567-8901',
            distance: '3.1 km',
            emergency: true
        },
        {
            id: 3,
            name: 'Community Health Center',
            address: '789 Wellness Street',
            phone: '345-678-9012',
            distance: '4.2 km',
            emergency: true
        }
    ]);

    const [ambulances, setAmbulances] = useState([
        {
            id: 1,
            name: 'Emergency Medical Services',
            phone: '911',
            responseTime: '5-10 minutes',
            available: true
        },
        {
            id: 2,
            name: 'Rapid Response Ambulance',
            phone: '112',
            responseTime: '7-12 minutes',
            available: true
        },
        {
            id: 3,
            name: 'City Emergency Services',
            phone: '108',
            responseTime: '8-15 minutes',
            available: true
        }
    ]);

    const [selectedHospital, setSelectedHospital] = useState(null);
    const [selectedAmbulance, setSelectedAmbulance] = useState(null);

    const handleAddHospital = (e) => {
        e.preventDefault();
        const hospitalToAdd = {
            ...newHospital,
            id: Date.now(),
            distance: 'N/A',
            emergency: true
        };

        setHospitals(prev => [...prev, hospitalToAdd]);
        
        // Reset form
        setNewHospital({
            name: '',
            address: '',
            phone: '',
            rating: 'N/A'
        });
        setShowAddHospitalForm(false);
    };

    const handleSOSAlert = () => {
        setShowSOSAlert(true);
        // Here you would implement the actual alert sending logic
        // For example, sending SMS/email to emergency contacts
        setTimeout(() => setShowSOSAlert(false), 5000);
    };

    const handleCall = (phoneNumber) => {
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        window.location.href = `tel:${cleanNumber}`;
    };

    const emergencyNumbers = [
        { name: 'Ambulance', number: '102' },
        { name: 'Police', number: '100' },
        { name: 'Fire', number: '101' },
        { name: 'Women Helpline', number: '1091' }
    ];

    const firstAidInstructions = [
        {
            situation: 'Chest Pain',
            steps: [
                'Stay calm and sit down',
                'Call emergency services immediately',
                'Take prescribed medication if available',
                'Loosen tight clothing',
                'Monitor breathing and pulse'
            ]
        },
        {
            situation: 'Fainting',
            steps: [
                'Lay the person flat on their back',
                'Elevate their legs',
                'Check for breathing',
                'Loosen tight clothing',
                'Call emergency if unconscious for more than 1 minute'
            ]
        },
        {
            situation: 'Burns',
            steps: [
                'Cool the burn with running water',
                'Remove tight clothing before swelling',
                'Cover with sterile dressing',
                'Do not apply creams or ointments',
                'Seek medical help for severe burns'
            ]
        },
        {
            situation: 'Bleeding',
            steps: [
                'Apply direct pressure to wound',
                'Elevate the injured area',
                'Cover with clean dressing',
                'Call emergency for severe bleeding',
                'Monitor for signs of shock'
            ]
        }
    ];

    const handleCallHospital = (hospital) => {
        setSelectedHospital(hospital);
        window.location.href = `tel:${hospital.phone}`;
    };

    const handleCallAmbulance = (ambulance) => {
        setSelectedAmbulance(ambulance);
        window.location.href = `tel:${ambulance.phone}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-red-600 text-white p-4">
                <h1 className="text-2xl font-bold">🚨 Emergency Help</h1>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                {/* SOS Button */}
                <div className="text-center">
                    <button 
                        onClick={handleSOSAlert}
                        className="bg-red-600 text-white text-xl py-4 px-8 rounded-xl hover:bg-red-700 shadow-lg transform hover:scale-105 transition-all"
                    >
                        Send SOS Alert
                    </button>
                    {showSOSAlert && (
                        <p className="mt-2 text-green-600 font-semibold">
                            Alert sent to emergency contacts!
                        </p>
                    )}
                </div>

                {/* Medical Details */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <FaPills className="mr-2" /> Medical Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="font-medium">Blood Group</p>
                            <p>{medicalDetails.bloodGroup}</p>
                        </div>
                        <div>
                            <p className="font-medium">Allergies</p>
                            <p>{medicalDetails.allergies}</p>
                        </div>
                        <div>
                            <p className="font-medium">Current Medications</p>
                            <p>{medicalDetails.currentMedications.join(', ')}</p>
                        </div>
                    </div>
                </div>

                {/* Nearby Hospitals */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold flex items-center">
                            <FaHospital className="mr-2" /> Nearby Hospitals
                        </h2>
                        <button
                            onClick={() => setShowAddHospitalForm(!showAddHospitalForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
                        >
                            <FaPlus className="mr-2" /> Add Hospital
                        </button>
                    </div>

                    {/* Add Hospital Form */}
                    {showAddHospitalForm && (
                        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-semibold mb-4">Add New Hospital</h3>
                            <form onSubmit={handleAddHospital} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                                    <input
                                        type="text"
                                        value={newHospital.name}
                                        onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        value={newHospital.address}
                                        onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={newHospital.phone}
                                        onChange={(e) => setNewHospital({ ...newHospital, phone: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddHospitalForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Add Hospital
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-3">
                        {hospitals.map((hospital) => (
                            <div key={hospital.id} className="border rounded p-4">
                                <p className="font-medium text-lg">{hospital.name}</p>
                                <p className="text-gray-600 mb-2">{hospital.address}</p>
                                {hospital.phone && (
                                    <button 
                                        onClick={() => handleCallHospital(hospital)}
                                        className="text-blue-600 hover:text-blue-800 flex items-center mb-2"
                                    >
                                        <FaPhone className="mr-1" /> {hospital.phone}
                                    </button>
                                )}
                                <div className="flex items-center text-yellow-500 mb-2">
                                    <span className="mr-1">Distance:</span>
                                    <span>{hospital.distance}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ambulance Services */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold flex items-center">
                            <FaAmbulance className="mr-2" /> Ambulance Services
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {ambulances.map(ambulance => (
                            <div key={ambulance.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{ambulance.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Response Time: {ambulance.responseTime}
                                        </p>
                                        <p className={`text-sm mt-1 ${ambulance.available ? 'text-green-600' : 'text-red-600'}`}>
                                            {ambulance.available ? 'Available' : 'Unavailable'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleCallAmbulance(ambulance)}
                                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                    >
                                        <FaPhone />
                                        Call
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Numbers */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <FaPhone className="mr-2" /> Emergency Numbers
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {emergencyNumbers.map((number, index) => (
                            <div key={index} className="border rounded p-3">
                                <p className="font-medium">{number.name}</p>
                                <button 
                                    onClick={() => handleCall(number.number)}
                                    className="text-red-600 text-xl hover:text-red-800 flex items-center"
                                >
                                    <FaPhone className="mr-1" /> {number.number}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Contacts */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <FaUserFriends className="mr-2" /> Emergency Contacts
                    </h2>
                    <div className="space-y-3">
                        {emergencyContacts.map((contact, index) => (
                            <div key={index} className="border-b pb-3">
                                <p className="font-medium">{contact.name}</p>
                                <button 
                                    onClick={() => handleCall(contact.phone)}
                                    className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    <FaPhone className="mr-1" /> {contact.phone}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* First Aid Instructions */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <FaFirstAid className="mr-2" /> First Aid Instructions
                    </h2>
                    <div className="space-y-4">
                        {firstAidInstructions.map((instruction, index) => (
                            <div key={index} className="border rounded p-4">
                                <h3 className="font-semibold text-lg mb-2">{instruction.situation}</h3>
                                <ol className="list-decimal pl-5 space-y-1">
                                    {instruction.steps.map((step, stepIndex) => (
                                        <li key={stepIndex}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyHelp;