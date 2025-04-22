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
        <div className="bg-gray-50 min-h-screen font-sans">
            <nav className="bg-green-900 text-white p-5 flex justify-between items-center">
                <h1 className="text-2xl font-bold">📅 My Appointments</h1>
                <div className="space-x-4">
                    <a href="/book-appointment" className="bg-white text-green-900 px-4 py-2 rounded-lg hover:bg-green-50 transition">
                        Book New Appointment
                    </a>
                    <a href="/" className="text-sm hover:underline">Back to Dashboard</a>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto py-12 px-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-green-800">Upcoming and Past Appointments</h2>
                        <a href="/book-appointment" class="text-green-600 hover:text-green-800 font-medium">
                            + Add New Appointment
                        </a>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id} class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">{appointment.category}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{appointment.doctor}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{appointment.date}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{appointment.time}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-900">{appointment.location}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            {appointment.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleCancelAppointment(appointment.id)}
                                                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {appointments.length === 0 && (
                        <div class="text-center py-8">
                            <p class="text-gray-600">No appointments found.</p>
                            <a href="/book-appointment" class="text-green-600 hover:text-green-800 mt-2 inline-block">
                                Book a new appointment
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAppointments;