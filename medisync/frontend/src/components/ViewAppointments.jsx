import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [notes, setNotes] = useState('');

    // Fetch appointments when component mounts
    useEffect(() => {
        fetchAppointments();
    }, []);

    // Fetch appointments from the API
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            
            // Get token from localStorage
            const token = localStorage.getItem('doctorToken');
            if (!token) {
                setError('You must be logged in to view appointments');
                setLoading(false);
                return;
            }

            // Fetch appointments from backend
            const response = await axios.get(
                'http://localhost:3000/appointment/doctor',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setAppointments(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Failed to fetch appointments');
            console.error('Error fetching appointments:', err);
        }
    };

    // Update appointment status
    const updateAppointmentStatus = async (appointmentId, status) => {
        try {
            setUpdateLoading(true);
            
            // Get token from localStorage - use doctorToken instead of token
            const token = localStorage.getItem('doctorToken');
            if (!token) {
                toast.error('You must be logged in to update appointments');
                setUpdateLoading(false);
                return;
            }

            // Update appointment status
            const response = await axios.put(
                `http://localhost:3000/appointment/${appointmentId}/status`,
                { status, notes },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Update local state
            setAppointments(appointments.map(appointment => 
                appointment._id === appointmentId 
                    ? { ...appointment, status, notes: notes || appointment.notes } 
                    : appointment
            ));

            // Update selected appointment if it's the one being updated
            if (selectedAppointment && selectedAppointment._id === appointmentId) {
                setSelectedAppointment({ 
                    ...selectedAppointment, 
                    status, 
                    notes: notes || selectedAppointment.notes 
                });
            }

            setUpdateLoading(false);
            setNotes('');
            toast.success(`Appointment ${status === 'confirmed' ? 'confirmed' : status === 'cancelled' ? 'cancelled' : 'updated'} successfully`);
        } catch (err) {
            setUpdateLoading(false);
            toast.error(err.response?.data?.message || 'Failed to update appointment');
            console.error('Error updating appointment:', err);
        }
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        switch(status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'completed':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Filter appointments based on active tab
    const filteredAppointments = appointments.filter(appointment => {
        if (activeTab === 'all') return true;
        return appointment.status === activeTab;
    });

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 animate-fadeIn">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Your Appointments
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Manage and view all your scheduled appointments with patients.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
                        <button 
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 ease-in-out ${
                                activeTab === 'all' 
                                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 ease-in-out ${
                                activeTab === 'pending' 
                                    ? 'bg-yellow-50 text-yellow-700 border-b-2 border-yellow-500' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Pending
                        </button>
                        <button 
                            onClick={() => setActiveTab('confirmed')}
                            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 ease-in-out ${
                                activeTab === 'confirmed' 
                                    ? 'bg-green-50 text-green-700 border-b-2 border-green-500' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Confirmed
                        </button>
                        <button 
                            onClick={() => setActiveTab('completed')}
                            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 ease-in-out ${
                                activeTab === 'completed' 
                                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Completed
                        </button>
                        <button 
                            onClick={() => setActiveTab('cancelled')}
                            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 ease-in-out ${
                                activeTab === 'cancelled' 
                                    ? 'bg-red-50 text-red-700 border-b-2 border-red-500' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Cancelled
                        </button>
                    </div>

                    {/* Appointment list and details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Appointment list */}
                        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
                                <p className="text-sm text-gray-500">
                                    {filteredAppointments.length} {activeTab === 'all' ? 'total' : activeTab} appointment{filteredAppointments.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="overflow-y-auto max-h-[600px]">
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map(appointment => (
                                        <div 
                                            key={appointment._id}
                                            onClick={() => setSelectedAppointment(appointment)}
                                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                                                selectedAppointment && selectedAppointment._id === appointment._id ? 'bg-indigo-50' : ''
                                            }`}
                                        >
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                                                        {appointment.patient?.name?.charAt(0) || 'P'}
                                                    </div>
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{appointment.patient?.name || 'Patient'}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(appointment.date)}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {appointment.isFlexibleTiming ? 'Flexible timing' : `${appointment.time}`}
                                                    </p>
                                                    <div className="mt-1">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(appointment.status)}`}>
                                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-gray-500">
                                        No appointments found
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Appointment details */}
                        <div className="lg:col-span-2">
                            {selectedAppointment ? (
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(selectedAppointment.status)}`}>
                                                {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Patient</h3>
                                                <p className="text-base font-medium text-gray-900">{selectedAppointment.patient?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Age</h3>
                                                <p className="text-base font-medium text-gray-900">{selectedAppointment.patient?.age || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Date</h3>
                                                <p className="text-base font-medium text-gray-900">{formatDate(selectedAppointment.date)}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Time</h3>
                                                <p className="text-base font-medium text-gray-900">
                                                    {selectedAppointment.isFlexibleTiming ? 'Flexible timing' : selectedAppointment.time}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-6">
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Reason for Visit</h3>
                                            <p className="text-base text-gray-900">{selectedAppointment.reason}</p>
                                        </div>
                                        
                                        {selectedAppointment.notes && (
                                            <div className="mb-6">
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
                                                <p className="text-base text-gray-900">{selectedAppointment.notes}</p>
                                            </div>
                                        )}
                                        
                                        {selectedAppointment.status === 'pending' && (
                                            <div className="mb-6">
                                                <h3 className="text-sm font-medium text-gray-500 mb-1">Add Notes (Optional)</h3>
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    rows="3"
                                                    placeholder="Add any notes or instructions for the patient..."
                                                ></textarea>
                                            </div>
                                        )}
                                        
                                        <div className="flex flex-wrap gap-3 mt-6">
                                            {selectedAppointment.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateAppointmentStatus(selectedAppointment._id, 'confirmed')}
                                                        disabled={updateLoading}
                                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {updateLoading ? (
                                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>Confirm Appointment</span>
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => updateAppointmentStatus(selectedAppointment._id, 'cancelled')}
                                                        disabled={updateLoading}
                                                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {updateLoading ? (
                                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>Decline Appointment</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </>
                                            )}
                                            
                                            {selectedAppointment.status === 'confirmed' && (
                                                <button
                                                    onClick={() => updateAppointmentStatus(selectedAppointment._id, 'completed')}
                                                    disabled={updateLoading}
                                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {updateLoading ? (
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            <span>Mark as Completed</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            
                                            <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                </svg>
                                                <span>Call Patient</span>
                                            </button>
                                            <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                                </svg>
                                                <span>Message</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full flex flex-col items-center justify-center text-center">
                                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointment Selected</h3>
                                    <p className="text-gray-500">Click on an appointment from the list to view details.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Action buttons */}
            <div className="mt-8 flex justify-end">
                <button 
                    onClick={fetchAppointments}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center mr-3"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Refresh
                </button>
                <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Export Schedule
                </button>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ViewAppointments;