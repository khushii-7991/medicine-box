import React, { useState, useEffect } from 'react'
import { FaPlus, FaPills, FaCalendarAlt, FaClock, FaInfoCircle, FaNotesMedical } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import DoctorPrescriptions from './DoctorPrescriptions'

const ViewPrescriptions = () => {
    const [userName, setUserName] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [medicineRecommendations, setMedicineRecommendations] = useState([]);
    const [showMedicineRecommendations, setShowMedicineRecommendations] = useState(false);
    const [addedMedicines, setAddedMedicines] = useState([]);
    const [showRecommendationButton, setShowRecommendationButton] = useState(true);
    const [prescriptions, setPrescriptions] = useState([]);
    const [doctorRecommendations, setDoctorRecommendations] = useState([]);
    const [showDoctorRecommendations, setShowDoctorRecommendations] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [prescriptionRequest, setPrescriptionRequest] = useState({
        symptoms: '',
        additionalNotes: '',
        preferredMedicines: ''
    });
    const [showManualForm, setShowManualForm] = useState(false);
    const [newMedicine, setNewMedicine] = useState({
        medicine: '',
        timing: '',
        duration: ''
    });
    const [prescriptionResponses, setPrescriptionResponses] = useState([]);
    const [addedMedicinesFromResponses, setAddedMedicinesFromResponses] = useState([]);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activePrescriptions, setActivePrescriptions] = useState([]);

    useEffect(() => {
        // Get user data from localStorage
        const patientData = JSON.parse(localStorage.getItem('patientData') || '{}');
        setUserName(patientData.name || 'User');

        // Fetch real prescriptions from the API
        fetchActivePrescriptions();

        // Keep the existing mock data for other features that haven't been connected to real API yet
        const storedPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
        if (storedPrescriptions.length > 0) {
            setPrescriptions(storedPrescriptions);
        } else {
            // Set default prescriptions if none exist
            setPrescriptions([
                { medicine: 'Paracetamol', dosage: '2 Times a Day', timing: 'After Meal', duration: '5 Days' },
                { medicine: 'Vitamin C', dosage: 'Once a Day', timing: 'Before Meal', duration: '10 Days' }
            ]);
        }

        // Load prescription responses from localStorage if available
        const storedResponses = JSON.parse(localStorage.getItem('prescriptionResponses') || '[]');
        if (storedResponses.length > 0) {
            setPrescriptionResponses(storedResponses);
        } else {
            // Set default responses if none exist
            setPrescriptionResponses([
                {
                    id: 1,
                    doctor: 'Dr. Sarah Johnson',
                    date: '2024-03-15',
                    status: 'approved',
                    medicines: [
                        { name: 'Paracetamol', dosage: '500mg', frequency: '3 times a day', duration: '5 days' },
                        { name: 'Vitamin C', dosage: '500mg', frequency: 'Once daily', duration: '10 days' }
                    ],
                    notes: 'Take with plenty of water. Avoid alcohol while on medication.'
                },
                {
                    id: 2,
                    doctor: 'Dr. Michael Chen',
                    date: '2024-03-14',
                    status: 'pending',
                    medicines: [],
                    notes: 'Reviewing your symptoms and medical history.'
                }
            ]);
        }
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
        ],
        'fever and headache': [
            {
                name: 'Paracetamol + Ibuprofen',
                dosage: '500mg + 400mg',
                timing: 'After meals, 3 times a day',
                duration: '3-5 days',
                sideEffects: 'Nausea, stomach upset',
                precautions: 'Avoid alcohol, take with food'
            }
        ],
        'cold and cough': [
            {
                name: 'Levocetirizine + Dextromethorphan',
                dosage: '5mg + 10mg',
                timing: 'At night before sleep',
                duration: '5 days',
                sideEffects: 'Drowsiness, dry mouth',
                precautions: 'Avoid driving, alcohol'
            }
        ],
        'allergy': [
            {
                name: 'Cetirizine',
                dosage: '10mg',
                timing: 'Once daily at night',
                duration: 'As prescribed',
                sideEffects: 'Drowsiness, dry mouth',
                precautions: 'Avoid alcohol, stay hydrated'
            }
        ],
        'skin rash': [
            {
                name: 'Hydrocortisone Cream',
                dosage: 'Apply thin layer',
                timing: '2-3 times a day',
                duration: 'Until rash subsides',
                sideEffects: 'Mild irritation, redness',
                precautions: 'Do not use on broken skin'
            }
        ],
        'itching': [
            {
                name: 'Loratadine',
                dosage: '10mg',
                timing: 'Once daily',
                duration: 'As required',
                sideEffects: 'Rare: Drowsiness',
                precautions: 'Avoid alcohol'
            }
        ],
        'fever, cough and sore throat': [
            {
                name: 'Paracetamol + Dextromethorphan + Warm saline gargles',
                dosage: '500mg + 10mg',
                timing: 'After meals, every 6 hours',
                duration: '5 days',
                sideEffects: 'Drowsiness, nausea',
                precautions: 'Avoid cold drinks, take rest'
            }
        ],
        'runny nose': [
            {
                name: 'Levocetirizine',
                dosage: '5mg',
                timing: 'At night',
                duration: '3-5 days',
                sideEffects: 'Drowsiness',
                precautions: 'Avoid alcohol, driving'
            }
        ],
        'breathing difficulty': [
            {
                name: 'Salbutamol Inhaler',
                dosage: '2 puffs',
                timing: 'When needed',
                duration: 'As required',
                sideEffects: 'Tremors, increased heartbeat',
                precautions: 'Consult doctor if frequent'
            }
        ],
        'vomiting': [
            {
                name: 'Ondansetron',
                dosage: '4mg',
                timing: 'Before meals, 2-3 times a day',
                duration: 'Until symptoms improve',
                sideEffects: 'Constipation, headache',
                precautions: 'Avoid alcohol'
            }
        ],
        'diarrhea': [
            {
                name: 'ORS + Loperamide',
                dosage: 'As directed',
                timing: 'After each loose stool',
                duration: 'Until normal',
                sideEffects: 'Constipation (if overused)',
                precautions: 'Maintain hydration'
            }
        ],
        'body ache': [
            {
                name: 'Paracetamol',
                dosage: '500mg',
                timing: 'Every 6-8 hours',
                duration: '3 days',
                sideEffects: 'Rare nausea',
                precautions: 'Avoid alcohol'
            }
        ],
        'allergic cough': [
            {
                name: 'Montelukast + Levocetirizine',
                dosage: '10mg + 5mg',
                timing: 'At night',
                duration: '5-7 days',
                sideEffects: 'Drowsiness',
                precautions: 'Avoid alcohol, consult doctor if severe'
            }
        ],
        'eye irritation': [
            {
                name: 'Lubricating Eye Drops',
                dosage: '1-2 drops',
                timing: '3-4 times a day',
                duration: 'As required',
                sideEffects: 'Temporary blurring',
                precautions: 'Avoid touching eyes'
            }
        ]
    };
    
    // Mock doctor database - replace with your actual API
    const doctorDatabase = {
        'fever': [
            { name: 'Dr. Sarah Johnson', specialization: 'General Physician', experience: '15 years', rating: 4.8, available: 'Today, 2:00 PM' },
            { name: 'Dr. Michael Chen', specialization: 'Internal Medicine', experience: '12 years', rating: 4.7, available: 'Today, 4:30 PM' }
        ],
        'headache': [
            { name: 'Dr. Emily Parker', specialization: 'Neurologist', experience: '10 years', rating: 4.9, available: 'Tomorrow, 10:00 AM' },
            { name: 'Dr. Robert Wilson', specialization: 'Neurologist', experience: '8 years', rating: 4.6, available: 'Today, 3:00 PM' }
        ],
        'cough': [
            { name: 'Dr. James Miller', specialization: 'Pulmonologist', experience: '20 years', rating: 4.9, available: 'Today, 11:00 AM' },
            { name: 'Dr. Lisa Brown', specialization: 'ENT Specialist', experience: '15 years', rating: 4.7, available: 'Tomorrow, 9:00 AM' }
        ],
        'cold': [
            { name: 'Dr. Lisa Brown', specialization: 'ENT Specialist', experience: '15 years', rating: 4.7, available: 'Tomorrow, 9:00 AM' },
            { name: 'Dr. Sarah Johnson', specialization: 'General Physician', experience: '15 years', rating: 4.8, available: 'Today, 2:00 PM' }
        ],
        'fever and headache': [
            { name: 'Dr. Sarah Johnson', specialization: 'General Physician', experience: '15 years', rating: 4.8, available: 'Today, 2:00 PM' },
            { name: 'Dr. Emily Parker', specialization: 'Neurologist', experience: '10 years', rating: 4.9, available: 'Tomorrow, 10:00 AM' }
        ],
        'cold and cough': [
            { name: 'Dr. James Miller', specialization: 'Pulmonologist', experience: '20 years', rating: 4.9, available: 'Today, 11:00 AM' },
            { name: 'Dr. Lisa Brown', specialization: 'ENT Specialist', experience: '15 years', rating: 4.7, available: 'Tomorrow, 9:00 AM' }
        ]
    };

    const handleSymptomsSubmit = () => {
        const symptomsList = symptoms.toLowerCase().split(',').map(s => s.trim());
        const recommendations = [];
        const doctors = [];

        // First check for combination symptoms
        const combinedSymptoms = symptomsList.join(' and ');
        if (medicineDatabase[combinedSymptoms]) {
            recommendations.push(...medicineDatabase[combinedSymptoms]);
        }
        if (doctorDatabase[combinedSymptoms]) {
            doctors.push(...doctorDatabase[combinedSymptoms]);
        }

        // If no combination found, check individual symptoms
        symptomsList.forEach(symptom => {
            if (medicineDatabase[symptom]) {
                recommendations.push(...medicineDatabase[symptom]);
            }
            if (doctorDatabase[symptom]) {
                doctors.push(...doctorDatabase[symptom]);
            }
        });

        setMedicineRecommendations(recommendations);
        setDoctorRecommendations(doctors);
        setShowMedicineRecommendations(true);
        setShowDoctorRecommendations(true);
        setShowRecommendationButton(false);
    };

    const handleSymptomsChange = (e) => {
        setSymptoms(e.target.value);
        // If symptoms are cleared or changed, show the recommendation button again
        if (!e.target.value.trim()) {
            setShowRecommendationButton(true);
            setShowMedicineRecommendations(false);
            setShowDoctorRecommendations(false);
            setMedicineRecommendations([]);
            setDoctorRecommendations([]);
        }
    };

    const handleAddToPrescription = (medicine) => {
        const newPrescription = {
            medicine: medicine.name,
            timing: medicine.timing,
            duration: medicine.duration
        };
        setPrescriptions([...prescriptions, newPrescription]);
        setAddedMedicines([...addedMedicines, medicine.name]);
    };

    const emitPrescriptionsChange = () => {
        const event = new CustomEvent('prescriptionsChanged', {
            detail: { prescriptions }
        });
        window.dispatchEvent(event);
    };

    const handleDeletePrescription = (index) => {
        const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
        setPrescriptions(updatedPrescriptions);
        localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
        emitPrescriptionsChange();
    };

    const handlePrescriptionRequest = (doctor) => {
        setSelectedDoctor(doctor);
        setPrescriptionRequest({
            symptoms: symptoms,
            additionalNotes: '',
            preferredMedicines: ''
        });
        setShowPrescriptionForm(true);
    };

    const handleSubmitPrescriptionRequest = (e) => {
        e.preventDefault();
        // Here you would typically send this to your backend
        alert('Prescription request sent successfully! The doctor will review your request and provide a prescription.');
        setShowPrescriptionForm(false);
    };

    const handleAddManualMedicine = (e) => {
        e.preventDefault();
        const newPrescription = {
            medicine: newMedicine.medicine,
            timing: newMedicine.timing,
            duration: newMedicine.duration
        };
        const updatedPrescriptions = [...prescriptions, newPrescription];
        setPrescriptions(updatedPrescriptions);
        localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
        setNewMedicine({
            medicine: '',
            timing: '',
            duration: ''
        });
        setShowManualForm(false);
        emitPrescriptionsChange();
    };

    const handleAddToPrescriptions = (medicine) => {
        const newPrescription = {
            medicine: medicine.name,
            timing: medicine.frequency,
            duration: medicine.duration
        };
        const updatedPrescriptions = [...prescriptions, newPrescription];
        setPrescriptions(updatedPrescriptions);
        localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
        setAddedMedicinesFromResponses([...addedMedicinesFromResponses, medicine.name]);
        emitPrescriptionsChange();
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-5">
            <div className="grid grid-cols-1 gap-8">
                {/* Doctor Prescribed Medications */}
                <div>
                    <DoctorPrescriptions />
                </div>
                
                {/* Existing Prescriptions Table */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-green-800">Your Prescriptions</h2>
                        <button
                            onClick={() => setShowManualForm(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                            <FaPlus className="text-sm" />
                            Add Medicine Manually
                        </button>
                    </div>
                    <div className="shadow-xl rounded-2xl overflow-x-auto">
                        <table className="w-full bg-white border-collapse">
                            <thead className="bg-green-900 text-white">
                                <tr>
                                    <th className="py-3 px-8 text-left w-1/3">Medicine</th>
                                    <th className="py-3 px-8 text-left w-1/3">Meal Timing</th>
                                    <th className="py-3 px-8 text-left w-1/3">Duration</th>
                                    <th className="py-3 px-8 text-left w-1/6">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescriptions.map((prescription, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-3 px-8">{prescription.medicine}</td>
                                        <td className="py-3 px-8">{prescription.timing}</td>
                                        <td className="py-3 px-8">{prescription.duration}</td>
                                        <td className="py-3 px-8">
                                            <button
                                                onClick={() => handleDeletePrescription(index)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                title="Delete prescription"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {prescriptions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center text-gray-500">
                                            No prescriptions added yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Manual Medicine Form */}
                {showManualForm && (
                    <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-green-800">Add New Medicine</h3>
                                <button 
                                    onClick={() => setShowManualForm(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <form onSubmit={handleAddManualMedicine} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                                    <input
                                        type="text"
                                        value={newMedicine.medicine}
                                        onChange={(e) => setNewMedicine({...newMedicine, medicine: e.target.value})}
                                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                        placeholder="Enter medicine name"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Meal Timing</label>
                                    <input
                                        type="text"
                                        value={newMedicine.timing}
                                        onChange={(e) => setNewMedicine({...newMedicine, timing: e.target.value})}
                                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                        placeholder="e.g. After Meal"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                    <input
                                        type="text"
                                        value={newMedicine.duration}
                                        onChange={(e) => setNewMedicine({...newMedicine, duration: e.target.value})}
                                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                        placeholder="e.g. 5 Days"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowManualForm(false)}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Add Medicine
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Symptoms and Recommendations */}
                <div>
                    <h2 className="text-3xl font-bold text-green-800 mb-6">Get Medical Help</h2>
                    
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-xl">
                            <label className="block font-semibold mb-2">Enter Your Symptoms</label>
                            <textarea
                                value={symptoms}
                                onChange={handleSymptomsChange}
                                placeholder="Enter your symptoms (comma separated). Example: fever, headache, cough"
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 h-32"
                            />
                            <div className="text-sm text-gray-600 mt-2">
                                Please describe your symptoms in detail. Separate multiple symptoms with commas.
                            </div>
                            {showRecommendationButton && (
                                <button
                                    onClick={handleSymptomsSubmit}
                                    className="w-full mt-4 bg-green-800 text-white py-3 rounded-xl text-lg hover:bg-green-900 transition"
                                >
                                    Get Recommendations
                                </button>
                            )}
                        </div>

                        {showPrescriptionForm && selectedDoctor && (
                            <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-green-800">Request Prescription from {selectedDoctor.name}</h3>
                                        <button 
                                            onClick={() => setShowPrescriptionForm(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    
                                    <form onSubmit={handleSubmitPrescriptionRequest} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                                            <textarea
                                                value={prescriptionRequest.symptoms}
                                                onChange={(e) => setPrescriptionRequest({...prescriptionRequest, symptoms: e.target.value})}
                                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                rows="3"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                                            <textarea
                                                value={prescriptionRequest.additionalNotes}
                                                onChange={(e) => setPrescriptionRequest({...prescriptionRequest, additionalNotes: e.target.value})}
                                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                rows="3"
                                                placeholder="Any additional information about your condition..."
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Medicines (if any)</label>
                                            <input
                                                type="text"
                                                value={prescriptionRequest.preferredMedicines}
                                                onChange={(e) => setPrescriptionRequest({...prescriptionRequest, preferredMedicines: e.target.value})}
                                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                placeholder="Enter any medicines you prefer or have used before..."
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowPrescriptionForm(false)}
                                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                Send Request
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {showDoctorRecommendations && (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-green-800">Recommended Doctors</h3>
                                {doctorRecommendations.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {doctorRecommendations.map((doctor, index) => (
                                            <div key={index} className="bg-white p-6 rounded-2xl shadow-xl">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h4 className="font-semibold text-lg">{doctor.name}</h4>
                                                        <p className="text-gray-600">{doctor.specialization}</p>
                                                    </div>
                                                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg">
                                                        {doctor.rating} ⭐
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 text-sm">
                                                    <p><span className="font-medium">Experience:</span> {doctor.experience}</p>
                                                    <p><span className="font-medium">Response Time:</span> Within 24 hours</p>
                                                </div>

                                                <button 
                                                    onClick={() => handlePrescriptionRequest(doctor)}
                                                    className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                                >
                                                    Ask for Prescription
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-white rounded-2xl shadow-xl">
                                        <p className="text-gray-600">No specific doctor recommendations found for these symptoms.</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Please consult with a general physician for proper diagnosis.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {showMedicineRecommendations && (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-green-800">Medicine Recommendations</h3>
                                {medicineRecommendations.length > 0 ? (
                                    <div className="space-y-4">
                                        {medicineRecommendations.map((medicine, index) => (
                                            <div key={index} className="bg-white p-6 rounded-2xl shadow-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-lg">{medicine.name}</h4>
                                                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        {medicine.dosage}
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Timing:</p>
                                                        <p className="font-medium">{medicine.timing}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Duration:</p>
                                                        <p className="font-medium">{medicine.duration}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-3">
                                                    <p className="text-sm text-gray-600">Side Effects:</p>
                                                    <p className="text-sm">{medicine.sideEffects}</p>
                                                </div>

                                                <div className="mt-3">
                                                    <p className="text-sm text-gray-600">Precautions:</p>
                                                    <p className="text-sm">{medicine.precautions}</p>
                                                </div>

                                                <div className="mt-4 text-sm text-gray-500">
                                                    Note: This is a general recommendation. Please consult your doctor before taking any medication.
                                                </div>

                                                {addedMedicines.includes(medicine.name) ? (
                                                    <div className="mt-4 bg-green-100 text-green-800 py-2 px-4 rounded-lg text-center">
                                                        Added to Prescription
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAddToPrescription(medicine)}
                                                        className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                                    >
                                                        Add to Prescription
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 bg-white rounded-2xl shadow-xl">
                                        <p className="text-gray-600">No specific medicine recommendations found for these symptoms.</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Please consult with the doctor for proper diagnosis and treatment.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Prescription Responses */}
                <div>
                    <h2 className="text-3xl font-bold text-green-800 mb-6">Prescription Responses</h2>
                    <div className="space-y-4">
                        {prescriptionResponses.map(response => (
                            <div key={response.id} className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">{response.doctor}</h3>
                                        <p className="text-gray-600">Date: {response.date}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg ${
                                        response.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                        response.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                                    </div>
                                </div>

                                {response.status === 'approved' && (
                                    <div className="space-y-4">
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium mb-2">Prescribed Medicines:</h4>
                                            <div className="space-y-2">
                                                {response.medicines.map((medicine, index) => (
                                                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium">{medicine.name}</span>
                                                            {addedMedicinesFromResponses.includes(medicine.name) ? (
                                                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm">
                                                                    Added
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleAddToPrescriptions(medicine)}
                                                                    className="text-green-600 hover:text-green-800"
                                                                >
                                                                    Add to Prescriptions
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            <p>Dosage: {medicine.dosage}</p>
                                                            <p>Frequency: {medicine.frequency}</p>
                                                            <p>Duration: {medicine.duration}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {response.notes && (
                                            <div className="border-t pt-4">
                                                <h4 className="font-medium mb-2">Doctor's Notes:</h4>
                                                <p className="text-gray-600">{response.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {response.status === 'pending' && (
                                    <div className="text-center py-4">
                                        <p className="text-gray-600">Your prescription request is being reviewed by the doctor.</p>
                                        <p className="text-sm text-gray-500 mt-2">You will be notified once the prescription is ready.</p>
                                    </div>
                                )}
                            </div>
                        ))}

                        {prescriptionResponses.length === 0 && (
                            <div className="text-center py-8 bg-white rounded-2xl shadow-xl">
                                <p className="text-gray-600">No prescription responses yet.</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Request a prescription from a doctor to see responses here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewPrescriptions