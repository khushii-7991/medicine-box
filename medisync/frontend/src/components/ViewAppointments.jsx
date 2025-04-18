import React, { useState } from 'react';

const ViewAppointments = () => {
    // Sample data - in a real app, this would come from an API
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            patient: {
                name: "John Doe",
                age: 42,
                gender: "Male",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            date: "2025-04-15",
            time: "10:00 AM",
            status: "confirmed",
            reason: "Annual checkup",
            notes: "Patient has history of hypertension"
        },
        {
            id: 2,
            patient: {
                name: "Emily Scott",
                age: 35,
                gender: "Female",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            date: "2025-04-16",
            time: "03:30 PM",
            status: "pending",
            reason: "Headache and fever",
            notes: "First-time patient"
        },
        {
            id: 3,
            patient: {
                name: "Michael Chen",
                age: 28,
                gender: "Male",
                image: "https://randomuser.me/api/portraits/men/15.jpg"
            },
            date: "2025-04-18",
            time: "09:15 AM",
            status: "confirmed",
            reason: "Follow-up after surgery",
            notes: "Check incision site"
        },
        {
            id: 4,
            patient: {
                name: "Sarah Johnson",
                age: 52,
                gender: "Female",
                image: "https://randomuser.me/api/portraits/women/68.jpg"
            },
            date: "2025-04-20",
            time: "11:30 AM",
            status: "cancelled",
            reason: "Diabetes consultation",
            notes: "Needs to reschedule"
        }
    ]);

    const [activeTab, setActiveTab] = useState('all');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    
    // Filter appointments based on active tab
    const filteredAppointments = appointments.filter(appointment => {
        if (activeTab === 'all') return true;
        return appointment.status === activeTab;
    });

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
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

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

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 ease-in-out ${
                        activeTab === 'all' 
                            ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    All Appointments
                </button>
                <button 
                    onClick={() => setActiveTab('confirmed')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 ease-in-out ${
                        activeTab === 'confirmed' 
                            ? 'bg-green-50 text-green-700 border-b-2 border-green-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Confirmed
                </button>
                <button 
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 ease-in-out ${
                        activeTab === 'pending' 
                            ? 'bg-yellow-50 text-yellow-700 border-b-2 border-yellow-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Pending
                </button>
                <button 
                    onClick={() => setActiveTab('cancelled')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 ease-in-out ${
                        activeTab === 'cancelled' 
                            ? 'bg-red-50 text-red-700 border-b-2 border-red-600' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Cancelled
                </button>
            </div>

            {/* Main content - split view */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Appointments list */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Reason
                                        </th>
                                        <th scope="col" className="relative px-6 py-4">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAppointments.length > 0 ? (
                                        filteredAppointments.map((appointment) => (
                                            <tr 
                                                key={appointment.id} 
                                                className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${selectedAppointment?.id === appointment.id ? 'bg-indigo-50' : ''}`}
                                                onClick={() => setSelectedAppointment(appointment)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img className="h-10 w-10 rounded-full object-cover" src={appointment.patient.image} alt="" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{appointment.patient.name}</div>
                                                            <div className="text-sm text-gray-500">{appointment.patient.age} yrs • {appointment.patient.gender}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{formatDate(appointment.date)}</div>
                                                    <div className="text-sm text-gray-500">{appointment.time}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(appointment.status)}`}>
                                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {appointment.reason}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                No appointments found for this filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Appointment details */}
                <div className="w-full lg:w-1/3">
                    {selectedAppointment ? (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Appointment Details</h3>
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(selectedAppointment.status)}`}>
                                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                                </span>
                            </div>
                            
                            <div className="flex items-center mb-6">
                                <img className="h-16 w-16 rounded-full object-cover mr-4" src={selectedAppointment.patient.image} alt="" />
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">{selectedAppointment.patient.name}</h4>
                                    <p className="text-gray-600">{selectedAppointment.patient.age} years • {selectedAppointment.patient.gender}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Date</p>
                                    <p className="text-sm font-medium">{formatDate(selectedAppointment.date)}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Time</p>
                                    <p className="text-sm font-medium">{selectedAppointment.time}</p>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Reason for Visit</h5>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedAppointment.reason}</p>
                            </div>
                            
                            <div className="mb-6">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Notes</h5>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
                            </div>
                            
                            <div className="flex gap-3 mt-8">
                                <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
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

            {/* Action buttons */}
            <div className="mt-8 flex justify-end">
                <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                    </svg>
                    Add New Appointment
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