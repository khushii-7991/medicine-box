import React, { useState, useEffect } from 'react';
import { FaHospital, FaAmbulance, FaPhone, FaUserFriends, FaFirstAid, FaPills, FaExclamationTriangle, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

// Get API key from Vite environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
    const [nearbyHospitals, setNearbyHospitals] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [loadingHospitals, setLoadingHospitals] = useState(true);
    const [error, setError] = useState(null);
    const [showAddHospitalForm, setShowAddHospitalForm] = useState(false);
    const [newHospital, setNewHospital] = useState({
        name: '',
        address: '',
        phone: '',
        rating: 'N/A'
    });

    // Load Google Maps script
    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) {
            setError('Google Maps API key is not configured. Please check your environment variables.');
            setLoadingHospitals(false);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            setError('Failed to load Google Maps API. Please check your API key and network connection.');
            setLoadingHospitals(false);
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [GOOGLE_MAPS_API_KEY]);

    // Load manually added hospitals from localStorage
    useEffect(() => {
        const savedHospitals = localStorage.getItem('manualHospitals');
        if (savedHospitals) {
            const manualHospitals = JSON.parse(savedHospitals);
            setNearbyHospitals(manualHospitals);
        }
    }, []);

    const fetchNearbyHospitals = async (lat, lng) => {
        try {
            if (!window.google || !window.google.maps || !window.google.maps.places) {
                setError('Google Maps API is not loaded yet. Please wait a moment and refresh the page.');
                setLoadingHospitals(false);
                return;
            }

            const service = new window.google.maps.places.PlacesService(document.createElement('div'));
            const request = {
                location: new window.google.maps.LatLng(lat, lng),
                radius: 5000,
                type: 'hospital'
            };

            service.nearbySearch(request, (results, status) => {
                console.log('Google Maps API Status:', status); // Add logging
                
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    const googleHospitals = results.map(hospital => ({
                        name: hospital.name,
                        address: hospital.vicinity,
                        location: hospital.geometry.location,
                        rating: hospital.rating || 'N/A',
                        placeId: hospital.place_id
                    }));

                    // Combine with manually added hospitals
                    const savedHospitals = JSON.parse(localStorage.getItem('manualHospitals') || '[]');
                    setNearbyHospitals([...googleHospitals, ...savedHospitals]);
                } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                    setError('No hospitals found in your area. Try increasing the search radius.');
                } else if (status === window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
                    setError('Google Maps API quota exceeded. Please try again later.');
                } else if (status === window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
                    setError('Google Maps API request was denied. Please check your API key configuration and restrictions.');
                } else if (status === window.google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
                    setError('Invalid request to Google Maps API. Please check your parameters.');
                } else {
                    setError(`Google Maps API error: ${status}. Please check your API key and configuration.`);
                }
                setLoadingHospitals(false);
            });
        } catch (err) {
            console.error('Error fetching hospitals:', err);
            // If there's an error, at least show manually added hospitals
            const savedHospitals = JSON.parse(localStorage.getItem('manualHospitals') || '[]');
            if (savedHospitals.length > 0) {
                setNearbyHospitals(savedHospitals);
                setError('Could not fetch from Google Maps, showing saved hospitals instead.');
            } else {
                setError(`Failed to fetch nearby hospitals: ${err.message}`);
            }
            setLoadingHospitals(false);
        }
    };

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    fetchNearbyHospitals(latitude, longitude);
                },
                (error) => {
                    setError('Unable to retrieve your location. Please enable location services.');
                    setLoadingHospitals(false);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser');
            setLoadingHospitals(false);
        }
    }, []);

    const handleAddHospital = (e) => {
        e.preventDefault();
        const hospitalToAdd = {
            ...newHospital,
            location: userLocation || { lat: 0, lng: 0 },
            placeId: `manual-${Date.now()}`
        };

        setNearbyHospitals(prev => [...prev, hospitalToAdd]);
        
        // Save to localStorage
        const savedHospitals = JSON.parse(localStorage.getItem('manualHospitals') || '[]');
        localStorage.setItem('manualHospitals', JSON.stringify([...savedHospitals, hospitalToAdd]));
        
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

    const getDirections = (hospital) => {
        if (userLocation) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${hospital.location.lat},${hospital.location.lng}&travelmode=driving`;
            window.open(url, '_blank');
        }
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

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">
                            <p className="font-medium">Error:</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {loadingHospitals ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-2">Loading nearby hospitals...</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {nearbyHospitals.map((hospital, index) => (
                                <div key={index} className="border rounded p-4">
                                    <p className="font-medium text-lg">{hospital.name}</p>
                                    <p className="text-gray-600 mb-2">{hospital.address}</p>
                                    {hospital.phone && (
                                        <button 
                                            onClick={() => handleCall(hospital.phone)}
                                            className="text-blue-600 hover:text-blue-800 flex items-center mb-2"
                                        >
                                            <FaPhone className="mr-1" /> {hospital.phone}
                                        </button>
                                    )}
                                    <div className="flex items-center text-yellow-500 mb-2">
                                        <span className="mr-1">Rating:</span>
                                        <span>{hospital.rating}</span>
                                    </div>
                                    {hospital.location && (
                                        <button 
                                            onClick={() => getDirections(hospital)}
                                            className="text-blue-600 hover:text-blue-800 flex items-center mb-2"
                                        >
                                            <FaMapMarkerAlt className="mr-1" /> Get Directions
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
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