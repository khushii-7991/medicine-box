import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';

const ViewPrescription = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [streakMedicines, setStreakMedicines] = useState([]);
    const [showManualForm, setShowManualForm] = useState(false);
    const [newMedicine, setNewMedicine] = useState({
        name: '',
        dosage: '',
        frequency: 'Once a Day',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get prescriptions from localStorage
                const storedPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
                setPrescriptions(storedPrescriptions);

                // Get medicines in streak tracking
                const storedStreakMedicines = JSON.parse(localStorage.getItem('streakMedicines') || '[]');
                setStreakMedicines(storedStreakMedicines);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load prescriptions');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddToStreak = (medicine) => {
        if (!streakMedicines.some(m => m.id === medicine.id)) {
            const updatedStreakMedicines = [...streakMedicines, medicine];
            setStreakMedicines(updatedStreakMedicines);
            localStorage.setItem('streakMedicines', JSON.stringify(updatedStreakMedicines));
        }
    };

    const handleRemoveFromStreak = (medicineId) => {
        const updatedStreakMedicines = streakMedicines.filter(m => m.id !== medicineId);
        setStreakMedicines(updatedStreakMedicines);
        localStorage.setItem('streakMedicines', JSON.stringify(updatedStreakMedicines));
    };

    const handleAddManualMedicine = () => {
        if (!newMedicine.name.trim()) return;

        const medicineToAdd = {
            ...newMedicine,
            id: Date.now().toString()
        };

        // Add to streak medicines
        handleAddToStreak(medicineToAdd);

        // Reset form
        setNewMedicine({
            name: '',
            dosage: '',
            frequency: 'Once a Day',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

        setShowManualForm(false);
    };

    const isInStreak = (medicineId) => {
        return streakMedicines.some(m => m.id === medicineId);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Prescriptions</h2>
                {!showManualForm ? (
                    <button
                        onClick={() => setShowManualForm(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                    >
                        <FaPlus /> Add Medicine Manually
                    </button>
                ) : (
                    <button
                        onClick={() => setShowManualForm(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                    >
                        <FaArrowLeft /> Back to Prescriptions
                    </button>
                )}
            </div>

            {showManualForm ? (
                <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-semibold mb-4">Add New Medicine</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Medicine Name
                            </label>
                            <input
                                type="text"
                                value={newMedicine.name}
                                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                                className="w-full p-2 border rounded"
                                placeholder="Enter medicine name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dosage
                            </label>
                            <input
                                type="text"
                                value={newMedicine.dosage}
                                onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                                className="w-full p-2 border rounded"
                                placeholder="Enter dosage"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Frequency
                            </label>
                            <select
                                value={newMedicine.frequency}
                                onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                                className="w-full p-2 border rounded"
                            >
                                <option value="Once a Day">Once a Day</option>
                                <option value="2 Times a Day">2 Times a Day</option>
                                <option value="3 Times a Day">3 Times a Day</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={newMedicine.startDate}
                                onChange={(e) => setNewMedicine({ ...newMedicine, startDate: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={newMedicine.endDate}
                                onChange={(e) => setNewMedicine({ ...newMedicine, endDate: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <button
                            onClick={handleAddManualMedicine}
                            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Add to Streak Tracking
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {prescriptions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">No prescriptions found</p>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                Add New Prescription
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {prescriptions.map(prescription => (
                                <div key={prescription.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">{prescription.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date(prescription.startDate).toLocaleDateString()} - 
                                                {new Date(prescription.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-blue-500 hover:text-blue-600">
                                                Edit
                                            </button>
                                            <button className="text-red-500 hover:text-red-600">
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {prescription.medicines?.map(medicine => (
                                            <div
                                                key={medicine.id}
                                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                            >
                                                <div>
                                                    <p className="font-medium">{medicine.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {medicine.dosage} - {medicine.frequency}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isInStreak(medicine.id) ? (
                                                        <button
                                                            onClick={() => handleRemoveFromStreak(medicine.id)}
                                                            className="flex items-center gap-2 text-red-500 hover:text-red-600"
                                                        >
                                                            <FaTimes /> Remove from Streak
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAddToStreak(medicine)}
                                                            className="flex items-center gap-2 text-green-500 hover:text-green-600"
                                                        >
                                                            <FaCheck /> Add to Streak
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Medicines in Streak Tracking</h3>
                        {streakMedicines.length === 0 ? (
                            <p className="text-gray-600">No medicines added to streak tracking</p>
                        ) : (
                            <div className="space-y-2">
                                {streakMedicines.map(medicine => (
                                    <div
                                        key={medicine.id}
                                        className="flex items-center justify-between p-2 bg-green-50 rounded"
                                    >
                                        <div>
                                            <p className="font-medium">{medicine.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {medicine.dosage} - {medicine.frequency}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFromStreak(medicine.id)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewPrescription; 