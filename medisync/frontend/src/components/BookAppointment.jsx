import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookAppointment = () => {
    // India is hardcoded as the country
    const [selectedCountry] = useState('IN');
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [stateSearch, setStateSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [showStateDropdown, setShowStateDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [doctorCategories, setDoctorCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [showDoctorList, setShowDoctorList] = useState(false);
    const [ratingFilter, setRatingFilter] = useState(0);
    const [isFlexibleTiming, setIsFlexibleTiming] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [patientName, setPatientName] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch states for India directly
        const fetchStatesForIndia = async () => {
            try {
                const response = await fetch('https://api.countrystatecity.in/v1/countries/IN/states', {
                    headers: {
                        'X-CSCAPI-KEY': 'MldHMVRvWDdRMkFZVmQxQ1Z2TzgwVlZtM1hkR3NSZWhPcHhyS2ZQNA=='
                    }
                });
                const data = await response.json();
                const sortedStates = data.sort((a, b) => a.name.localeCompare(b.name));
                setStates(sortedStates);
            } catch (error) {
                console.error('Error fetching states for India:', error);
            }
        };

        const fetchDoctorCategories = async () => {
            try {
                // Fetch doctor categories from backend
                const response = await axios.get('http://localhost:3000/doctor/categories');
                setDoctorCategories(response.data);
            } catch (error) {
                console.error('Error fetching doctor categories:', error);
                // Fallback to default categories if API fails
                setDoctorCategories([
                    // By Body System / Organ
                    { id: 1, name: 'Cardiologist', description: 'Heart specialist', group: 'Body System' },
                    { id: 2, name: 'Neurologist', description: 'Brain & Nervous System specialist', group: 'Body System' },
                    { id: 3, name: 'Pulmonologist', description: 'Lungs & Respiratory specialist', group: 'Body System' },
                    { id: 4, name: 'Gastroenterologist', description: 'Digestive System specialist', group: 'Body System' },
                    { id: 5, name: 'Nephrologist', description: 'Kidneys specialist', group: 'Body System' },
                    { id: 6, name: 'Hepatologist', description: 'Liver specialist', group: 'Body System' },
                    { id: 7, name: 'Dermatologist', description: 'Skin specialist', group: 'Body System' },
                    { id: 8, name: 'Ophthalmologist', description: 'Eye specialist', group: 'Body System' },
                    { id: 9, name: 'ENT Specialist', description: 'Ear, Nose, Throat specialist', group: 'Body System' },
                    { id: 10, name: 'Urologist', description: 'Urinary Tract & Male Reproductive specialist', group: 'Body System' },

                    // By Patient Type / Age
                    { id: 11, name: 'Pediatrician', description: 'Children\'s health specialist', group: 'Patient Type' },
                    { id: 12, name: 'Neonatologist', description: 'Newborn babies specialist', group: 'Patient Type' },
                    { id: 13, name: 'Geriatrician', description: 'Elderly care specialist', group: 'Patient Type' },
                    { id: 14, name: 'Gynecologist', description: 'Female Reproductive Health specialist', group: 'Patient Type' },
                    { id: 15, name: 'Andrologist', description: 'Male Reproductive Health specialist', group: 'Patient Type' },
                    { id: 16, name: 'Adolescent Medicine Specialist', description: 'Teenagers health specialist', group: 'Patient Type' },

                    // By Treatment / Disease
                    { id: 17, name: 'Oncologist', description: 'Cancer specialist', group: 'Treatment' },
                    { id: 18, name: 'Psychiatrist', description: 'Mental Health specialist', group: 'Treatment' },
                    { id: 19, name: 'Orthopedic Surgeon', description: 'Bones & Muscles specialist', group: 'Treatment' },
                    { id: 20, name: 'Anesthesiologist', description: 'Anesthesia & Pain Management specialist', group: 'Treatment' },
                    { id: 21, name: 'Pathologist', description: 'Disease Diagnosis via Labs specialist', group: 'Treatment' },
                    { id: 22, name: 'Radiologist', description: 'Imaging (X-ray, MRI, CT) specialist', group: 'Treatment' },
                    { id: 23, name: 'General Surgeon', description: 'Surgical procedures specialist', group: 'Treatment' },
                    { id: 24, name: 'Plastic Surgeon', description: 'Cosmetic & Reconstructive surgery specialist', group: 'Treatment' },
                    { id: 25, name: 'Rheumatologist', description: 'Autoimmune & Joint Diseases specialist', group: 'Treatment' },
                    { id: 26, name: 'Endocrinologist', description: 'Hormone-Related Diseases specialist', group: 'Treatment' },
                    { id: 27, name: 'Immunologist', description: 'Immune System specialist', group: 'Treatment' },
                    { id: 28, name: 'Hematologist', description: 'Blood Diseases specialist', group: 'Treatment' },
                    { id: 29, name: 'Venereologist', description: 'Sexually Transmitted Infections (STI) specialist', group: 'Treatment' },
                    { id: 30, name: 'Emergency Medicine Specialist', description: 'Emergency Room specialist', group: 'Treatment' },

                    // Dental Specializations
                    { id: 31, name: 'General Dentist', description: 'Routine Dental Care specialist', group: 'Dental' },
                    { id: 32, name: 'Orthodontist', description: 'Braces & Teeth Alignment specialist', group: 'Dental' },
                    { id: 33, name: 'Endodontist', description: 'Root Canal specialist', group: 'Dental' },
                    { id: 34, name: 'Periodontist', description: 'Gums specialist', group: 'Dental' },
                    { id: 35, name: 'Prosthodontist', description: 'Artificial Teeth, Implants specialist', group: 'Dental' },
                    { id: 36, name: 'Pedodontist', description: 'Dental Care for Kids specialist', group: 'Dental' },
                    { id: 37, name: 'Oral and Maxillofacial Surgeon', description: 'Jaw, Face, Oral Surgeries specialist', group: 'Dental' },
                    { id: 38, name: 'Oral Pathologist', description: 'Disease Diagnosis from Oral Tissues specialist', group: 'Dental' },
                    { id: 39, name: 'Public Health Dentist', description: 'Community Dental Health specialist', group: 'Dental' },

                    // Super Specializations
                    { id: 40, name: 'Interventional Cardiologist', description: 'Advanced heart procedures specialist', group: 'Super Specialization' },
                    { id: 41, name: 'Pediatric Cardiologist', description: 'Children\'s heart specialist', group: 'Super Specialization' },
                    { id: 42, name: 'Surgical Oncologist', description: 'Cancer surgery specialist', group: 'Super Specialization' },
                    { id: 43, name: 'Pediatric Neurologist', description: 'Children\'s brain specialist', group: 'Super Specialization' },
                    { id: 44, name: 'Neuro Surgeon', description: 'Brain surgery specialist', group: 'Super Specialization' },
                    { id: 45, name: 'Vascular Surgeon', description: 'Blood vessel surgery specialist', group: 'Super Specialization' },
                    { id: 46, name: 'Cardiothoracic Surgeon', description: 'Heart and chest surgery specialist', group: 'Super Specialization' },
                    { id: 47, name: 'Pain Medicine Specialist', description: 'Advanced pain management specialist', group: 'Super Specialization' },
                    { id: 48, name: 'Critical Care Specialist', description: 'Intensive care specialist', group: 'Super Specialization' },
                    { id: 49, name: 'Nuclear Medicine Specialist', description: 'Radioactive medicine specialist', group: 'Super Specialization' }
                ]);
            }
        };

        fetchStatesForIndia();
        fetchDoctorCategories();
    }, []);



    const handleStateSelect = async (state) => {
        setSelectedState(state.iso2);
        setStateSearch(state.name);
        setShowStateDropdown(false);
        setSelectedCity('');
        setCities([]);
        setCitySearch('');
        setShowCityDropdown(false);

        try {
            const response = await fetch(`https://api.countrystatecity.in/v1/countries/${selectedCountry}/states/${state.iso2}/cities`, {
                headers: {
                    'X-CSCAPI-KEY': 'MldHMVRvWDdRMkFZVmQxQ1Z2TzgwVlZtM1hkR3NSZWhPcHhyS2ZQNA=='
                }
            });
            const data = await response.json();
            const sortedCities = data.sort((a, b) => a.name.localeCompare(b.name));
            setCities(sortedCities);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleCitySelect = async (city) => {
        setSelectedCity(city.name);
        setCitySearch(city.name);
        setShowCityDropdown(false);
        
        // Show doctor list when state, city and category are selected
        if (selectedState && city.name && selectedCategory) {
            setShowDoctorList(true);
            setLoading(true);
            try {
                // Fetch doctors from backend based on location and specialization
                const token = localStorage.getItem('patientToken');
                if (!token) {
                    setError('You must be logged in to search for doctors');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `http://localhost:3000/doctor/search?speciality=${selectedCategory}&city=${city.name}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                console.log('Raw doctor data from API:', response.data);
                
                if (response.data && Array.isArray(response.data)) {
                    setDoctors(response.data);
                    console.log('Fetched doctors:', response.data);
                    if (response.data.length === 0) {
                        setError(`No ${selectedCategory} doctors found in ${city.name}. Try a different location or specialty.`);
                    } else {
                        setError('');
                    }
                } else {
                    console.error('Invalid doctor data format:', response.data);
                    setDoctors([]);
                    setError('Error: Received invalid data format from server');
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                // Set empty doctors array if no doctors are found or there's an error
                setDoctors([]);
                setError('Error fetching doctors. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCategorySelect = async (category) => {
        setSelectedCategory(category.name);
        setCategorySearch(category.name);
        setShowCategoryDropdown(false);
        setSelectedDoctor(null);
        setDoctorSearch('');
        setRatingFilter(0);
        
        // If city is already selected, fetch doctors with the new category
        if (selectedCity && selectedState) {
            setShowDoctorList(true);
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:3000/doctor/search?speciality=${category.name}&city=${selectedCity}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('patientToken')}`
                        }
                    }
                );
                console.log('Raw doctor data from API:', response.data);
                
                if (response.data && Array.isArray(response.data)) {
                    setDoctors(response.data);
                    console.log('Fetched doctors after category change:', response.data);
                    if (response.data.length === 0) {
                        setError(`No ${category.name} doctors found in ${selectedCity}. Try a different location or specialty.`);
                    } else {
                        setError('');
                    }
                } else {
                    console.error('Invalid doctor data format:', response.data);
                    setDoctors([]);
                    setError('Error: Received invalid data format from server');
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setDoctors([]);
                setError('Error fetching doctors. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setShowDoctorList(false); // Don't show doctors until location is selected
        }
    };

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setDoctorSearch(doctor.name);
    };

    const filteredStates = states.filter(state => 
        state.name.toLowerCase().includes(stateSearch.toLowerCase())
    );

    const filteredCities = cities.filter(city => 
        city.name.toLowerCase().includes(citySearch.toLowerCase())
    );

    const filteredCategories = doctorCategories.filter(category => 
        category.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // Make sure we handle potentially undefined or null properties safely
    const filteredDoctors = doctors
        .filter(doctor => {
            // Safely check if doctor has all required properties
            if (!doctor || typeof doctor !== 'object') return false;
            
            // Check if name exists and matches search
            const nameMatches = doctor.name && 
                doctor.name.toLowerCase().includes(doctorSearch.toLowerCase());
            
            // Check if rating meets filter criteria (default to 5 if missing)
            const ratingValue = doctor.rating || 4.5;
            const ratingMatches = ratingValue >= ratingFilter;
            
            return nameMatches && ratingMatches;
        })
        .sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <svg
                key={index}
                className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    /**
     * Handles form submission for booking an appointment.
     * @param {Event} e Event object from form submission.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedDoctor) {
            setError('Please select a doctor');
            return;
        }

        if (!selectedDate) {
            setError('Please select a date');
            return;
        }

        if (!isFlexibleTiming && !selectedTime) {
            setError('Please select a time or choose flexible timing');
            return;
        }

        if (!reason) {
            setError('Please provide a reason for the appointment');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            // Get token from localStorage
            const token = localStorage.getItem('patientToken');
            if (!token) {
                setError('You must be logged in to book an appointment');
                setLoading(false);
                return;
            }

            // Create appointment request
            const appointmentData = {
                doctorId: selectedDoctor._id, // Now this will exist in both real and mock data
                date: selectedDate,
                time: selectedTime,
                isFlexibleTiming,
                reason
            };
            
            console.log('Sending appointment data:', appointmentData);

            // Send request to backend
            const response = await axios.post(
                'http://localhost:3000/appointment/create',
                appointmentData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setLoading(false);
            
            // Show success message
            toast.success('Appointment request sent successfully!');
            
            // Redirect to my appointments page
            navigate('/my-appointments');
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Failed to book appointment');
            toast.error(err.response?.data?.message || 'Failed to book appointment');
        }
    };

    return (
        <div class="bg-gray-50 min-h-screen font-sans">
            <nav class="bg-green-900 text-white p-5 flex justify-between items-center">
                <h1 class="text-2xl font-bold">📅 Book Appointment</h1>
                <a href="/my-appointments" class="text-sm hover:underline">View My Appointments</a>
            </nav>

            <div class="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12">
                <h2 class="text-3xl font-bold text-center text-green-800 mb-6">Book a New Appointment</h2>

                <form onSubmit={handleSubmit} class="space-y-5">
                    <div>
                        <label class="block mb-2 font-semibold">Your Name</label>
                        <input 
                            type="text" 
                            name="patient_name" 
                            placeholder="Enter your name" 
                            required
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600" 
                        />
                    </div>

                    <div class="relative">
                        <label class="block mb-2 font-semibold">Select Category</label>
                        <div class="relative">
                            <input
                                type="text"
                                value={categorySearch}
                                placeholder="Select doctor category..."
                                onChange={(e) => setCategorySearch(e.target.value)}
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
                            />
                            {showCategoryDropdown && (
                                <div class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    <div class="max-h-96 overflow-y-auto">
                                        {Object.entries(
                                            filteredCategories.reduce((acc, category) => {
                                                if (!acc[category.group]) {
                                                    acc[category.group] = [];
                                                }
                                                acc[category.group].push(category);
                                                return acc;
                                            }, {})
                                        ).map(([group, categories]) => (
                                            <div key={group} class="border-b last:border-b-0">
                                                <div class="p-2 bg-gray-50 font-semibold text-gray-700">{group}</div>
                                                {categories.map((category) => (
                                                    <div
                                                        key={category.id}
                                                        onClick={() => handleCategorySelect(category)}
                                                        class="p-3 hover:bg-green-50 cursor-pointer"
                                                    >
                                                        <div class="font-medium">{category.name}</div>
                                                        <div class="text-sm text-gray-600">{category.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800">Country: India</p>
                                    <p className="text-sm text-blue-600">All appointments are for locations within India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="relative">
                        <label class="block mb-2 font-semibold">State</label>
                        <div class="relative">
                            <input
                                type="text"
                                value={stateSearch}
                                placeholder="Select state..."
                                onChange={(e) => setStateSearch(e.target.value)}
                                onClick={() => setShowStateDropdown(!showStateDropdown)}
                                disabled={!selectedCountry}
                                class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer disabled:bg-gray-100"
                            />
                            {showStateDropdown && selectedCountry && (
                                <div class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    <div class="max-h-60 overflow-y-auto">
                                        {loading ? (
                                            <div class="p-3 text-center">
                                                <div class="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-500"></div>
                                            </div>
                                        ) : filteredStates.length > 0 ? (
                                            filteredStates.map((state) => (
                                                <div
                                                    key={state.iso2}
                                                    onClick={() => handleStateSelect(state)}
                                                    class="p-3 hover:bg-green-50 cursor-pointer"
                                                >
                                                    {state.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div class="p-3 text-center text-gray-500">No states found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div class="relative">
                        <label class="block mb-2 font-semibold">City</label>
                        <div class="relative">
                            <input
                                type="text"
                                value={citySearch}
                                placeholder={selectedState ? "Select city..." : "Select state first"}
                                onChange={(e) => setCitySearch(e.target.value)}
                                onClick={() => selectedState && setShowCityDropdown(!showCityDropdown)}
                                disabled={!selectedState}
                                class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer disabled:bg-gray-100"
                            />
                            {showCityDropdown && selectedState && (
                                <div class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    <div class="max-h-60 overflow-y-auto">
                                        {loading ? (
                                            <div class="p-3 text-center">
                                                <div class="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-500"></div>
                                            </div>
                                        ) : filteredCities.length > 0 ? (
                                            filteredCities.map((city) => (
                                                <div
                                                    key={city.id}
                                                    onClick={() => handleCitySelect(city)}
                                                    class="p-3 hover:bg-green-50 cursor-pointer"
                                                >
                                                    {city.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div class="p-3 text-center text-gray-500">No cities found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {showDoctorList && (
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-xl font-semibold text-gray-800">Available Doctors</h3>
                                    <p class="text-sm text-gray-600">
                                        Showing {selectedCategory} specialists in {selectedCity}, {selectedState}, India
                                    </p>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm text-gray-600">Filter by rating:</span>
                                    <select
                                        value={ratingFilter}
                                        onChange={(e) => setRatingFilter(Number(e.target.value))}
                                        class="border rounded p-1 text-sm"
                                    >
                                        <option value={0}>All Ratings</option>
                                        <option value={4}>4+ Stars</option>
                                        <option value={4.5}>4.5+ Stars</option>
                                        <option value={4.8}>4.8+ Stars</option>
                                    </select>
                                </div>
                            </div>

                            <div class="relative">
                                <input
                                    type="text"
                                    value={doctorSearch}
                                    onChange={(e) => setDoctorSearch(e.target.value)}
                                    placeholder="Search doctors..."
                                    class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>

                            <div class="space-y-4 max-h-96 overflow-y-auto">
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                                        <p className="mt-2 text-gray-600">Searching for doctors...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-8">
                                        <p className="text-red-500">{error}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Try selecting a different location or specialization.
                                        </p>
                                    </div>
                                ) : filteredDoctors.length > 0 ? (
                                    filteredDoctors.map((doctor) => (
                                        <div
                                            key={doctor._id}
                                            onClick={() => handleDoctorSelect(doctor)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                selectedDoctor?._id === doctor._id
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'hover:border-green-300'
                                            }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
                                                    {doctor.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold text-lg">{doctor.name || 'Doctor'}</h4>
                                                        <div className="flex items-center">
                                                            {renderStars(doctor.rating || 4.5)}
                                                            <span className="ml-1 text-sm text-gray-600">
                                                                ({doctor.rating || 4.5})
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{doctor.speciality || 'Specialist'}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {doctor.experience || '0'} years experience • {doctor.hospital?.name || 'Hospital'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Location: {doctor.city || 'Unknown'}, India
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Fee: ₹{doctor.consultationFee || 'Varies'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">Available: {doctor.availability || 'Mon-Fri, 9AM-5PM'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600">No doctors found in this location.</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Try selecting a different location or specialization.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <label class="block mb-2 font-semibold">Select Date</label>
                        <input 
                            type="date" 
                            name="date" 
                            required
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600" 
                        />
                    </div>

                    <div class="space-y-3">
                        <label class="block font-semibold">Select Time</label>
                        
                        <div class="flex items-center space-x-3 mb-3">
                            <input
                                type="checkbox"
                                id="flexibleTiming"
                                checked={isFlexibleTiming}
                                onChange={(e) => {
                                    setIsFlexibleTiming(e.target.checked);
                                    if (e.target.checked) {
                                        setSelectedTime('');
                                    }
                                }}
                                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label for="flexibleTiming" class="text-gray-700">
                                Whenever the doctor is available
                            </label>
                        </div>

                        <input
                            type="time"
                            name="time"
                            value={selectedTime}
                            onChange={(e) => {
                                setSelectedTime(e.target.value);
                                setIsFlexibleTiming(false);
                            }}
                            disabled={isFlexibleTiming}
                            required={!isFlexibleTiming}
                            class={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 ${
                                isFlexibleTiming ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                        />
                    </div>

                    <div>
                        <label class="block mb-2 font-semibold">Reason for Visit</label>
                        <textarea
                            name="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            placeholder="Please describe your symptoms or reason for the appointment"
                            class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 min-h-[100px]"
                        ></textarea>
                    </div>

                    {error && (
                        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <button 
                            type="submit"
                            disabled={loading}
                            class={`w-full ${loading ? 'bg-gray-400' : 'bg-green-800 hover:bg-green-900'} text-white py-3 rounded-xl text-lg transition flex items-center justify-center`}
                        >
                            {loading ? (
                                <>
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : 'Book Appointment'}
                        </button>
                    </div>

                </form>
            </div>

            <footer class="text-center text-sm text-gray-500 p-5 mt-10">
                2025 Smart Medical System. All rights reserved.
            </footer>
        </div>
    )
}

export default BookAppointment