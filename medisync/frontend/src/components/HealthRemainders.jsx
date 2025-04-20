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
    const [showAddReminder, setShowAddReminder] = useState(false);
    const [reminderTime, setReminderTime] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [reminderNotes, setReminderNotes] = useState('');
    const [showEditReminder, setShowEditReminder] = useState(false);
    const [editReminderId, setEditReminderId] = useState(null);
    const [editReminderTitle, setEditReminderTitle] = useState('');
    const [editReminderTime, setEditReminderTime] = useState('');
    const [editReminderDate, setEditReminderDate] = useState('');
    const [editReminderNotes, setEditReminderNotes] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
    const [addedToStreak, setAddedToStreak] = useState([]);

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
        const reminderTime = new Date(reminder.time);
        const timeDiff = now - reminderTime;
        return timeDiff > 15 * 60 * 1000; // 15 minutes in milliseconds
    };

    const isBeforeScheduledTime = (reminder) => {
        const now = new Date();
        const reminderTime = new Date(reminder.time);
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
        // Load prescriptions and reminders
        const savedPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
        const savedReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        
        // Filter out reminders for medicines that are no longer in prescriptions
        const validReminders = savedReminders.filter(reminder => 
            savedPrescriptions.some(p => p.medicine === reminder.medicine)
        );
        
        setPrescriptions(savedPrescriptions);
        setReminders(validReminders);
        localStorage.setItem('reminders', JSON.stringify(validReminders));

        // Load medicines from current prescriptions
        const allMedicines = savedPrescriptions.map(prescription => ({
            name: prescription.medicine,
            dosage: prescription.dosage,
            timing: prescription.timing,
            duration: prescription.duration
        }));
        setMedicines(allMedicines);

        // Add event listener for prescription changes
        const handlePrescriptionsChange = (event) => {
            const newPrescriptions = event.detail.prescriptions;
            setPrescriptions(newPrescriptions);
            
            // Update medicines list
            const updatedMedicines = newPrescriptions.map(prescription => ({
                name: prescription.medicine,
                dosage: prescription.dosage,
                timing: prescription.timing,
                duration: prescription.duration
            }));
            setMedicines(updatedMedicines);
            
            // Filter out reminders for deleted medicines
            const updatedReminders = reminders.filter(reminder => 
                newPrescriptions.some(p => p.medicine === reminder.medicine)
            );
            setReminders(updatedReminders);
            localStorage.setItem('reminders', JSON.stringify(updatedReminders));
        };

        window.addEventListener('prescriptionsChanged', handlePrescriptionsChange);

        // Cleanup
        return () => {
            window.removeEventListener('prescriptionsChanged', handlePrescriptionsChange);
        };
    }, []);

    useEffect(() => {
        // Load streak medicines from localStorage
        const existingStreakMedicines = JSON.parse(localStorage.getItem('streakMedicines') || '[]');
        setAddedToStreak(existingStreakMedicines.map(m => m.name));
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
        
        // Automatically set evening time 6 hours after morning time
        const newEveningTime = addSixHours(newMorningTime);
        setEveningTime(newEveningTime);
        
        // If medicine is 3 times a day, set afternoon time 6 hours after morning time
        const selectedMed = medicines.find(m => m.name === selectedMedicine);
        if (selectedMed?.dosage.includes('3 Times')) {
            const newAfternoonTime = addSixHours(newMorningTime);
            setAfternoonTime(newAfternoonTime);
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
            alert('Please fill in all required fields');
            return;
        }

        // Check if the selected medicine exists in prescriptions
        const medicineExists = prescriptions.some(p => p.medicine === selectedMedicine);
        if (!medicineExists) {
            alert('Please add this medicine to your prescriptions first');
            return;
        }

        const medicine = medicines.find(m => m.name === selectedMedicine);
        if (!medicine) {
            alert('Selected medicine not found');
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
                startDate: startDate,
                endDate: endDate,
                notes: reminderNotes
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
                startDate: startDate,
                endDate: endDate,
                notes: reminderNotes
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
                startDate: startDate,
                endDate: endDate,
                notes: reminderNotes
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
                startDate: startDate,
                endDate: endDate,
                notes: reminderNotes
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
                startDate: startDate,
                endDate: endDate,
                notes: reminderNotes
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
                startDate: startDate,
                endDate: endDate,
                notes: reminderNotes
            });
        }

        const updatedReminders = [...reminders, ...newReminders];
        setReminders(updatedReminders);
        localStorage.setItem('reminders', JSON.stringify(updatedReminders));

        setReminderTitle('');
        setSelectedMedicine('');
        setMorningTime('08:00');
        setEveningTime('20:00');
        setAfternoonTime('14:00');
        setStartDate('');
        setEndDate('');
        setReminderNotes('');
        setShowAddReminder(false);
    };

    const handleMarkAsCompleted = (reminderId) => {
        const updatedReminders = reminders.map(reminder => {
            if (reminder.id === reminderId) {
                const now = new Date();
                const reminderTime = new Date(reminder.date);
                const timeDiff = Math.abs(now - reminderTime) / (1000 * 60); // difference in minutes
                
                return {
                    ...reminder,
                    completed: true,
                    completedAt: now.toISOString(),
                    completedOnTime: timeDiff <= 30 // within 30 minutes of reminder time
                };
            }
            return reminder;
        });

        setReminders(updatedReminders);
        localStorage.setItem('reminders', JSON.stringify(updatedReminders));

        // Emit event to notify medicine tracking
        const event = new CustomEvent('remindersChanged', {
            detail: { reminderId, completed: true }
        });
        window.dispatchEvent(event);
    };

    const handleDeleteReminder = (id) => {
        const updatedReminders = reminders.filter(reminder => reminder.id !== id);
        setReminders(updatedReminders);
        localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    };

    const handleAddToStreak = (medicine) => {
        // Get existing streak medicines from localStorage
        const existingStreakMedicines = JSON.parse(localStorage.getItem('streakMedicines') || '[]');
        
        // Check if medicine is already in streak
        if (!existingStreakMedicines.some(m => m.name === medicine.name)) {
            const medicineToAdd = {
                id: Date.now().toString(),
                name: medicine.name,
                dosage: medicine.dosage,
                frequency: medicine.timing,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
            
            // Add to streak medicines
            const updatedStreakMedicines = [...existingStreakMedicines, medicineToAdd];
            localStorage.setItem('streakMedicines', JSON.stringify(updatedStreakMedicines));
            setAddedToStreak([...addedToStreak, medicine.name]);
        }
    };

    const filteredMedicines = medicines.filter(medicine => 
        medicine.name.toLowerCase().includes(medicineSearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Health Reminders</h1>
                    {prescriptions.length > 0 ? (
                        <button
                            onClick={() => setShowAddReminder(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            Add Reminder
                        </button>
                    ) : (
                        <div className="text-gray-500">
                            No prescribed medicines available
                        </div>
                    )}
                </div>

                {prescriptions.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-600">No prescribed medicines found.</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Please add medicines to your prescriptions first.
                        </p>
                    </div>
                ) : (
                    <>
                        {showAddReminder && (
                            <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-green-800">Add New Reminder</h3>
                                        <button 
                                            onClick={() => setShowAddReminder(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    
                                    <form onSubmit={handleAddReminder} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Medicine</label>
                                            <select
                                                value={selectedMedicine}
                                                onChange={(e) => setSelectedMedicine(e.target.value)}
                                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                required
                                            >
                                                <option value="">Select Medicine</option>
                                                {prescriptions.map((prescription, index) => (
                                                    <option key={index} value={prescription.medicine}>
                                                        {prescription.medicine} - {prescription.dosage}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Title</label>
                                            <input
                                                type="text"
                                                value={reminderTitle}
                                                onChange={(e) => setReminderTitle(e.target.value)}
                                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                placeholder="Enter reminder title"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {selectedMedicine && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Morning Time</label>
                                                    <input
                                                        type="time"
                                                        value={morningTime}
                                                        onChange={handleMorningTimeChange}
                                                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                        required
                                                    />
                                                </div>

                                                {medicines.find(m => m.name === selectedMedicine)?.dosage.includes('2 Times') && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Evening Time</label>
                                                        <input
                                                            type="time"
                                                            value={eveningTime}
                                                            readOnly
                                                            className="w-full border rounded-lg p-3 bg-gray-50"
                                                        />
                                                    </div>
                                                )}

                                                {medicines.find(m => m.name === selectedMedicine)?.dosage.includes('3 Times') && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Afternoon Time</label>
                                                            <input
                                                                type="time"
                                                                value={afternoonTime}
                                                                readOnly
                                                                className="w-full border rounded-lg p-3 bg-gray-50"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Evening Time</label>
                                                            <input
                                                                type="time"
                                                                value={eveningTime}
                                                                readOnly
                                                                className="w-full border rounded-lg p-3 bg-gray-50"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                            <textarea
                                                value={reminderNotes}
                                                onChange={(e) => setReminderNotes(e.target.value)}
                                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                rows="3"
                                                placeholder="Enter any additional notes..."
                                            />
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div>
                                                {selectedMedicine && !addedToStreak.includes(selectedMedicine) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddToStreak(medicines.find(m => m.name === selectedMedicine))}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                                    >
                                                        Add to Streak
                                                    </button>
                                                )}
                                                {selectedMedicine && addedToStreak.includes(selectedMedicine) && (
                                                    <span className="text-green-600">Added to Streak</span>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAddReminder(false)}
                                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                >
                                                    Add Reminder
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {reminders.length === 0 ? (
                                <div className="bg-white rounded-lg shadow p-6 text-center">
                                    <p className="text-gray-600">No reminders set yet.</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Click "Add Reminder" to create a new reminder for your prescribed medicines.
                                    </p>
                                </div>
                            ) : (
                                reminders.map(reminder => (
                                    <div
                                        key={reminder.id}
                                        className={`p-4 rounded-lg border ${
                                            reminder.completed
                                                ? reminder.status === 'late'
                                                    ? 'bg-red-50 border-red-200'
                                                    : 'bg-green-50 border-green-200'
                                                : isReminderMissed(reminder)
                                                    ? 'bg-red-50 border-red-200'
                                                    : 'bg-white border-gray-200'
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
                                                        {reminder.status === 'late' && ' (Late)'}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!reminder.completed && !isReminderMissed(reminder) && (
                                                    <button
                                                        onClick={() => handleMarkAsCompleted(reminder.id)}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                    >
                                                        Mark as Taken
                                                    </button>
                                                )}
                                                {isReminderMissed(reminder) && (
                                                    <span className="text-red-500">Missed</span>
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
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HealthRemainders;