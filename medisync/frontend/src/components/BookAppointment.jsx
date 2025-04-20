import React, { useState, useEffect } from 'react'

const BookAppointment = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [countrySearch, setCountrySearch] = useState('');
    const [stateSearch, setStateSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
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

    // Mock medicine database - replace with your actual API
    const medicineDatabase = {
        'fever': [
            {
                name: 'Paracetamol',
                dosage: '500mg',
                timing: 'After meals, 3 times a day',
                duration: '3-5 days',
                sideEffects: 'Rare: Nausea, stomach pain',
                precautions: 'Avoid alcohol, maintain hydration'
            }
        ],
        'headache': [
            {
                name: 'Ibuprofen',
                dosage: '400mg',
                timing: 'With food, every 6-8 hours',
                duration: 'As needed, not more than 3 days',
                sideEffects: 'Stomach upset, dizziness',
                precautions: 'Take with food, avoid if allergic to NSAIDs'
            }
        ],
        'cough': [
            {
                name: 'Dextromethorphan',
                dosage: '10-20mg',
                timing: 'Every 4-6 hours',
                duration: '5-7 days',
                sideEffects: 'Drowsiness, dizziness',
                precautions: 'Avoid alcohol, do not exceed recommended dose'
            }
        ],
        'cold': [
            {
                name: 'Chlorpheniramine',
                dosage: '4mg',
                timing: 'Every 4-6 hours',
                duration: '3-5 days',
                sideEffects: 'Drowsiness, dry mouth',
                precautions: 'Avoid driving, stay hydrated'
            }
        ]
    };

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://api.countrystatecity.in/v1/countries', {
                    headers: {
                        'X-CSCAPI-KEY': 'MldHMVRvWDdRMkFZVmQxQ1Z2TzgwVlZtM1hkR3NSZWhPcHhyS2ZQNA=='
                    }
                });
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        const fetchDoctorCategories = async () => {
            try {
                // Replace this with your actual API endpoint
                const response = await fetch('https://api.example.com/doctor-categories', {
                    headers: {
                        'Authorization': 'Bearer your-api-key'
                    }
                });
                const data = await response.json();
                setDoctorCategories(data);
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

        fetchCountries();
        fetchDoctorCategories();
    }, []);

    const handleCountrySelect = async (country) => {
        setSelectedCountry(country.iso2);
        setCountrySearch(country.name);
        setShowCountryDropdown(false);
        setSelectedState('');
        setSelectedCity('');
        setStates([]);
        setCities([]);
        setStateSearch('');
        setCitySearch('');
        setShowStateDropdown(false);
        setShowCityDropdown(false);

        try {
            const response = await fetch(`https://api.countrystatecity.in/v1/countries/${country.iso2}/states`, {
                headers: {
                    'X-CSCAPI-KEY': 'MldHMVRvWDdRMkFZVmQxQ1Z2TzgwVlZtM1hkR3NSZWhPcHhyS2ZQNA=='
                }
            });
            const data = await response.json();
            const sortedStates = data.sort((a, b) => a.name.localeCompare(b.name));
            setStates(sortedStates);
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

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
        
        // Show doctor list only when all location details are selected
        if (selectedCountry && selectedState && city.name) {
            setShowDoctorList(true);
            try {
                // Replace with your actual API endpoint
                const response = await fetch(
                    `https://api.example.com/doctors?specialization=${selectedCategory}&country=${selectedCountry}&state=${selectedState}&city=${city.name}`,
                    {
                        headers: {
                            'Authorization': 'Bearer your-api-key'
                        }
                    }
                );
                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                // Fallback mock data for testing
                setDoctors([
                    {
                        id: 1,
                        name: 'Dr. John Smith',
                        specialization: selectedCategory,
                        rating: 4.8,
                        experience: '15 years',
                        hospital: 'City General Hospital',
                        availability: 'Mon-Fri, 9AM-5PM',
                        image: 'https://via.placeholder.com/100',
                        location: {
                            country: selectedCountry,
                            state: selectedState,
                            city: city.name
                        }
                    },
                    {
                        id: 2,
                        name: 'Dr. Sarah Johnson',
                        specialization: selectedCategory,
                        rating: 4.9,
                        experience: '12 years',
                        hospital: 'Metro Medical Center',
                        availability: 'Tue-Sat, 10AM-6PM',
                        image: 'https://via.placeholder.com/100',
                        location: {
                            country: selectedCountry,
                            state: selectedState,
                            city: city.name
                        }
                    },
                    {
                        id: 3,
                        name: 'Dr. Michael Brown',
                        specialization: selectedCategory,
                        rating: 4.7,
                        experience: '8 years',
                        hospital: 'St. Mary\'s Hospital',
                        availability: 'Mon-Thu, 8AM-4PM',
                        image: 'https://via.placeholder.com/100',
                        location: {
                            country: selectedCountry,
                            state: selectedState,
                            city: city.name
                        }
                    }
                ]);
            }
        }
    };

    const handleCategorySelect = async (category) => {
        setSelectedCategory(category.name);
        setCategorySearch(category.name);
        setShowCategoryDropdown(false);
        setShowDoctorList(false); // Don't show doctors until location is selected
        setSelectedDoctor(null);
        setDoctorSearch('');
        setRatingFilter(0);
    };

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setDoctorSearch(doctor.name);
    };

    const filteredCountries = countries.filter(country => 
        country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const filteredStates = states.filter(state => 
        state.name.toLowerCase().includes(stateSearch.toLowerCase())
    );

    const filteredCities = cities.filter(city => 
        city.name.toLowerCase().includes(citySearch.toLowerCase())
    );

    const filteredCategories = doctorCategories.filter(category => 
        category.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const filteredDoctors = doctors
        .filter(doctor => 
            doctor.name.toLowerCase().includes(doctorSearch.toLowerCase()) &&
            doctor.rating >= ratingFilter
        )
        .sort((a, b) => b.rating - a.rating);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create new appointment object
        const newAppointment = {
            id: Date.now(), // Using timestamp as temporary ID
            category: selectedCategory,
            date: e.target.date.value,
            time: isFlexibleTiming ? 'Flexible' : selectedTime,
            status: 'Pending',
            doctor: selectedDoctor ? selectedDoctor.name : 'To be assigned',
            location: selectedDoctor ? selectedDoctor.hospital : 'To be determined',
            patientName: patientName
        };

        // Get existing appointments from localStorage or initialize empty array
        const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Add new appointment
        const updatedAppointments = [...existingAppointments, newAppointment];
        
        // Save to localStorage
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        
        // Redirect to MyAppointments page
        window.location.href = '/my-appointments';
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
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
                                readOnly
                            />
                            {showCategoryDropdown && (
                                <div class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    <div class="p-2 border-b">
                                        <input
                                            type="text"
                                            placeholder="Search category..."
                                            value={categorySearch}
                                            onChange={(e) => setCategorySearch(e.target.value)}
                                            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
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

                    <div class="relative">
                        <label class="block mb-2 font-semibold">Country</label>
                        <div class="relative">
                            <input
                                type="text"
                                value={countrySearch}
                                placeholder="Select country..."
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
                                readOnly
                            />
                            {showCountryDropdown && (
                                <div class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    <div class="p-2 border-b">
                                        <input
                                            type="text"
                                            placeholder="Search country..."
                                            value={countrySearch}
                                            onChange={(e) => setCountrySearch(e.target.value)}
                                            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div class="max-h-60 overflow-y-auto">
                                        {filteredCountries.map((country) => (
                                            <div
                                                key={country.iso2}
                                                onClick={() => handleCountrySelect(country)}
                                                class="p-3 hover:bg-green-50 cursor-pointer"
                                            >
                                                {country.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div class="relative">
                        <label class="block mb-2 font-semibold">State</label>
                        <div class="relative">
                            <input
                                type="text"
                                value={stateSearch}
                                placeholder="Select state..."
                                onClick={() => setShowStateDropdown(!showStateDropdown)}
                                disabled={!selectedCountry}
                                class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer disabled:bg-gray-100"
                                readOnly
                            />
                            {showStateDropdown && selectedCountry && (
                                <div class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    <div class="p-2 border-b">
                                        <input
                                            type="text"
                                            placeholder="Search state..."
                                            value={stateSearch}
                                            onChange={(e) => setStateSearch(e.target.value)}
                                            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div class="max-h-60 overflow-y-auto">
                                        {filteredStates.map((state) => (
                                            <div
                                                key={state.iso2}
                                                onClick={() => handleStateSelect(state)}
                                                class="p-3 hover:bg-green-50 cursor-pointer"
                                            >
                                                {state.name}
                                            </div>
                                        ))}
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
                                onClick={() => selectedState && setShowCityDropdown(!showCityDropdown)}
                                disabled={!selectedState}
                                class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer disabled:bg-gray-100"
                                readOnly
                            />
                            {showCityDropdown && selectedState && cities.length > 0 && (
                                <div class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    <div class="p-2 border-b">
                                        <input
                                            type="text"
                                            placeholder="Search city..."
                                            value={citySearch}
                                            onChange={(e) => setCitySearch(e.target.value)}
                                            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div class="max-h-60 overflow-y-auto">
                                        {filteredCities.map((city) => (
                                            <div
                                                key={city.id}
                                                onClick={() => handleCitySelect(city)}
                                                class="p-3 hover:bg-green-50 cursor-pointer"
                                            >
                                                {city.name}
                                            </div>
                                        ))}
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
                                        Showing {selectedCategory} specialists in {selectedCity}, {selectedState}
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
                                {filteredDoctors.length > 0 ? (
                                    filteredDoctors.map((doctor) => (
                                        <div
                                            key={doctor.id}
                                            onClick={() => handleDoctorSelect(doctor)}
                                            class={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                selectedDoctor?.id === doctor.id
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'hover:border-green-300'
                                            }`}
                                        >
                                            <div class="flex items-start space-x-4">
                                                <img
                                                    src={doctor.image}
                                                    alt={doctor.name}
                                                    class="w-16 h-16 rounded-full object-cover"
                                                />
                                                <div class="flex-1">
                                                    <div class="flex items-center justify-between">
                                                        <h4 class="font-semibold text-lg">{doctor.name}</h4>
                                                        <div class="flex items-center">
                                                            {renderStars(doctor.rating)}
                                                            <span class="ml-1 text-sm text-gray-600">
                                                                ({doctor.rating})
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p class="text-sm text-gray-600">{doctor.specialization}</p>
                                                    <p class="text-sm text-gray-600">
                                                        {doctor.experience} experience • {doctor.hospital}
                                                    </p>
                                                    <p class="text-sm text-gray-600">
                                                        Location: {doctor.location.city}, {doctor.location.state}
                                                    </p>
                                                    <p class="text-sm text-gray-600">Available: {doctor.availability}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div class="text-center py-8">
                                        <p class="text-gray-600">No doctors found in this location.</p>
                                        <p class="text-sm text-gray-500 mt-2">
                                            Try selecting a different location or specialization.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <label class="block mb-2 font-semibold">Select Date</label>
                        <input type="date" name="date" required
                            class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600" />
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
                        <button type="submit"
                            class="w-full bg-green-800 text-white py-3 rounded-xl text-lg hover:bg-green-900 transition">Book Appointment</button>
                    </div>
                </form>
            </div>

            <footer class="text-center text-sm text-gray-500 p-5 mt-10">
                © 2025 Smart Medical System. All rights reserved.
            </footer>
        </div>
    )
}

export default BookAppointment