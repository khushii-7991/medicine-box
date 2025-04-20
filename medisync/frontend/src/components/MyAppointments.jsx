import React, { useState, useEffect } from 'react'

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Load appointments from localStorage
        const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        setAppointments(savedAppointments);
    }, []);

    const handleCancelAppointment = (appointmentId) => {
        const updatedAppointments = appointments.map(appointment => {
            if (appointment.id === appointmentId) {
                return { ...appointment, status: 'Cancelled' };
            }
            return appointment;
        });
        
        setAppointments(updatedAppointments);
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div class="bg-gray-50 min-h-screen font-sans">
            <nav class="bg-green-900 text-white p-5 flex justify-between items-center">
                <h1 class="text-2xl font-bold">📅 My Appointments</h1>
                <div class="space-x-4">
                    <a href="/book-appointment" class="bg-white text-green-900 px-4 py-2 rounded-lg hover:bg-green-50 transition">
                        Book New Appointment
                    </a>
                    <a href="/" class="text-sm hover:underline">Back to Dashboard</a>
                </div>
            </nav>

            <div class="max-w-6xl mx-auto py-12 px-6">
                <div class="bg-white rounded-2xl shadow-xl p-6">
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

            <footer class="text-center text-sm text-gray-500 p-5">
                © 2025 Smart Medical System. All rights reserved.
            </footer>
        </div>
    )
}

export default MyAppointments