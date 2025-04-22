import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    // Function to calculate time remaining
    const calculateTimeRemaining = (appointmentDate) => {
        const now = new Date();
        const appointmentTime = new Date(appointmentDate);
        const timeDiff = appointmentTime - now;
        
        if (timeDiff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
        
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        return { hours, minutes, seconds };
    };

    // Function to update appointment status
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            const token = localStorage.getItem('patientToken');
            if (!token) {
                toast.error('Please login to update appointment status');
                return;
            }

            const response = await axios.put(
                `http://localhost:3000/appointment/${appointmentId}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setAppointments(prevAppointments => 
                    prevAppointments.map(appointment => 
                        appointment._id === appointmentId 
                            ? { ...appointment, status: newStatus }
                            : appointment
                    )
                );
                toast.success(`Appointment status updated to ${newStatus}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update appointment status');
        }
    };

    // Function to handle appointment cancellation
    const handleCancelAppointment = async (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            await updateAppointmentStatus(appointmentId, 'Cancelled');
        }
    };

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Load appointments and set up timers
    useEffect(() => {
        const loadAppointments = async () => {
            try {
                const token = localStorage.getItem('patientToken');
                if (!token) {
                    toast.error('Please login to view appointments');
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:3000/appointment/my-appointments', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setAppointments(response.data.appointments);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load appointments');
            }
        };

        loadAppointments();

        // Set up interval to check and update appointment statuses
        const interval = setInterval(() => {
            setAppointments(prevAppointments => 
                prevAppointments.map(appointment => {
                    if (appointment.status === 'Pending') {
                        const { hours } = calculateTimeRemaining(appointment.date);
                        if (hours <= 0) {
                            // Update status to cancelled if 24 hours have passed
                            updateAppointmentStatus(appointment._id, 'Cancelled');
                            return { ...appointment, status: 'Cancelled' };
                        }
                    }
                    return appointment;
                })
            );
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
                    
                    {appointments.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No appointments found</p>
                            <button
                                onClick={() => navigate('/book-appointment')}
                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Book New Appointment
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Remaining</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {appointments.map((appointment) => {
                                        const timeRemaining = calculateTimeRemaining(appointment.date);
                                        return (
                                            <tr key={appointment._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {appointment.doctor?.name || 'Unknown Doctor'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {appointment.doctor?.speciality || 'General Physician'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(appointment.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {appointment.time || 'Flexible'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {appointment.status === 'Pending' ? (
                                                        <div className="text-sm text-gray-900">
                                                            {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-gray-500">-</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {appointment.status === 'Pending' && (
                                                        <button
                                                            onClick={() => handleCancelAppointment(appointment._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAppointments;