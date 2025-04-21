import React, { useState, useEffect } from 'react'
import { FaPlus, FaCheck, FaTimes, FaClock } from 'react-icons/fa'
import MedicineTracking from './MedicineTracking';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
    const [manualDosage, setManualDosage] = useState('');
    const [morningDosage, setMorningDosage] = useState('');
    const [eveningDosage, setEveningDosage] = useState('');
    const [afternoonDosage, setAfternoonDosage] = useState('');
    const [reminderType, setReminderType] = useState('prescription');
    const [frequency, setFrequency] = useState('once');
    const [customMorningTime, setCustomMorningTime] = useState('08:00');
    const [customAfternoonTime, setCustomAfternoonTime] = useState('14:00');
    const [customEveningTime, setCustomEveningTime] = useState('20:00');
    const [prescriptionMedicines, setPrescriptionMedicines] = useState([]);
    const [prescriptionMorningTime, setPrescriptionMorningTime] = useState('08:00');
    const [prescriptionAfternoonTime, setPrescriptionAfternoonTime] = useState('14:00');
    const [prescriptionEveningTime, setPrescriptionEveningTime] = useState('20:00');
    const [duration, setDuration] = useState('7');
    const navigate = useNavigate();

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
        const endDate = new Date(reminder.endDate);
        const currentDate = new Date();
        return currentDate > endDate;
    };

    // Function to calculate end date from duration
    const calculateEndDate = (startDate, duration) => {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + parseInt(duration));
        return endDate.toISOString();
    };

    // Function to check if all dosages are completed for a medicine
    const areAllDosagesCompleted = (medicineName) => {
        const medicineReminders = reminders.filter(r => r.medicineName === medicineName);
        return medicineReminders.length > 0 && medicineReminders.every(r => r.completed);
    };

    // Function to check and delete completed reminders
    const checkAndDeleteCompletedReminders = () => {
        const medicines = [...new Set(reminders.map(r => r.medicineName))];
        const updatedReminders = reminders.filter(reminder => {
            // Keep the reminder if not all dosages are completed
            return !areAllDosagesCompleted(reminder.medicineName);
        });

        if (updatedReminders.length !== reminders.length) {
            setReminders(updatedReminders);
            localStorage.setItem('reminders', JSON.stringify(updatedReminders));
            console.log('Completed reminders have been deleted');
        }
    };

    // Set up interval to check for completed reminders
    useEffect(() => {
        // Check immediately when component mounts
        checkAndDeleteCompletedReminders();

        // Set up interval to check every minute
        const intervalId = setInterval(checkAndDeleteCompletedReminders, 60 * 1000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [reminders]);

    useEffect(() => {
        // Load prescriptions and reminders
        const savedPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
        const savedReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        
        // Set default prescriptions if none exist
        if (savedPrescriptions.length === 0) {
            const defaultPrescriptions = [
                { medicine: 'Paracetamol', dosage: '2 Times a Day', timing: 'After Meal', duration: '5 Days' },
                { medicine: 'Vitamin C', dosage: 'Once a Day', timing: 'Before Meal', duration: '10 Days' }
            ];
            setPrescriptions(defaultPrescriptions);
            localStorage.setItem('prescriptions', JSON.stringify(defaultPrescriptions));
        } else {
            setPrescriptions(savedPrescriptions);
        }
        
        // Filter out reminders for medicines that are no longer in prescriptions
        const validReminders = savedReminders.filter(reminder => 
            savedPrescriptions.some(p => p.medicine === reminder.medicine)
        );
        
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

    // Add useEffect to load prescription medicines
    useEffect(() => {
        // Load prescription medicines from localStorage
        const savedPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
        setPrescriptionMedicines(savedPrescriptions);
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

    const createRemindersForDate = (date, medicineDetails, timing, customTime = null) => {
        const [hours, minutes] = (customTime || timing === 'morning' ? morningTime : 
                                 timing === 'afternoon' ? afternoonTime : eveningTime).split(':').map(Number);
        const reminderDateTime = new Date(date);
        reminderDateTime.setHours(hours, minutes, 0, 0);

        return {
            id: Date.now() + Math.random(),
            title: selectedMedicine,
            date: reminderDateTime.toISOString(),
            medicine: selectedMedicine,
            timing: timing,
            customTime: customTime,
            dosage: medicineDetails.dosage || dosage,
            completed: false,
            endDate: calculateEndDate(date, medicineDetails.duration || duration)
        };
    };

    const handleAddReminder = (e) => {
        e.preventDefault();
        
        // Only check for medicine selection if it's a prescription type
        if (reminderType === 'prescription' && !selectedMedicine) {
            toast.error('Please select a medicine');
            return;
        }

        // For manual entry, check if title is provided
        if (reminderType === 'manual' && !reminderTitle) {
            toast.error('Please enter a medicine name');
            return;
        }

        const newReminders = [];
        const currentDate = new Date();

        // Get medicine details based on type
        let medicineDetails;
        if (reminderType === 'prescription') {
            medicineDetails = prescriptions.find(p => p.medicine === selectedMedicine);
            if (!medicineDetails) {
                toast.error('Selected medicine not found in prescriptions');
                return;
            }
        } else {
            // For manual entry, create basic medicine details
            medicineDetails = {
                medicine: reminderTitle,
                dosage: manualDosage || '1 tablet', // Default dosage if not provided
                duration: '7' // Default duration
            };
        }

        // Calculate end date
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 7); // Default 7 days duration

        // Create reminders for each day until end date
        let currentDay = new Date(currentDate);
        while (currentDay <= endDate) {
            if (frequency === 'once') {
                newReminders.push(createRemindersForDate(new Date(currentDay), medicineDetails, 'morning'));
            } else if (frequency === 'twice') {
                newReminders.push(createRemindersForDate(new Date(currentDay), medicineDetails, 'morning'));
                newReminders.push(createRemindersForDate(new Date(currentDay), medicineDetails, 'evening'));
            } else if (frequency === 'thrice') {
                newReminders.push(createRemindersForDate(new Date(currentDay), medicineDetails, 'morning'));
                newReminders.push(createRemindersForDate(new Date(currentDay), medicineDetails, 'afternoon'));
                newReminders.push(createRemindersForDate(new Date(currentDay), medicineDetails, 'evening'));
            } else if (frequency === 'custom') {
                if (morningTime) {
                    newReminders.push(createRemindersForDate(new Date(currentDay), medicineDetails, 'morning', morningTime));
                }
                if (afternoonTime) {
                    newReminders.push(createRemindersForDate(new Date(currentDay), medicineDetails, 'afternoon', afternoonTime));
                }
                if (eveningTime) {
                    newReminders.push(createRemindersForDate(new Date(currentDay), medicineDetails, 'evening', eveningTime));
                }
            }
            currentDay.setDate(currentDay.getDate() + 1);
        }

        if (newReminders.length > 0) {
            const updatedReminders = [...reminders, ...newReminders];
            setReminders(updatedReminders);
            localStorage.setItem('reminders', JSON.stringify(updatedReminders));
            toast.success('Reminder(s) added successfully');
            
            // Reset form fields
            setSelectedMedicine('');
            setFrequency('once');
            setDosage('');
            setMorningTime('');
            setAfternoonTime('');
            setEveningTime('');
            setReminderTitle('');
            setManualDosage('');
            setShowAddReminder(false);

            // Navigate to reminders list page
            setTimeout(() => {
                navigate('/reminders');
            }, 500);
        } else {
            toast.error('Please select at least one time for the reminder');
        }
    };

    // Update the canMarkAsTaken function
    const canMarkAsTaken = (scheduledTime) => {
        try {
            const now = new Date();
            const scheduled = new Date(scheduledTime);
            
            if (isNaN(scheduled.getTime())) {
                console.error('Invalid scheduled time:', scheduledTime);
                return false;
            }

            // Compare only hours and minutes
            const nowHours = now.getHours();
            const nowMinutes = now.getMinutes();
            const scheduledHours = scheduled.getHours();
            const scheduledMinutes = scheduled.getMinutes();
            
            // Convert to total minutes for comparison
            const nowTotalMinutes = nowHours * 60 + nowMinutes;
            const scheduledTotalMinutes = scheduledHours * 60 + scheduledMinutes;
            
            // Calculate difference in minutes
            const diffMinutes = nowTotalMinutes - scheduledTotalMinutes;
            
            // Enable if current time is within 15 minutes after scheduled time
            return diffMinutes >= 0 && diffMinutes <= 15;
        } catch (error) {
            console.error('Error in canMarkAsTaken:', error);
            return false;
        }
    };

    // Update the getTimeDifferenceMessage function
    const getTimeDifferenceMessage = (scheduledTime) => {
        try {
            const now = new Date();
            const scheduled = new Date(scheduledTime);
            
            if (isNaN(scheduled.getTime())) {
                console.error('Invalid scheduled time:', scheduledTime);
                return 'Invalid time';
            }

            // Compare only hours and minutes
            const nowHours = now.getHours();
            const nowMinutes = now.getMinutes();
            const scheduledHours = scheduled.getHours();
            const scheduledMinutes = scheduled.getMinutes();
            
            // Convert to total minutes for comparison
            const nowTotalMinutes = nowHours * 60 + nowMinutes;
            const scheduledTotalMinutes = scheduledHours * 60 + scheduledMinutes;
            
            // Calculate difference in minutes
            const diffMinutes = scheduledTotalMinutes - nowTotalMinutes;
            
            if (diffMinutes <= 0) {
                const minutesPassed = Math.abs(diffMinutes);
                if (minutesPassed > 15) {
                    return 'Time window expired';
                }
                return null;
            }
            
            const hours = Math.floor(diffMinutes / 60);
            const minutes = diffMinutes % 60;
            
            return `Available in ${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
        } catch (error) {
            console.error('Error in getTimeDifferenceMessage:', error);
            return 'Invalid time';
        }
    };

    // Update the handleReminderComplete function
    const handleReminderComplete = (reminderId) => {
        const updatedReminders = reminders.map(reminder => {
            if (reminder.id === reminderId) {
                const now = new Date();
                const scheduled = new Date(reminder.date);
                
                // Compare only hours and minutes
                const nowHours = now.getHours();
                const nowMinutes = now.getMinutes();
                const scheduledHours = scheduled.getHours();
                const scheduledMinutes = scheduled.getMinutes();
                
                // Convert to total minutes for comparison
                const nowTotalMinutes = nowHours * 60 + nowMinutes;
                const scheduledTotalMinutes = scheduledHours * 60 + scheduledMinutes;
                
                // Calculate difference in minutes
                const diffMinutes = nowTotalMinutes - scheduledTotalMinutes;
                
                // Check if current time is within the 15-minute window
                if (diffMinutes < 0 || diffMinutes > 15) {
                    alert('You can only mark this medicine as taken within 15 minutes of its scheduled time.');
                    return reminder;
                }

                return {
                    ...reminder,
                    completed: true,
                    completedAt: new Date().toISOString(),
                    status: diffMinutes <= 15 ? 'completed' : 'late'
                };
            }
            return reminder;
        });

        setReminders(updatedReminders);
        localStorage.setItem('reminders', JSON.stringify(updatedReminders));

        // Emit event to notify medicine tracking
        const event = new CustomEvent('remindersChanged', {
            detail: { reminders: updatedReminders }
        });
        window.dispatchEvent(event);
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

    // Update the reminder rendering to show completion status and manual dosage
    const renderReminderStatus = (reminder) => {
        const medicineReminders = reminders.filter(r => r.medicineName === reminder.medicineName);
        const completedCount = medicineReminders.filter(r => r.completed).length;
        const totalCount = medicineReminders.length;

        return (
            <div className="text-sm text-gray-600">
                {reminder.dosage && (
                    <p>Dosage: {reminder.dosage}</p>
                )}
                {totalCount > 1 && (
                    <p>{completedCount}/{totalCount} dosages completed</p>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Health Reminders</h1>
                    <button
                        onClick={() => setShowAddReminder(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                        <FaPlus className="text-sm" />
                        Add Reminder
                    </button>
                </div>

                {/* View Reminders Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Reminders</h2>
                    
                    {reminders.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No reminders set yet.</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Click "Add Reminder" to create a new reminder for your medicines.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reminders.slice(0, 5).map(reminder => {
                                const canMark = canMarkAsTaken(reminder.date);
                                const timeMessage = getTimeDifferenceMessage(reminder.date);
                                const isExpired = timeMessage === 'Time window expired';
                                
                                return (
                                    <div
                                        key={reminder.id}
                                        className={`p-4 rounded-lg border ${
                                            reminder.completed
                                                ? 'bg-green-50 border-green-200'
                                                : isExpired
                                                    ? 'bg-red-50 border-red-200'
                                                    : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-medium">{reminder.medicine}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Time: {new Date(reminder.date).toLocaleTimeString()}
                                                </p>
                                                {reminder.completed && (
                                                    <p className="text-sm text-gray-600">
                                                        Taken at: {new Date(reminder.completedAt).toLocaleTimeString()}
                                                    </p>
                                                )}
                                                {!canMark && timeMessage && (
                                                    <p className={`text-sm mt-1 ${
                                                        isExpired ? 'text-red-600' : 'text-yellow-600'
                                                    }`}>
                                                        {timeMessage}
                                                    </p>
                                                )}
                                                {renderReminderStatus(reminder)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleReminderComplete(reminder.id)}
                                                    disabled={!canMark || reminder.completed || isExpired}
                                                    className={`p-2 rounded-full ${
                                                        !canMark || reminder.completed || isExpired
                                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                            : 'bg-green-500 text-white hover:bg-green-600'
                                                    }`}
                                                    title={
                                                        isExpired 
                                                            ? "Time window expired" 
                                                            : !canMark 
                                                            ? "Cannot mark as taken before scheduled time" 
                                                            : "Mark as taken"
                                                    }
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReminder(reminder.id)}
                                                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                                                    title="Delete reminder"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {showAddReminder && (
                    <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-gray-200 flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-green-800">Add New Reminder</h3>
                                <button 
                                    onClick={() => setShowAddReminder(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="overflow-y-auto p-6">
                                <form onSubmit={handleAddReminder} className="space-y-4">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Type</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="prescription"
                                                    checked={reminderType === 'prescription'}
                                                    onChange={(e) => setReminderType(e.target.value)}
                                                    className="mr-2"
                                                />
                                                From Prescription
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    value="manual"
                                                    checked={reminderType === 'manual'}
                                                    onChange={(e) => setReminderType(e.target.value)}
                                                    className="mr-2"
                                                />
                                                Manual Entry
                                            </label>
                                        </div>
                                    </div>

                                    {reminderType === 'manual' && (
                                        <>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
                                                <input
                                                    type="text"
                                                    value={reminderTitle}
                                                    onChange={(e) => setReminderTitle(e.target.value)}
                                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                    placeholder="Enter medicine name"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                                                <input
                                                    type="text"
                                                    value={manualDosage}
                                                    onChange={(e) => setManualDosage(e.target.value)}
                                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                    placeholder="e.g., 1 tablet, 2 capsules"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                                                <select
                                                    value={frequency}
                                                    onChange={(e) => setFrequency(e.target.value)}
                                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                    required
                                                >
                                                    <option value="once">Once a Day</option>
                                                    <option value="twice">Twice a Day</option>
                                                    <option value="thrice">Three Times a Day</option>
                                                    <option value="custom">Custom Times</option>
                                                </select>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Morning Time</label>
                                                    <input
                                                        type="time"
                                                        value={morningTime}
                                                        onChange={(e) => setMorningTime(e.target.value)}
                                                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Evening Time</label>
                                                    <input
                                                        type="time"
                                                        value={eveningTime}
                                                        onChange={(e) => setEveningTime(e.target.value)}
                                                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                        required
                                                    />
                                                </div>
                                                {frequency === 'thrice' && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Afternoon Time</label>
                                                        <input
                                                            type="time"
                                                            value={afternoonTime}
                                                            onChange={(e) => setAfternoonTime(e.target.value)}
                                                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                            required
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {reminderType === 'prescription' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Medicine</label>
                                            <select
                                                value={selectedMedicine}
                                                onChange={(e) => setSelectedMedicine(e.target.value)}
                                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                required
                                            >
                                                <option value="">Select Medicine</option>
                                                {prescriptionMedicines.map((medicine, index) => (
                                                    <option key={index} value={medicine.medicine}>
                                                        {medicine.medicine} - {medicine.dosage}
                                                    </option>
                                                ))}
                                            </select>

                                            {selectedMedicine && (
                                                <div className="space-y-4 mt-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Morning Time</label>
                                                        <input
                                                            type="time"
                                                            value={prescriptionMorningTime}
                                                            onChange={(e) => setPrescriptionMorningTime(e.target.value)}
                                                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    {prescriptionMedicines.find(m => m.medicine === selectedMedicine)?.dosage.includes('2 Times') && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Evening Time</label>
                                                            <input
                                                                type="time"
                                                                value={prescriptionEveningTime}
                                                                onChange={(e) => setPrescriptionEveningTime(e.target.value)}
                                                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                                required
                                                            />
                                                        </div>
                                                    )}

                                                    {prescriptionMedicines.find(m => m.medicine === selectedMedicine)?.dosage.includes('3 Times') && (
                                                        <>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Afternoon Time</label>
                                                                <input
                                                                    type="time"
                                                                    value={prescriptionAfternoonTime}
                                                                    onChange={(e) => setPrescriptionAfternoonTime(e.target.value)}
                                                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Evening Time</label>
                                                                <input
                                                                    type="time"
                                                                    value={prescriptionEveningTime}
                                                                    onChange={(e) => setPrescriptionEveningTime(e.target.value)}
                                                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                                                                    required
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-4">
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthRemainders;