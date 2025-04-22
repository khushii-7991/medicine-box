import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const DoctorEmergencySchedule = () => {
    const [date, setDate] = useState('');
    const [originalStartTime, setOriginalStartTime] = useState('');
    const [originalEndTime, setOriginalEndTime] = useState('');
    const [newStartTime, setNewStartTime] = useState('');
    const [newEndTime, setNewEndTime] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [emergencyChanges, setEmergencyChanges] = useState([]);
    const [sittingHours, setSittingHours] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const [affectedAppointments, setAffectedAppointments] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isUnavailable, setIsUnavailable] = useState(false);

    // Fetch doctor's sitting hours and emergency changes when component mounts
    useEffect(() => {
        fetchSittingHours();
        fetchEmergencyChanges();
    }, []);

    // Fetch doctor's sitting hours
    const fetchSittingHours = async () => {
        try {
            const token = localStorage.getItem('doctorToken');
            if (!token) return;

            const response = await axios.get('http://localhost:3000/doctor/profile', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            setSittingHours(response.data.sittingHours || []);
        } catch (err) {
            console.error('Error fetching sitting hours:', err);
            toast.error('Failed to load sitting hours');
        }
    };

    // Fetch doctor's emergency schedule changes
    const fetchEmergencyChanges = async () => {
        try {
            const token = localStorage.getItem('doctorToken');
            if (!token) return;

            const response = await axios.get('http://localhost:3000/doctor/emergency-changes', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            setEmergencyChanges(response.data || []);
        } catch (err) {
            console.error('Error fetching emergency changes:', err);
            toast.error('Failed to load emergency schedule changes');
        }
    };

    // When date changes, set the day of week
    useEffect(() => {
        if (date) {
            const selectedDate = new Date(date);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            setSelectedDay(days[selectedDate.getDay()]);
        }
    }, [date]);

    // When day changes, set the default time range based on sitting hours
    useEffect(() => {
        if (selectedDay) {
            const daySchedule = sittingHours.find(hour => hour.day === selectedDay);
            if (daySchedule) {
                setOriginalStartTime(daySchedule.startTime);
                setOriginalEndTime(daySchedule.endTime);
                // Reset new time to match original time initially
                setNewStartTime(daySchedule.startTime);
                setNewEndTime(daySchedule.endTime);
            }
        }
    }, [selectedDay, sittingHours]);

    // Handle marking time as unavailable
    const handleUnavailableChange = (e) => {
        setIsUnavailable(e.target.checked);
        if (e.target.checked) {
            // If marked as unavailable, set new times to same value (which means unavailable)
            setNewStartTime(originalStartTime);
            setNewEndTime(originalStartTime);
        } else {
            // If not unavailable, reset to original times
            setNewStartTime(originalStartTime);
            setNewEndTime(originalEndTime);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Show confirmation dialog first
        setShowConfirmation(true);
    };

    // State for success message
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Confirm and submit the emergency change
    const confirmSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('doctorToken');
            if (!token) {
                toast.error('You must be logged in');
                setLoading(false);
                return;
            }

            const response = await axios.post(
                'http://localhost:3000/doctor/emergency-schedule-change',
                {
                    date,
                    originalStartTime,
                    originalEndTime,
                    newStartTime,
                    newEndTime,
                    reason
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            toast.success('Emergency schedule change applied successfully');
            
            // Show affected appointments
            if (response.data.affectedAppointments) {
                setAffectedAppointments(response.data.affectedAppointments);
            }
            
            // Set success message
            setSuccessMessage(
                newStartTime === newEndTime
                    ? 'Your schedule has been updated successfully. Affected appointments have been cancelled and patients have been notified.'
                    : 'Your schedule has been updated successfully. Affected appointments have been rescheduled when possible and patients have been notified.'
            );
            setShowSuccess(true);
            
            // Reset form
            setDate('');
            setOriginalStartTime('');
            setOriginalEndTime('');
            setNewStartTime('');
            setNewEndTime('');
            setReason('');
            
            // Refresh emergency changes list
            fetchEmergencyChanges();
            setShowConfirmation(false);
        } catch (err) {
            console.error('Error updating emergency schedule:', err);
            toast.error(err.response?.data?.message || 'Failed to update schedule');
        } finally {
            setLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaExclamationTriangle className="text-yellow-500 mr-2" />
                Emergency Schedule Change
            </h2>
            
            <div className="mb-8">
                <p className="text-gray-600 mb-4">
                    Use this form to update your availability in case of an emergency. 
                    Patients with affected appointments will be automatically notified of the changes.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-500" />
                            Date
                        </label>
                        <input
                            type="date"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                        {selectedDay && (
                            <p className="mt-1 text-sm text-gray-500">
                                Selected day: {selectedDay}
                            </p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Reason for Change
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Medical emergency, Personal matter"
                        />
                    </div>
                </div>

                {/* Original Time Range - Read Only */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                        <FaClock className="mr-2 text-blue-500" />
                        Original Time Range
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Start Time
                            </label>
                            <div className="w-full p-3 border border-gray-300 bg-gray-100 rounded-md text-gray-700">
                                {originalStartTime}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                End Time
                            </label>
                            <div className="w-full p-3 border border-gray-300 bg-gray-100 rounded-md text-gray-700">
                                {originalEndTime}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doctor Availability */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                        <FaClock className="mr-2 text-green-500" />
                        Doctor Availability
                    </h3>
                    
                    <div className="mb-4">
                        <label className="flex items-center text-red-600 font-medium cursor-pointer">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-500 mr-2"
                                checked={isUnavailable}
                                onChange={handleUnavailableChange}
                            />
                            <FaExclamationTriangle className="mr-1" />
                            Doctor is not available during this time
                        </label>
                    </div>
                    
                    {!isUnavailable && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    New Start Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newStartTime}
                                    onChange={(e) => setNewStartTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    New End Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newEndTime}
                                    onChange={(e) => setNewEndTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Schedule'}
                    </button>
                </div>
            </form>

            {/* Confirmation Dialog */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                            <FaExclamationTriangle className="mr-2" />
                            Confirm Schedule Change
                        </h3>
                        <p className="text-gray-700 mb-4">
                            This action will affect existing appointments and automatically notify patients.
                            Are you sure you want to proceed?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSubmit}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Confirm Change'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Success Dialog */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Schedule Updated Successfully
                        </h3>
                        <p className="text-gray-700 mb-4">
                            {successMessage}
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Affected Appointments */}
            {affectedAppointments.length > 0 && (
                <div className="mt-8 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                        <FaExclamationTriangle className="mr-2 text-yellow-500" />
                        Affected Appointments
                    </h3>
                    <ul className="space-y-2">
                        {affectedAppointments.map((appointment) => (
                            <li key={appointment.id} className="flex justify-between items-center p-2 border-b">
                                <div>
                                    <span className="font-medium">{appointment.patientName}</span>
                                    {appointment.originalTime && (
                                        <span className="text-sm text-gray-500 ml-2">
                                            Original: {appointment.originalTime}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    {appointment.status === 'cancelled' ? (
                                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                            Cancelled
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                            Rescheduled to {appointment.newTime}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Recent Emergency Changes */}
            {emergencyChanges.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-medium text-gray-800 mb-4">Recent Emergency Changes</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Original Time
                                    </th>
                                    <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        New Time
                                    </th>
                                    <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reason
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {emergencyChanges.map((change, index) => (
                                    <tr key={index}>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {formatDate(change.date)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {change.originalStartTime} - {change.originalEndTime}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {change.newStartTime === change.newEndTime ? (
                                                <span className="text-red-500">Unavailable</span>
                                            ) : (
                                                `${change.newStartTime} - ${change.newEndTime}`
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {change.reason}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorEmergencySchedule;
