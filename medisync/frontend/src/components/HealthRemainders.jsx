import React, { useState, useEffect } from 'react'
import MedicineTracking from './MedicineTracking';

const HealthRemainders = () => {
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
    const [medicineSearch, setMedicineSearch] = useState('');
    const [reminderTitle, setReminderTitle] = useState('');
    const [reminders, setReminders] = useState([]);
    const [selectedMedicineData, setSelectedMedicineData] = useState(null);
    const [morningTime, setMorningTime] = useState('08:00');
    const [eveningTime, setEveningTime] = useState('20:00');
    const [afternoonTime, setAfternoonTime] = useState('14:00');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [showTracking, setShowTracking] = useState(false);
    const [error, setError] = useState('');

    // Function to add 6 hours to a time string
    const addSixHours = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        let newHours = hours + 6;
        if (newHours >= 24) newHours -= 24;
        return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    // Function to check if a reminder is missed
    const isReminderMissed = (reminder) => {
        if (reminder.completed) return false;
        const now = new Date();
        const [hours, minutes] = reminder.time.split(':').map(Number);
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);
        
        const timeDiff = now - reminderTime;
        return timeDiff > 15 * 60 * 1000; // 15 minutes in milliseconds
    };

    const isBeforeScheduledTime = (reminder) => {
        const now = new Date();
        const [hours, minutes] = reminder.time.split(':').map(Number);
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);
        return now < reminderTime;
    };

    // Function to check if a reminder's duration has expired
    const isDurationExpired = (reminder) => {
        if (!reminder.endDate) return false;
        return new Date() > new Date(reminder.endDate);
    };

    // Function to calculate end date from duration
    const calculateEndDate = (startDate, duration) => {
        const start = new Date(startDate);
        const durationInDays = parseInt(duration);
        const end = new Date(start);
        end.setDate(start.getDate() + durationInDays);
        return end.toISOString().split('T')[0];
    };

    useEffect(() => {
        // Load medicines from prescriptions in localStorage
        const savedReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        setReminders(savedReminders);

        // Load prescriptions from localStorage
        let prescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
        
        // If no prescriptions exist, add some mock data
        if (prescriptions.length === 0) {
            prescriptions = [
                { medicine: 'Paracetamol', dosage: '2 Times a Day', timing: 'After Meal', duration: '5 Days' },
                { medicine: 'Vitamin C', dosage: 'Once a Day', timing: 'Before Meal', duration: '10 Days' },
                { medicine: 'Ibuprofen', dosage: '3 Times a Day', timing: 'After Meal', duration: '7 Days' }
            ];
            localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
        }

        const allMedicines = prescriptions.map(prescription => ({
            name: prescription.medicine,
            dosage: prescription.dosage,
            timing: prescription.timing,
            duration: prescription.duration
        }));
        setMedicines(allMedicines);

        // Check for missed reminders and expired durations every minute
        const interval = setInterval(() => {
            setReminders(prevReminders => {
                const updatedReminders = prevReminders
                    .filter(reminder => !isDurationExpired(reminder))
                    .map(reminder => {
                        if (!reminder.completed && isReminderMissed(reminder)) {
                            return { ...reminder, missed: true };
                        }
                        return reminder;
                    });
                localStorage.setItem('reminders', JSON.stringify(updatedReminders));
                return updatedReminders;
            });
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const handleMedicineSelect = (medicine) => {
        setSelectedMedicine(medicine.name);
        setSelectedMedicineData(medicine);
        setMedicineSearch('');
        setShowMedicineDropdown(false);
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        if (selectedMedicineData?.duration) {
            setEndDate(calculateEndDate(newStartDate, selectedMedicineData.duration));
        }
    };

    const handleMorningTimeChange = (e) => {
        const newMorningTime = e.target.value;
        setMorningTime(newMorningTime);
        if (selectedMedicineData?.dosage.includes('2 Times')) {
            setEveningTime(addSixHours(newMorningTime));
        }
    };

    const handleReminderComplete = (id) => {
        setReminders(prevReminders => {
            const updatedReminders = prevReminders.map(reminder => {
                if (reminder.id === id) {
                    if (isBeforeScheduledTime(reminder)) {
                        alert('Cannot mark medicine as taken before scheduled time');
                        return reminder;
                    }

                    const now = new Date();
                    const [hours, minutes] = reminder.time.split(':').map(Number);
                    const reminderTime = new Date();
                    reminderTime.setHours(hours, minutes, 0, 0);
                    
                    const timeDiff = now - reminderTime;
                    const isOnTime = timeDiff <= 15 * 60 * 1000; // 15 minutes in milliseconds
                    
                    return { 
                        ...reminder, 
                        completed: true, 
                        missed: false,
                        status: isOnTime ? 'taken_on_time' : 'taken_late',
                        lastCompleted: new Date().toISOString()
                    };
                }
                return reminder;
            });
            localStorage.setItem('reminders', JSON.stringify(updatedReminders));
            return updatedReminders;
        });
    };

    const handleAddReminder = (e) => {
        e.preventDefault();
        
        if (!reminderTitle || !selectedMedicine) {
            setError('Please fill in all required fields');
            return;
        }

        const medicine = medicines.find(m => m.name === selectedMedicine);
        if (!medicine) {
            setError('Selected medicine not found');
            return;
        }

        const newReminders = [];
        const currentDate = new Date();

        if (medicine.dosage.includes('2 Times')) {
            // Create morning reminder
            const [morningHours, morningMinutes] = morningTime.split(':').map(Number);
            const morningReminderTime = new Date(currentDate);
            morningReminderTime.setHours(morningHours, morningMinutes, 0, 0);

            newReminders.push({
                id: Date.now(),
                title: `${reminderTitle} (Morning)`,
                time: morningReminderTime.toISOString(),
                medicine: selectedMedicine,
                completed: false,
                prescriptionId: selectedPrescription?.id,
                startDate: startDate,
                endDate: endDate
            });

            // Create evening reminder
            const [eveningHours, eveningMinutes] = eveningTime.split(':').map(Number);
            const eveningReminderTime = new Date(currentDate);
            eveningReminderTime.setHours(eveningHours, eveningMinutes, 0, 0);

            newReminders.push({
                id: Date.now() + 1,
                title: `${reminderTitle} (Evening)`,
                time: eveningReminderTime.toISOString(),
                medicine: selectedMedicine,
                completed: false,
                prescriptionId: selectedPrescription?.id,
                startDate: startDate,
                endDate: endDate
            });
        } else if (medicine.dosage.includes('3 Times')) {
            // Create morning reminder
            const [morningHours, morningMinutes] = morningTime.split(':').map(Number);
            const morningReminderTime = new Date(currentDate);
            morningReminderTime.setHours(morningHours, morningMinutes, 0, 0);

            newReminders.push({
                id: Date.now(),
                title: `${reminderTitle} (Morning)`,
                time: morningReminderTime.toISOString(),
                medicine: selectedMedicine,
                completed: false,
                prescriptionId: selectedPrescription?.id,
                startDate: startDate,
                endDate: endDate
            });

            // Create afternoon reminder
            const [afternoonHours, afternoonMinutes] = afternoonTime.split(':').map(Number);
            const afternoonReminderTime = new Date(currentDate);
            afternoonReminderTime.setHours(afternoonHours, afternoonMinutes, 0, 0);

            newReminders.push({
                id: Date.now() + 1,
                title: `${reminderTitle} (Afternoon)`,
                time: afternoonReminderTime.toISOString(),
                medicine: selectedMedicine,
                completed: false,
                prescriptionId: selectedPrescription?.id,
                startDate: startDate,
                endDate: endDate
            });

            // Create evening reminder
            const [eveningHours, eveningMinutes] = eveningTime.split(':').map(Number);
            const eveningReminderTime = new Date(currentDate);
            eveningReminderTime.setHours(eveningHours, eveningMinutes, 0, 0);

            newReminders.push({
                id: Date.now() + 2,
                title: `${reminderTitle} (Evening)`,
                time: eveningReminderTime.toISOString(),
                medicine: selectedMedicine,
                completed: false,
                prescriptionId: selectedPrescription?.id,
                startDate: startDate,
                endDate: endDate
            });
        } else {
            // Create single reminder
            const [hours, minutes] = morningTime.split(':').map(Number);
            const reminderTime = new Date(currentDate);
            reminderTime.setHours(hours, minutes, 0, 0);

            newReminders.push({
                id: Date.now(),
                title: reminderTitle,
                time: reminderTime.toISOString(),
                medicine: selectedMedicine,
                completed: false,
                prescriptionId: selectedPrescription?.id,
                startDate: startDate,
                endDate: endDate
            });
        }

        // Save to localStorage
        const existingReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        localStorage.setItem('reminders', JSON.stringify([...existingReminders, ...newReminders]));

        // Update state
        setReminders([...reminders, ...newReminders]);
        setReminderTitle('');
        setSelectedMedicine('');
        setMorningTime('08:00');
        setEveningTime('20:00');
        setAfternoonTime('14:00');
        setSelectedPrescription(null);
        setError('');
    };

    const handleMarkAsCompleted = (reminderId) => {
        const updatedReminders = reminders.map(reminder => {
            if (reminder.id === reminderId) {
                const now = new Date();
                const reminderTime = new Date(reminder.time);
                const timeDiff = now - reminderTime;
                const isOnTime = timeDiff <= 15 * 60 * 1000; // 15 minutes in milliseconds
                
                return { 
                    ...reminder, 
                    completed: true,
                    completedAt: now.toISOString(),
                    status: isOnTime ? 'taken_on_time' : 'taken_late'
                };
            }
            return reminder;
        });

        // Save to localStorage
        localStorage.setItem('reminders', JSON.stringify(updatedReminders));

        // Update state
        setReminders(updatedReminders);

        // Update medicine tracking streak
        const medicineTracking = JSON.parse(localStorage.getItem('medicineTracking') || '{}');
        const today = new Date().toISOString().split('T')[0];
        
        if (!medicineTracking[today]) {
            medicineTracking[today] = {
                completed: true,
                medicines: []
            };
        }

        const completedReminder = updatedReminders.find(r => r.id === reminderId);
        if (completedReminder) {
            medicineTracking[today].medicines.push({
                name: completedReminder.medicine,
                status: completedReminder.status
            });
        }

        localStorage.setItem('medicineTracking', JSON.stringify(medicineTracking));
    };

    const handleDeleteReminder = (id) => {
        const updatedReminders = reminders.filter(reminder => reminder.id !== id);
        setReminders(updatedReminders);
        localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    };

    const filteredMedicines = medicines.filter(medicine => 
        medicine.name.toLowerCase().includes(medicineSearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Health Reminders</h1>

                {/* Add Reminder Form */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Set a New Reminder</h2>
                    <form onSubmit={handleAddReminder} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 mb-2">Reminder Title</label>
                            <input 
                                type="text" 
                                value={reminderTitle}
                                onChange={(e) => setReminderTitle(e.target.value)}
                                className="w-full border rounded-lg p-3" 
                                placeholder="e.g. Take Medicine" 
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-gray-700 mb-2">Select Medicine (Optional)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={selectedMedicine || medicineSearch}
                                    placeholder="Search medicine..."
                                    onClick={() => setShowMedicineDropdown(true)}
                                    onChange={(e) => {
                                        setMedicineSearch(e.target.value);
                                        setShowMedicineDropdown(true);
                                    }}
                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
                                />
                                {showMedicineDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                        <div className="max-h-60 overflow-y-auto">
                                            {filteredMedicines.map((medicine) => (
                                                <div
                                                    key={medicine.name}
                                                    onClick={() => handleMedicineSelect(medicine)}
                                                    className="p-3 hover:bg-green-50 cursor-pointer"
                                                >
                                                    <div className="font-medium">{medicine.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {medicine.dosage} • {medicine.timing} • {medicine.duration}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedMedicineData && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Start Date</label>
                                        <input 
                                            type="date" 
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            className="w-full border rounded-lg p-3" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">End Date</label>
                                        <input 
                                            type="date" 
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full border rounded-lg p-3" 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Morning Time</label>
                                        <input 
                                            type="time" 
                                            value={morningTime}
                                            onChange={handleMorningTimeChange}
                                            className="w-full border rounded-lg p-3" 
                                        />
                                    </div>
                                    {selectedMedicineData.dosage.includes('2 Times') && (
                                        <div>
                                            <label className="block text-gray-700 mb-2">Evening Time</label>
                                            <input 
                                                type="time" 
                                                value={eveningTime}
                                                onChange={(e) => setEveningTime(e.target.value)}
                                                className="w-full border rounded-lg p-3" 
                                            />
                                        </div>
                                    )}
                                    {selectedMedicineData.dosage.includes('3 Times') && (
                                        <>
                                            <div>
                                                <label className="block text-gray-700 mb-2">Afternoon Time</label>
                                                <input 
                                                    type="time" 
                                                    value={afternoonTime}
                                                    onChange={(e) => setAfternoonTime(e.target.value)}
                                                    className="w-full border rounded-lg p-3" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-2">Evening Time</label>
                                                <input 
                                                    type="time" 
                                                    value={eveningTime}
                                                    onChange={(e) => setEveningTime(e.target.value)}
                                                    className="w-full border rounded-lg p-3" 
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit"
                            className="w-full bg-green-900 text-white py-3 rounded-xl hover:bg-green-800"
                        >
                            Add Reminder
                        </button>
                    </form>
                </div>

                {/* Tracking Dashboard */}
                {selectedPrescription && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Medicine Tracking</h2>
                            <button
                                onClick={() => setShowTracking(!showTracking)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                {showTracking ? 'Hide Tracking' : 'Show Tracking'}
                            </button>
                        </div>
                        {showTracking && <MedicineTracking prescriptionId={selectedPrescription.id} />}
                    </div>
                )}

                {/* Reminders List */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Reminders</h2>
                    {reminders.length === 0 ? (
                        <p className="text-gray-500">No reminders set yet</p>
                    ) : (
                        <div className="space-y-4">
                            {reminders.map(reminder => (
                                <div
                                    key={reminder.id}
                                    className={`p-4 rounded-lg border ${
                                        reminder.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium">{reminder.title}</h3>
                                            <p className="text-gray-600">
                                                {new Date(reminder.time).toLocaleTimeString()} - {reminder.medicine}
                                            </p>
                                            {reminder.completed && (
                                                <p className="text-sm text-gray-500">
                                                    Completed at: {new Date(reminder.completedAt).toLocaleTimeString()}
                                                    {reminder.status === 'taken_late' && ' (Late)'}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!reminder.completed && (
                                                <button
                                                    onClick={() => handleMarkAsCompleted(reminder.id)}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                >
                                                    Mark as Taken
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteReminder(reminder.id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HealthRemainders;