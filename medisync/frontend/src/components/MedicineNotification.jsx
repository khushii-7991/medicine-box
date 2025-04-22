import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaClock, FaInfoCircle } from 'react-icons/fa';

const MedicineNotification = () => {
    const [showMedicinePrompt, setShowMedicinePrompt] = useState(false);
    const [currentMedicinePrompt, setCurrentMedicinePrompt] = useState(null);
    const [pendingMedicines, setPendingMedicines] = useState([]);
    const [todaysMedicines, setTodaysMedicines] = useState([]);

    // Test function to check localStorage data
    const checkLocalStorageData = () => {
        try {
            const healthRemainders = JSON.parse(localStorage.getItem('healthRemainders') || '[]');
            console.log('Health Remainders in localStorage:', healthRemainders);
            
            if (healthRemainders.length === 0) {
                console.log('No medicines found in healthRemainders');
                // Add a test medicine if none exists
                const now = new Date();
                const testMedicine = {
                    id: 'test-1',
                    medicineName: 'Test Medicine',
                    date: now.toISOString(), // Store full ISO string with date and time
                    completed: false,
                    // No separate time property needed as it's included in the date
                };
                localStorage.setItem('healthRemainders', JSON.stringify([testMedicine]));
                console.log('Added test medicine:', testMedicine);
            }
        } catch (error) {
            console.error('Error checking localStorage data:', error);
            // Reset corrupted data
            localStorage.setItem('healthRemainders', '[]');
        }
    };

    const getTodaysMedicines = () => {
        try {
            const today = new Date();
            // Reset hours to compare just the date
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

            // Get medicines from healthRemainders
            const healthRemainders = JSON.parse(localStorage.getItem('healthRemainders') || '[]');
            console.log('Health Remainders:', healthRemainders);

            // Find medicines scheduled for today
            const todaysSchedule = healthRemainders.filter(medicine => {
                if (!medicine.date) return false;
                
                const medicineDate = new Date(medicine.date);
                const isToday = medicineDate >= todayStart && medicineDate <= todayEnd;
                const isNotCompleted = !medicine.completed;
                console.log('Medicine:', medicine.medicineName, 'Is today:', isToday, 'Not completed:', isNotCompleted);
                return isToday && isNotCompleted;
            });

            console.log('Today\'s Schedule:', todaysSchedule);

            // Sort medicines by time
            todaysSchedule.sort((a, b) => {
                const timeA = new Date(a.date).getTime();
                const timeB = new Date(b.date).getTime();
                return timeA - timeB;
            });

            setTodaysMedicines(todaysSchedule);
        } catch (error) {
            console.error('Error getting today\'s medicines:', error);
            setTodaysMedicines([]);
        }
    };

    const checkPendingMedicines = () => {
        try {
            const now = new Date();
            console.log('Current time:', now);

            // Get medicines from healthRemainders
            const healthRemainders = JSON.parse(localStorage.getItem('healthRemainders') || '[]');

            // Find medicines that are due now
            const dueMedicines = healthRemainders.filter(medicine => {
                if (!medicine.date) {
                    console.log('No date for medicine:', medicine);
                    return false;
                }

                try {
                    const medicineTime = new Date(medicine.date);
                    console.log('Medicine:', medicine.medicineName, 'Time:', medicineTime);

                    // Check if the medicine's scheduled time has passed
                    const timeDifference = now - medicineTime;
                    console.log('Time difference (ms):', timeDifference);

                    // Medicine is due if time has passed and it's not completed
                    const isDue = timeDifference > 0 && !medicine.completed;
                    console.log('Is due:', isDue);
                    return isDue;
                } catch (dateError) {
                    console.error('Error parsing medicine date:', dateError);
                    return false;
                }
            });

            console.log('Due medicines:', dueMedicines);

            if (dueMedicines.length > 0) {
                console.log('Setting pending medicines and showing prompt');
                setPendingMedicines(dueMedicines);
                setCurrentMedicinePrompt(dueMedicines[0]);
                setShowMedicinePrompt(true);
            } else {
                console.log('No due medicines found');
            }
        } catch (error) {
            console.error('Error checking pending medicines:', error);
        }
    };

    const handleMedicineStatus = (medicine, status) => {
        try {
            console.log('Handling medicine status:', medicine, status);
            
            // Update healthRemainders data
            const healthRemainders = JSON.parse(localStorage.getItem('healthRemainders') || '[]');
            const updatedHealthRemainders = healthRemainders.map(remainder => {
                if (remainder.id === medicine.id) {
                    return {
                        ...remainder,
                        completed: status === 'taken',
                        status: status === 'taken' ? 'completed' : 'missed',
                        lastUpdated: new Date().toISOString()
                    };
                }
                return remainder;
            });
            localStorage.setItem('healthRemainders', JSON.stringify(updatedHealthRemainders));

            // Update local state
            setTodaysMedicines(prev => prev.filter(m => m.id !== medicine.id));
            setPendingMedicines(prev => prev.filter(m => m.id !== medicine.id));
            setShowMedicinePrompt(false);
            setCurrentMedicinePrompt(null);
        } catch (error) {
            console.error('Error handling medicine status:', error);
        }
    };

    // Force show notification for testing
    const forceShowNotification = () => {
        try {
            const testNotification = {
                id: 'test-notification',
                medicineName: 'Test Medicine',
                date: new Date().toISOString(),
                completed: false
            };
            setCurrentMedicinePrompt(testNotification);
            setShowMedicinePrompt(true);
        } catch (error) {
            console.error('Error showing test notification:', error);
        }
    };

    useEffect(() => {
        console.log('Component mounted');
        checkLocalStorageData();
        getTodaysMedicines();
        checkPendingMedicines();
        
        // Check every 5 seconds
        const interval = setInterval(() => {
            console.log('Checking for due medicines...');
            getTodaysMedicines();
            checkPendingMedicines();
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Test button to force show notification */}
            <button
                onClick={forceShowNotification}
                className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
                Test Notification
            </button>

            {/* Today's Medicine Schedule */}
            {todaysMedicines.length > 0 && (
                <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-md w-full z-40">
                    <h3 className="text-lg font-semibold mb-2">Today's Medicine Schedule</h3>
                    <div className="space-y-2">
                        {todaysMedicines.map((medicine, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 rounded bg-gray-50"
                            >
                                <div className="flex items-center gap-2">
                                    <FaClock className="text-gray-500" />
                                    <span className="font-medium">{medicine.medicineName}</span>
                                    <span className="text-sm text-gray-600">
                                        ({new Date(medicine.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleMedicineStatus(medicine, 'taken')}
                                        className="text-green-500 hover:text-green-600"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={() => handleMedicineStatus(medicine, 'missed')}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Medicine Prompt Modal */}
            {showMedicinePrompt && currentMedicinePrompt && (
                <div className="fixed inset-0 bg-white bg-opacity-100 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg animate-fade-in border border-gray-200">
                        <h3 className="text-xl font-semibold mb-4">Medicine Reminder</h3>
                        <p className="text-gray-700 mb-4">
                            Have you taken your {currentMedicinePrompt.medicineName} at {new Date(currentMedicinePrompt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => handleMedicineStatus(currentMedicinePrompt, 'missed')}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                            >
                                <FaTimes /> Missed
                            </button>
                            <button
                                onClick={() => handleMedicineStatus(currentMedicinePrompt, 'taken')}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                            >
                                <FaCheck /> Taken
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MedicineNotification; 