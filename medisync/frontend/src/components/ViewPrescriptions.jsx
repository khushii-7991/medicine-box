import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'

const ViewPrescriptions = () => {
    const [symptoms, setSymptoms] = useState('');
    const [medicineRecommendations, setMedicineRecommendations] = useState([]);
    const [showMedicineRecommendations, setShowMedicineRecommendations] = useState(false);
    const [addedMedicines, setAddedMedicines] = useState([]);
    const [showRecommendationButton, setShowRecommendationButton] = useState(true);
    const [prescriptions, setPrescriptions] = useState([
        { medicine: 'Paracetamol', dosage: '2 Times a Day', timing: 'After Meal', duration: '5 Days' },
        { medicine: 'Vitamin C', dosage: 'Once a Day', timing: 'Before Meal', duration: '10 Days' }
    ]);
    const [addedToStreak, setAddedToStreak] = useState([]);

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
    

    const handleSymptomsSubmit = () => {
        const symptomsList = symptoms.toLowerCase().split(',').map(s => s.trim());
        const recommendations = [];

        // First check for combination symptoms
        const combinedSymptoms = symptomsList.join(' and ');
        if (medicineDatabase[combinedSymptoms]) {
            recommendations.push(...medicineDatabase[combinedSymptoms]);
        } else {
            // If no combination found, check individual symptoms
            symptomsList.forEach(symptom => {
                if (medicineDatabase[symptom]) {
                    recommendations.push(...medicineDatabase[symptom]);
                }
            });
        }

        setMedicineRecommendations(recommendations);
        setShowMedicineRecommendations(true);
        setShowRecommendationButton(false);
    };

    const handleAddToPrescription = (medicine) => {
        const newPrescription = {
            medicine: medicine.name,
            dosage: medicine.dosage,
            timing: medicine.timing,
            duration: medicine.duration
        };
        setPrescriptions([...prescriptions, newPrescription]);
        setAddedMedicines([...addedMedicines, medicine.name]);
    };

    const handleDeletePrescription = (index) => {
        const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
        setPrescriptions(updatedPrescriptions);
    };

    const handleAddToStreak = (medicine) => {
        // Get existing streak medicines from localStorage
        const existingStreakMedicines = JSON.parse(localStorage.getItem('streakMedicines') || '[]');
        
        // Check if medicine is already in streak
        if (!existingStreakMedicines.some(m => m.medicine === medicine.medicine)) {
            const medicineToAdd = {
                id: Date.now().toString(),
                name: medicine.medicine,
                dosage: medicine.dosage,
                frequency: medicine.timing,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
            
            // Add to streak medicines
            const updatedStreakMedicines = [...existingStreakMedicines, medicineToAdd];
            localStorage.setItem('streakMedicines', JSON.stringify(updatedStreakMedicines));
            setAddedToStreak([...addedToStreak, medicine.medicine]);
        }
    };

    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">
                <nav class="bg-green-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl font-bold">💊 View Prescriptions</h1>
                    <a href="/" class="text-sm hover:underline">Logout</a>
                </nav>

                <div class="max-w-7xl mx-auto py-10 px-5">
                    <div class="grid grid-cols-1 gap-8">
                        {/* Existing Prescriptions Table */}
                        <div>
                            <h2 class="text-3xl font-bold text-green-800 mb-6">Your Prescriptions</h2>
                            <div class="shadow-xl rounded-2xl overflow-x-auto">
                                <table class="w-full bg-white border-collapse">
                                    <thead class="bg-green-900 text-white">
                                        <tr>
                                            <th class="py-3 px-8 text-left w-1/4">Medicine</th>
                                            <th class="py-3 px-8 text-left w-1/4">Dosage</th>
                                            <th class="py-3 px-8 text-left w-1/4">Meal Timing</th>
                                            <th class="py-3 px-8 text-left w-1/4">Duration</th>
                                            <th class="py-3 px-8 text-left w-1/6">Actions</th>
                                            <th class="py-3 px-8 text-left w-1/6">Add to Streak</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prescriptions.map((prescription, index) => (
                                            <tr key={index} class="border-t">
                                                <td class="py-3 px-8">{prescription.medicine}</td>
                                                <td class="py-3 px-8">{prescription.dosage}</td>
                                                <td class="py-3 px-8">{prescription.timing}</td>
                                                <td class="py-3 px-8">{prescription.duration}</td>
                                                <td class="py-3 px-8">
                                                    <button
                                                        onClick={() => handleDeletePrescription(index)}
                                                        class="text-red-600 hover:text-red-800 transition-colors"
                                                        title="Delete prescription"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </td>
                                                <td class="py-3 px-8">
                                                    {addedToStreak.includes(prescription.medicine) ? (
                                                        <div class="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-center text-sm">
                                                            Added
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAddToStreak(prescription)}
                                                            class="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                                                        >
                                                            <FaPlus class="text-sm" />
                                                            Add
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {prescriptions.length === 0 && (
                                            <tr>
                                                <td colSpan="6" class="py-4 text-center text-gray-500">
                                                    No prescriptions added yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Symptoms and Medicine Recommendations */}
                        <div>
                            <h2 class="text-3xl font-bold text-green-800 mb-6">Medicine Recommendations</h2>
                            
                            <div class="space-y-4">
                                <div class="bg-white p-6 rounded-2xl shadow-xl">
                                    <label class="block font-semibold mb-2">Enter Your Symptoms</label>
                                    <textarea
                                        value={symptoms}
                                        onChange={(e) => setSymptoms(e.target.value)}
                                        placeholder="Enter your symptoms (comma separated). Example: fever, headache, cough"
                                        class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 h-32"
                                    />
                                    <div class="text-sm text-gray-600 mt-2">
                                        Please describe your symptoms in detail. Separate multiple symptoms with commas.
                                    </div>
                                    {showRecommendationButton && (
                                        <button
                                            onClick={handleSymptomsSubmit}
                                            class="w-full mt-4 bg-green-800 text-white py-3 rounded-xl text-lg hover:bg-green-900 transition"
                                        >
                                            Get Medicine Recommendations
                                        </button>
                                    )}
                                </div>

                                {showMedicineRecommendations && (
                                    <div class="space-y-4">
                                        {medicineRecommendations.length > 0 ? (
                                            <div class="space-y-4">
                                                {medicineRecommendations.map((medicine, index) => (
                                                    <div key={index} class="bg-white p-6 rounded-2xl shadow-xl">
                                                        <div class="flex items-center justify-between mb-2">
                                                            <h4 class="font-semibold text-lg">{medicine.name}</h4>
                                                            <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                {medicine.dosage}
                                                            </span>
                                                        </div>
                                                        
                                                        <div class="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <p class="text-gray-600">Timing:</p>
                                                                <p class="font-medium">{medicine.timing}</p>
                                                            </div>
                                                            <div>
                                                                <p class="text-gray-600">Duration:</p>
                                                                <p class="font-medium">{medicine.duration}</p>
                                                            </div>
                                                        </div>

                                                        <div class="mt-3">
                                                            <p class="text-sm text-gray-600">Side Effects:</p>
                                                            <p class="text-sm">{medicine.sideEffects}</p>
                                                        </div>

                                                        <div class="mt-3">
                                                            <p class="text-sm text-gray-600">Precautions:</p>
                                                            <p class="text-sm">{medicine.precautions}</p>
                                                        </div>

                                                        <div class="mt-4 text-sm text-gray-500">
                                                            Note: This is a general recommendation. Please consult your doctor before taking any medication.
                                                        </div>

                                                        {addedMedicines.includes(medicine.name) ? (
                                                            <div class="mt-4 bg-green-100 text-green-800 py-2 px-4 rounded-lg text-center">
                                                                Added to Prescription
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAddToPrescription(medicine)}
                                                                class="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                                            >
                                                                Add to Prescription
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div class="text-center py-4 bg-white rounded-2xl shadow-xl">
                                                <p class="text-gray-600">No specific medicine recommendations found for these symptoms.</p>
                                                <p class="text-sm text-gray-500 mt-2">
                                                    Please consult with the doctor for proper diagnosis and treatment.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewPrescriptions