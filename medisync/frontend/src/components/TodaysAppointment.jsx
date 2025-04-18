import React, { useState } from 'react';
import { FiClock, FiCalendar, FiUser, FiMessageSquare, FiCheckCircle, FiXCircle, FiAlertCircle, FiPhone, FiVideo, FiEdit, FiPlus } from 'react-icons/fi';

const TodaysAppointment = () => {
    // Get current date for display
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Sample appointment data - in a real app, this would come from an API
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            patient: {
                name: "John Doe",
                age: 42,
                gender: "Male",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                phone: "+1234567890",
                email: "john.doe@example.com"
            },
            time: "10:00 AM",
            endTime: "10:30 AM",
            reason: "Routine Checkup",
            status: "confirmed",
            notes: "Patient has history of hypertension",
            isNew: false,
            duration: 30,
            type: "in-person"
        },
        {
            id: 2,
            patient: {
                name: "Jane Smith",
                age: 35,
                gender: "Female",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                phone: "+0987654321",
                email: "jane.smith@example.com"
            },
            time: "11:30 AM",
            endTime: "12:00 PM",
            reason: "Blood Pressure Check",
            status: "pending",
            notes: "Follow-up from last month's visit",
            isNew: false,
            duration: 30,
            type: "in-person"
        },
        {
            id: 3,
            patient: {
                name: "Michael Lee",
                age: 60,
                gender: "Male",
                image: "https://randomuser.me/api/portraits/men/15.jpg",
                phone: "+1122334455",
                email: "michael.lee@example.com"
            },
            time: "02:00 PM",
            endTime: "02:30 PM",
            reason: "Consultation",
            status: "cancelled",
            notes: "Patient called to reschedule",
            isNew: false,
            duration: 30,
            type: "in-person"
        },
        {
            id: 4,
            patient: {
                name: "Emily Scott",
                age: 28,
                gender: "Female",
                image: "https://randomuser.me/api/portraits/women/67.jpg",
                phone: "+2233445566",
                email: "emily.scott@example.com"
            },
            time: "03:30 PM",
            endTime: "04:00 PM",
            reason: "X-Ray Results Review",
            status: "confirmed",
            notes: "X-Ray taken last week for shoulder pain",
            isNew: true,
            duration: 30,
            type: "video"
        },
        {
            id: 5,
            patient: {
                name: "Robert Johnson",
                age: 52,
                gender: "Male",
                image: "https://randomuser.me/api/portraits/men/92.jpg",
                phone: "+3344556677",
                email: "robert.johnson@example.com"
            },
            time: "04:30 PM",
            endTime: "05:00 PM",
            reason: "Medication Review",
            status: "confirmed",
            notes: "Needs to discuss side effects of current medication",
            isNew: false,
            duration: 30,
            type: "phone"
        }
    ]);

    // State for selected appointment
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    
    // Filter appointments based on status
    const filteredAppointments = appointments.filter(appointment => {
        if (activeFilter === 'all') return true;
        return appointment.status === activeFilter;
    });
    
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
    
    // Get appointment type icon
    const getTypeIcon = (type) => {
        switch(type) {
            case 'video':
                return <FiVideo className="h-4 w-4 text-blue-600" />;
            case 'phone':
                return <FiPhone className="h-4 w-4 text-purple-600" />;
            default:
                return <FiUser className="h-4 w-4 text-indigo-600" />;
        }
    };
    
    // Get status icon
    const getStatusIcon = (status) => {
        switch(status) {
            case 'confirmed':
                return <FiCheckCircle className="h-5 w-5 text-green-600" />;
            case 'pending':
                return <FiAlertCircle className="h-5 w-5 text-yellow-600" />;
            case 'cancelled':
                return <FiXCircle className="h-5 w-5 text-red-600" />;
            default:
                return <FiClock className="h-5 w-5 text-gray-600" />;
        }
    };

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 animate-fadeIn">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Today's Schedule
                </h1>
                <div className="flex items-center mt-2">
                    <FiCalendar className="mr-2 text-gray-500" />
                    <p className="text-lg text-gray-600">{formattedDate}</p>
                </div>
            </div>

            {/* Stats overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                <FiCalendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Appointments
                                    </dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            {appointments.length}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <FiCheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Confirmed
                                    </dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            {appointments.filter(a => a.status === 'confirmed').length}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                <FiAlertCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Pending
                                    </dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            {appointments.filter(a => a.status === 'pending').length}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                                <FiXCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Cancelled
                                    </dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            {appointments.filter(a => a.status === 'cancelled').length}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
                <button 
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                        activeFilter === 'all' 
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    All Appointments
                </button>
                <button 
                    onClick={() => setActiveFilter('confirmed')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                        activeFilter === 'confirmed' 
                            ? 'bg-green-100 text-green-700 border border-green-300' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Confirmed
                </button>
                <button 
                    onClick={() => setActiveFilter('pending')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                        activeFilter === 'pending' 
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Pending
                </button>
                <button 
                    onClick={() => setActiveFilter('cancelled')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                        activeFilter === 'cancelled' 
                            ? 'bg-red-100 text-red-700 border border-red-300' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Cancelled
                </button>
            </div>

            {/* Main content - split view */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Timeline view */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Appointment Timeline</h3>
                            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                <FiPlus className="mr-1 h-4 w-4" />
                                Add Appointment
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                            {filteredAppointments.length > 0 ? (
                                <ol className="relative border-l border-gray-200 ml-6 mt-4 mb-4">
                                    {filteredAppointments.map((appointment) => (
                                        <li 
                                            key={appointment.id} 
                                            className={`mb-6 ml-6 cursor-pointer ${selectedAppointment?.id === appointment.id ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                                            onClick={() => setSelectedAppointment(appointment)}
                                        >
                                            <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${
                                                appointment.status === 'confirmed' ? 'bg-green-200' : 
                                                appointment.status === 'pending' ? 'bg-yellow-200' : 'bg-red-200'
                                            }`}>
                                                {getStatusIcon(appointment.status)}
                                            </span>
                                            <div className={`p-4 bg-white rounded-lg border ${
                                                selectedAppointment?.id === appointment.id ? 'border-indigo-300 shadow-md' : 'border-gray-200'
                                            } transition-all duration-200 hover:shadow-md`}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <time className="text-sm font-normal leading-none text-gray-500 flex items-center">
                                                        <FiClock className="mr-1 h-3 w-3" />
                                                        {appointment.time} - {appointment.endTime}
                                                    </time>
                                                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusBadge(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <img className="h-10 w-10 rounded-full mr-3" src={appointment.patient.image} alt="" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900 flex items-center">
                                                            {appointment.patient.name}
                                                            {appointment.isNew && (
                                                                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                                                                    New
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">{appointment.patient.age} yrs • {appointment.patient.gender}</p>
                                                    </div>
                                                </div>
                                                <p className="mb-2 text-sm font-normal text-gray-700 flex items-center">
                                                    {getTypeIcon(appointment.type)}
                                                    <span className="ml-1 capitalize">{appointment.type}</span>
                                                    <span className="mx-2">•</span>
                                                    {appointment.reason}
                                                </p>
                                                <div className="flex gap-2 mt-3">
                                                    <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors duration-200">
                                                        View Details
                                                    </button>
                                                    <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center">
                                                        <FiEdit className="mr-1 h-3 w-3" />
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No appointments found matching your criteria.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Appointment details */}
                <div className="w-full lg:w-1/3">
                    {selectedAppointment ? (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Appointment Details</h3>
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                        <FiClock className="mr-1 h-3 w-3" />
                                        {selectedAppointment.time} - {selectedAppointment.endTime} ({selectedAppointment.duration} min)
                                    </p>
                                </div>
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(selectedAppointment.status)}`}>
                                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                                </span>
                            </div>
                            
                            <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
                                <img className="h-16 w-16 rounded-full object-cover mr-4" src={selectedAppointment.patient.image} alt="" />
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900 flex items-center">
                                        {selectedAppointment.patient.name}
                                        {selectedAppointment.isNew && (
                                            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                                                New Patient
                                            </span>
                                        )}
                                    </h4>
                                    <p className="text-gray-600">{selectedAppointment.patient.age} years • {selectedAppointment.patient.gender}</p>
                                </div>
                            </div>
                            
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Reason for Visit</h5>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedAppointment.reason}</p>
                            </div>
                            
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Notes</h5>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                                    <p className="text-sm font-medium">{selectedAppointment.patient.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                    <p className="text-sm font-medium">{selectedAppointment.patient.email}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                {selectedAppointment.type === 'video' && (
                                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                                        <FiVideo className="h-4 w-4" />
                                        <span>Start Video Call</span>
                                    </button>
                                )}
                                {selectedAppointment.type === 'phone' && (
                                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                                        <FiPhone className="h-4 w-4" />
                                        <span>Call Patient</span>
                                    </button>
                                )}
                                {selectedAppointment.type === 'in-person' && (
                                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                                        <FiCheckCircle className="h-4 w-4" />
                                        <span>Check In Patient</span>
                                    </button>
                                )}
                                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
                                    <FiMessageSquare className="h-4 w-4" />
                                    <span>Send Message</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full flex flex-col items-center justify-center text-center">
                            <div className="bg-indigo-100 p-4 rounded-full mb-4">
                                <FiCalendar className="h-10 w-10 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointment Selected</h3>
                            <p className="text-gray-500">Select an appointment from the timeline to view details.</p>
                        </div>
                    )}
                </div>
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

export default TodaysAppointment;