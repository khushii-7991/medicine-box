import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiPlus, FiTrash2, FiCalendar, FiInfo } from 'react-icons/fi';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const AddPrescription = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showSchedulePreview, setShowSchedulePreview] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        patientId: '',
        duration: 7,
        notes: '',
        medicines: [
            {
                name: '',
                dosage: '',
                timings: ['09:00'],
                whenToTake: 'after_meal'
            }
        ]
    });

    // Preview schedule data
    const [schedulePreview, setSchedulePreview] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('doctorToken');
                if (!token) {
                    navigate('/login/doctor');
                    return;
                }

                const response = await fetch('http://localhost:3000/patient/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch patients');
                }

                const data = await response.json();
                setPatients(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError(err.message || 'Failed to load patients');
                setLoading(false);
            }
        };

        fetchPatients();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...formData.medicines];
        updatedMedicines[index][field] = value;
        setFormData({
            ...formData,
            medicines: updatedMedicines
        });
    };

    const handleTimingChange = (index, timingIndex, value) => {
        const updatedMedicines = [...formData.medicines];
        updatedMedicines[index].timings[timingIndex] = value;
        setFormData({
            ...formData,
            medicines: updatedMedicines
        });
    };

    const addTiming = (index) => {
        const updatedMedicines = [...formData.medicines];
        updatedMedicines[index].timings.push('12:00');
        setFormData({
            ...formData,
            medicines: updatedMedicines
        });
    };

    const removeTiming = (medicineIndex, timingIndex) => {
        const updatedMedicines = [...formData.medicines];
        updatedMedicines[medicineIndex].timings.splice(timingIndex, 1);
        setFormData({
            ...formData,
            medicines: updatedMedicines
        });
    };

    const addMedicine = () => {
        setFormData({
            ...formData,
            medicines: [
                ...formData.medicines,
                {
                    name: '',
                    dosage: '',
                    timings: ['09:00'],
                    whenToTake: 'after_meal'
                }
            ]
        });
    };

    const removeMedicine = (index) => {
        const updatedMedicines = [...formData.medicines];
        updatedMedicines.splice(index, 1);
        setFormData({
            ...formData,
            medicines: updatedMedicines
        });
    };

    // Generate schedule preview
    const generateSchedulePreview = () => {
        const preview = [];
        const today = new Date();
        
        for (let i = 0; i < formData.duration; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const medicines = formData.medicines.map(medicine => {
                return {
                    name: medicine.name || 'Medicine Name',
                    dosage: medicine.dosage || 'Dosage',
                    whenToTake: medicine.whenToTake,
                    doses: medicine.timings.map(time => {
                        return {
                            time,
                            status: 'pending'
                        };
                    })
                };
            });
            
            preview.push({
                date: formattedDate,
                medicines
            });
        }
        
        setSchedulePreview(preview);
        setShowSchedulePreview(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.patientId) {
            setError('Please select a patient');
            return;
        }
        
        if (formData.medicines.some(medicine => !medicine.name || !medicine.dosage || medicine.timings.length === 0)) {
            setError('Please fill in all medicine details');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            
            const token = localStorage.getItem('doctorToken');
            if (!token) {
                navigate('/login/doctor');
                return;
            }
            
            const response = await fetch('http://localhost:3000/prescription/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create prescription');
            }
            
            const data = await response.json();
            
            setSuccess('Prescription created successfully with medication schedule!');
            setLoading(false);
            
            // Reset form
            setFormData({
                patientId: '',
                duration: 7,
                notes: '',
                medicines: [
                    {
                        name: '',
                        dosage: '',
                        timings: ['09:00'],
                        whenToTake: 'after_meal'
                    }
                ]
            });
            
            // Redirect after a delay
            setTimeout(() => {
                navigate('/doctor');
            }, 2000);
            
        } catch (err) {
            console.error('Error creating prescription:', err);
            setError(err.message || 'Failed to create prescription');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
            <div className="max-w-4xl mx-auto py-10 px-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900">Create New Prescription</h1>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 bg-white text-cyan-800 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-cyan-200 hover:-translate-y-0.5"
                    >
                        <span>← Back</span>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md animate-pulse">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-md">
                        <p className="font-medium">{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-blue-100">
                    <div className="mb-6">
                        <label className="block font-semibold text-gray-800 mb-2 text-lg">Select Patient</label>
                        <select
                            name="patientId"
                            value={formData.patientId}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50 shadow-inner text-gray-700"
                            required
                        >
                            <option value="">-- Select a patient --</option>
                            {patients.map(patient => (
                                <option key={patient._id} value={patient._id}>
                                    {patient.name} ({patient.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="border-t border-b border-gray-100 py-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <span className="bg-cyan-100 text-cyan-700 p-2 rounded-full mr-2 shadow-sm">
                                    <FiPlus className="h-5 w-5" />
                                </span>
                                Prescribed Medicines
                            </h2>
                            <button
                                type="button"
                                onClick={generateSchedulePreview}
                                className="flex items-center gap-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-lg hover:bg-cyan-100 transition-colors duration-300 border border-cyan-200"
                            >
                                <FiCalendar className="h-5 w-5" />
                                <span>Preview Schedule</span>
                            </button>
                        </div>

                        {formData.medicines.map((medicine, index) => (
                            <div key={index} className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl shadow-md border border-blue-100 transform transition-all duration-300 hover:shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Medicine #{index + 1}</h3>
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMedicine(index)}
                                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors duration-300"
                                        >
                                            <FiTrash2 className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="transform transition-all duration-300 hover:scale-105">
                                        <label className="block font-medium text-gray-700 mb-1">Medicine Name</label>
                                        <input
                                            type="text"
                                            value={medicine.name}
                                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                            placeholder="Enter medicine name"
                                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
                                            required
                                        />
                                    </div>

                                    <div className="transform transition-all duration-300 hover:scale-105">
                                        <label className="block font-medium text-gray-700 mb-1">Dosage</label>
                                        <input
                                            type="text"
                                            value={medicine.dosage}
                                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                            placeholder="e.g., 500mg, 1 tablet"
                                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block font-medium text-gray-700 mb-2">When to Take</label>
                                    <div className="flex space-x-4">
                                        <label className="inline-flex items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="before_meal"
                                                checked={medicine.whenToTake === 'before_meal'}
                                                onChange={() => handleMedicineChange(index, 'whenToTake', 'before_meal')}
                                                className="form-radio h-4 w-4 text-cyan-600"
                                            />
                                            <span className="ml-2 text-gray-700">Before meal</span>
                                        </label>
                                        <label className="inline-flex items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="after_meal"
                                                checked={medicine.whenToTake === 'after_meal'}
                                                onChange={() => handleMedicineChange(index, 'whenToTake', 'after_meal')}
                                                className="form-radio h-4 w-4 text-cyan-600"
                                            />
                                            <span className="ml-2 text-gray-700">After meal</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block font-medium text-gray-700">Timings</label>
                                        <button
                                            type="button"
                                            onClick={() => addTiming(index)}
                                            className="text-cyan-600 hover:text-cyan-800 flex items-center bg-cyan-50 px-3 py-1 rounded-lg hover:bg-cyan-100 transition-colors duration-300"
                                        >
                                            <FiPlus className="mr-1 h-4 w-4" />
                                            Add Time
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {medicine.timings.map((timing, timingIndex) => (
                                            <div key={timingIndex} className="flex items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                                <div className="flex-grow flex items-center">
                                                    <FiClock className="text-gray-400 mr-2" />
                                                    <TimePicker
                                                        value={timing}
                                                        onChange={(value) => handleTimingChange(index, timingIndex, value)}
                                                        clearIcon={null}
                                                        clockIcon={null}
                                                        className="w-full"
                                                        disableClock={true}
                                                        format="HH:mm"
                                                    />
                                                </div>
                                                {medicine.timings.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTiming(index, timingIndex)}
                                                        className="ml-2 text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors duration-300"
                                                    >
                                                        <FiTrash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addMedicine}
                            className="w-full border-2 border-dashed border-cyan-500 text-cyan-600 font-medium py-3 rounded-xl hover:bg-cyan-50 transition-colors duration-300 flex items-center justify-center gap-2 group"
                        >
                            <span className="bg-cyan-100 text-cyan-700 p-1 rounded-full group-hover:bg-cyan-200 transition-colors duration-300">
                                <FiPlus className="h-5 w-5" />
                            </span>
                            Add Another Medicine
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="transform transition-all duration-300 hover:scale-105">
                            <label className="block font-medium text-gray-700 mb-2">Duration (in days)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                min="1"
                                max="90"
                                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gray-50"
                                required
                            />
                        </div>

                        <div className="transform transition-all duration-300 hover:scale-105">
                            <label className="block font-medium text-gray-700 mb-2">Notes (Optional)</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gray-50 h-24"
                                placeholder="Add any additional notes or instructions..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-700 to-blue-700 text-white font-medium py-4 rounded-xl hover:from-cyan-800 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Create Prescription
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Schedule Preview Modal */}
            {showSchedulePreview && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-blue-100">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900">
                                    Medication Schedule Preview
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setShowSchedulePreview(false)}
                                    className="text-gray-400 hover:text-gray-500 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl mb-6 flex items-start border border-blue-100 shadow-md">
                                <FiInfo className="text-cyan-600 mt-1 mr-3 flex-shrink-0 h-5 w-5" />
                                <p className="text-cyan-800">
                                    This is a preview of the medication schedule that will be created for your patient. 
                                    The patient will be able to track their medication and mark doses as taken or skipped.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {schedulePreview.slice(0, 3).map((day, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 border-b border-gray-200">
                                            <h3 className="text-md font-medium text-gray-700">
                                                {day.date}
                                            </h3>
                                        </div>
                                        <div className="p-4">
                                            {day.medicines.map((medicine, medIndex) => (
                                                <div key={medIndex} className="mb-4 last:mb-0 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">
                                                                {medicine.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {medicine.dosage} • {medicine.whenToTake === 'before_meal' ? 'Before meals' : 'After meals'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 mt-2 space-y-2">
                                                        {medicine.doses.map((dose, doseIndex) => (
                                                            <div key={doseIndex} className="flex items-center">
                                                                <FiClock className="text-cyan-400 mr-2" />
                                                                <span className="text-sm text-gray-700">
                                                                    {dose.time}
                                                                </span>
                                                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                                                    Pending
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {schedulePreview.length > 3 && (
                                    <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                                        <p className="text-gray-600">
                                            + {schedulePreview.length - 3} more days in the schedule
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowSchedulePreview(false)}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddPrescription;