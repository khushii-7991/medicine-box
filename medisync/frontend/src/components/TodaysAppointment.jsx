import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiCalendar, FiUser, FiMessageSquare, FiCheckCircle, FiXCircle, FiAlertCircle, FiPhone, FiVideo, FiEdit, FiPlus, FiRefreshCw, FiTrash2, FiFilePlus, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';

const TodaysAppointment = () => {
    const navigate = useNavigate();
    // Get current date for display
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // State for appointments and UI states
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [prescriptionLoading, setPrescriptionLoading] = useState(false);
    const [prescription, setPrescription] = useState({
        medicines: [{ name: '', dosage: '', timings: ['morning'], whenToTake: 'after_meal' }],
        notes: '',
        duration: 7
    });
    
    // Function to add or remove medicine fields in the prescription form
    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...prescription.medicines];
        updatedMedicines[index][field] = value;
        setPrescription({
            ...prescription,
            medicines: updatedMedicines
        });
    };

    // Function to add a new medicine to the prescription
    const addMedicine = () => {
        setPrescription({
            ...prescription,
            medicines: [...prescription.medicines, { name: '', dosage: '', timings: ['morning'], whenToTake: 'after_meal' }]
        });
    };

    // Function to remove a medicine from the prescription
    const removeMedicine = (index) => {
        if (prescription.medicines.length > 1) {
            const updatedMedicines = [...prescription.medicines];
            updatedMedicines.splice(index, 1);
            setPrescription({
                ...prescription,
                medicines: updatedMedicines
            });
        }
    };

    // Function to handle timing selection
    const handleTimingChange = (index, timing) => {
        const updatedMedicines = [...prescription.medicines];
        const timings = updatedMedicines[index].timings;
        
        if (timings.includes(timing)) {
            // Remove timing if already selected
            updatedMedicines[index].timings = timings.filter(t => t !== timing);
        } else {
            // Add timing if not already selected
            updatedMedicines[index].timings = [...timings, timing];
        }
        
        setPrescription({
            ...prescription,
            medicines: updatedMedicines
        });
    };

    // Function to submit prescription
    const submitPrescription = async () => {
        if (!selectedAppointment) {
            console.error('No appointment selected');
            return;
        }
        
        try {
            setPrescriptionLoading(true);
            
            // Check if token exists
            const token = localStorage.getItem('doctorToken');
            if (!token) {
                console.error('No doctor token found in localStorage');
                navigate('/login/doctor');
                return;
            }
            
            // Get patient ID from selected appointment
            const patientId = selectedAppointment.patient.id || selectedAppointment.patient._id;
            console.log('Adding prescription for patient ID:', patientId);
            
            // Validate prescription data
            const isValid = prescription.medicines.every(medicine => 
                medicine.name && medicine.dosage && medicine.timings.length > 0
            );
            
            if (!isValid) {
                console.error('Invalid prescription data');
                alert('Please fill in all required fields for each medicine');
                return;
            }
            
            // Log the prescription data being sent
            console.log('Submitting prescription data:', {
                patientId,
                medicines: prescription.medicines,
                notes: prescription.notes,
                duration: prescription.duration
            });
            
            const response = await fetch('/prescription/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patientId,
                    medicines: prescription.medicines,
                    notes: prescription.notes,
                    duration: prescription.duration
                })
            });
            
            console.log('Prescription submission response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            const responseData = await response.json();
            console.log('Prescription created successfully:', responseData);
            
            // Reset form and hide it
            setPrescription({
                medicines: [{ name: '', dosage: '', timings: ['morning'], whenToTake: 'after_meal' }],
                notes: '',
                duration: 7
            });
            setShowPrescriptionForm(false);
            
            // Show success message
            alert('Prescription added successfully!');
            
        } catch (err) {
            console.error('Error creating prescription:', err);
            alert(`Failed to add prescription: ${err.message}`);
        } finally {
            setPrescriptionLoading(false);
        }
    };

    // Function to delete an appointment
    const deleteAppointment = async (appointmentId) => {
        try {
            setDeleteLoading(true);
            console.log('Deleting appointment with ID:', appointmentId);
            
            // Check if token exists
            const token = localStorage.getItem('doctorToken');
            if (!token) {
                console.error('No doctor token found in localStorage');
                navigate('/login/doctor');
                return;
            }
            
            const response = await fetch(`/appointment/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Delete response status:', response.status);
            
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('doctorToken');
                    navigate('/login/doctor');
                    return;
                }
                
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            // Remove the deleted appointment from the state
            setAppointments(appointments.filter(appointment => {
                // Handle both _id and id properties
                const appointmentIdToCheck = appointment._id || appointment.id;
                return appointmentIdToCheck !== appointmentId;
            }));
            
            // If the deleted appointment was selected, clear the selection
            if (selectedAppointment) {
                const selectedId = selectedAppointment._id || selectedAppointment.id;
                if (selectedId === appointmentId) {
                    setSelectedAppointment(null);
                }
            }
        } catch (err) {
            console.error('Error deleting appointment:', err);
        } finally {
            setDeleteLoading(false);
        }
    };
    
    // Fetch appointments for today and tomorrow
    useEffect(() => {
        const fetchTodaysAppointments = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Check if token exists
                const token = localStorage.getItem('doctorToken');
                if (!token) {
                    console.error('No doctor token found in localStorage');
                    navigate('/login/doctor');
                    return;
                }
                
                const response = await fetch('/appointment/today-tomorrow', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('doctorToken');
                        navigate('/login/doctor');
                        return;
                    }
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log('Today\'s and tomorrow\'s appointments:', data);
                
                if (Array.isArray(data)) {
                    setAppointments(data);
                } else {
                    console.warn('Expected array of appointments but got:', typeof data);
                    setAppointments([]);
                }
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError('Failed to load appointments. Please try again.');
                // Set empty appointments array
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchTodaysAppointments();
    }, [navigate]);
    
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
                    Today's & Tomorrow's Schedule
                </h1>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                        <FiCalendar className="mr-2 text-gray-500" />
                        <p className="text-lg text-gray-600">{formattedDate}</p>
                    </div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <FiRefreshCw className="mr-1" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <>
                    {appointments.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center mb-6">
                            <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                                <FiCalendar className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No Appointments Found</h3>
                            <p className="text-gray-600 mb-6">You don't have any appointments scheduled for today or tomorrow.</p>
                            <button 
                                onClick={() => navigate('/add-appointment')}
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                            >
                                <FiPlus className="mr-2" />
                                Add New Appointment
                            </button>
                        </div>
                    ) : (
                        <>
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
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Appointment timeline */}
                                <div className="lg:col-span-2 space-y-4">
                                    {filteredAppointments.length === 0 ? (
                                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
                                            <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                                                <FiCalendar className="h-6 w-6 text-gray-600" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeFilter !== 'all' ? activeFilter : ''} Appointments</h3>
                                            <p className="text-gray-600">There are no {activeFilter !== 'all' ? activeFilter : ''} appointments to display.</p>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                                <h3 className="text-lg font-medium text-gray-900">Appointment Timeline</h3>
                                                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                                    <FiPlus className="mr-1 h-4 w-4" />
                                                    Add New
                                                </button>
                                            </div>
                                            <div className="overflow-hidden">
                                                <ol className="relative border-l border-gray-200 ml-6 mt-6 mb-6 space-y-6">
                                                    {filteredAppointments.map((appointment) => (
                                                        <li key={appointment._id} className="mb-6 ml-6">
                                                            <span 
                                                                className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${
                                                                    appointment.status === 'confirmed' ? 'bg-green-100' : 
                                                                    appointment.status === 'pending' ? 'bg-yellow-100' : 
                                                                    'bg-red-100'
                                                                }`}
                                                            >
                                                                {getStatusIcon(appointment.status)}
                                                            </span>
                                                            <div 
                                                                className={`p-4 bg-white rounded-lg border ${
                                                                    selectedAppointment && selectedAppointment._id === appointment._id
                                                                        ? 'border-blue-300 ring-2 ring-blue-100'
                                                                        : 'border-gray-200 hover:border-blue-200'
                                                                } shadow-sm transition-all duration-200 cursor-pointer`}
                                                                onClick={() => setSelectedAppointment(appointment)}
                                                            >
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div className="flex items-center">
                                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                                                            <span className="text-indigo-800 font-medium text-sm">
                                                                                {appointment.patient && appointment.patient.name ? appointment.patient.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'NA'}
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="text-sm font-medium text-gray-900">{appointment.patient ? appointment.patient.name : 'Unknown Patient'}</h4>
                                                                            <div className="flex items-center mt-1">
                                                                                <div className="flex items-center mr-3">
                                                                                    <FiClock className="h-3 w-3 text-gray-400 mr-1" />
                                                                                    <span className="text-xs text-gray-500">{appointment.time}</span>
                                                                                </div>
                                                                                <div className="flex items-center">
                                                                                    {getTypeIcon(appointment.type)}
                                                                                    <span className="text-xs text-gray-500 ml-1 capitalize">{appointment.type}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getStatusBadge(appointment.status)}`}>
                                                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-600 mt-2">
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
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // Prevent selecting the appointment
                                                                            // Handle both _id and id properties
                                                                            const appointmentId = appointment._id || appointment.id;
                                                                            console.log('Clicked delete for appointment:', appointmentId);
                                                                            deleteAppointment(appointmentId);
                                                                        }}
                                                                        disabled={deleteLoading}
                                                                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition-colors duration-200 flex items-center"
                                                                    >
                                                                        <FiTrash2 className="mr-1 h-3 w-3" />
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Appointment details */}
                                <div className="lg:col-span-1">
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
                                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedAppointment.status)}`}>
                                                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center mb-6">
                                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                                                    <span className="text-indigo-800 font-medium">
                                                        {selectedAppointment.patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-medium text-gray-900">{selectedAppointment.patient.name}</h4>
                                                    <p className="text-sm text-gray-500">{selectedAppointment.patient.age} years • {selectedAppointment.patient.gender}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mb-6">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Appointment Type</h4>
                                                <div className="flex items-center">
                                                    {getTypeIcon(selectedAppointment.type)}
                                                    <span className="ml-2 text-gray-900 capitalize">{selectedAppointment.type} Consultation</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mb-6">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Reason for Visit</h4>
                                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedAppointment.reason}</p>
                                            </div>
                                            
                                            <div className="mb-6">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
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
                                            
                                            <div className="flex flex-col gap-3">
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
                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={() => {
                                                            // Handle both _id and id properties
                                                            const appointmentId = selectedAppointment._id || selectedAppointment.id;
                                                            console.log('Clicked delete for selected appointment:', appointmentId);
                                                            deleteAppointment(appointmentId);
                                                        }}
                                                        disabled={deleteLoading}
                                                        className="flex-1 border border-red-300 bg-red-50 text-red-700 py-2 px-4 rounded-lg hover:bg-red-100 transition-all duration-200 flex items-center justify-center gap-2"
                                                    >
                                                        <FiTrash2 className="h-4 w-4" />
                                                        <span>Delete</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                                                        className="flex-1 border border-blue-300 bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-all duration-200 flex items-center justify-center gap-2"
                                                    >
                                                        <FiFilePlus className="h-4 w-4" />
                                                        <span>{showPrescriptionForm ? 'Cancel' : 'Add Prescription'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Prescription Form */}
                                            {showPrescriptionForm && (
                                                <div className="mt-6 border-t border-gray-200 pt-6">
                                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add Prescription</h3>
                                                    
                                                    {prescription.medicines.map((medicine, index) => (
                                                        <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <h4 className="font-medium text-gray-700">Medicine {index + 1}</h4>
                                                                {prescription.medicines.length > 1 && (
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => removeMedicine(index)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <FiMinusCircle className="h-5 w-5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="grid grid-cols-1 gap-4 mb-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                                                                    <input
                                                                        type="text"
                                                                        value={medicine.name}
                                                                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="Enter medicine name"
                                                                    />
                                                                </div>
                                                                
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                                                                    <input
                                                                        type="text"
                                                                        value={medicine.dosage}
                                                                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="E.g., 1 tablet, 5ml, etc."
                                                                    />
                                                                </div>
                                                                
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">When to Take</label>
                                                                    <select
                                                                        value={medicine.whenToTake}
                                                                        onChange={(e) => handleMedicineChange(index, 'whenToTake', e.target.value)}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                    >
                                                                        <option value="before_meal">Before Meal</option>
                                                                        <option value="after_meal">After Meal</option>
                                                                    </select>
                                                                </div>
                                                                
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Timings</label>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {['morning', 'afternoon', 'evening', 'night'].map((timing) => (
                                                                            <button
                                                                                key={timing}
                                                                                type="button"
                                                                                onClick={() => handleTimingChange(index, timing)}
                                                                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${medicine.timings.includes(timing) ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                                                            >
                                                                                {timing.charAt(0).toUpperCase() + timing.slice(1)}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    
                                                    <button
                                                        type="button"
                                                        onClick={addMedicine}
                                                        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
                                                    >
                                                        <FiPlusCircle className="mr-1" />
                                                        <span>Add Another Medicine</span>
                                                    </button>
                                                    
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                                                        <input
                                                            type="number"
                                                            value={prescription.duration}
                                                            onChange={(e) => setPrescription({...prescription, duration: parseInt(e.target.value) || 1})}
                                                            min="1"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    
                                                    <div className="mb-6">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                                        <textarea
                                                            value={prescription.notes}
                                                            onChange={(e) => setPrescription({...prescription, notes: e.target.value})}
                                                            rows="3"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Any additional instructions..."
                                                        ></textarea>
                                                    </div>
                                                    
                                                    <button
                                                        type="button"
                                                        onClick={submitPrescription}
                                                        disabled={prescriptionLoading}
                                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                                                    >
                                                        {prescriptionLoading ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                                        ) : (
                                                            <FiFilePlus className="h-4 w-4" />
                                                        )}
                                                        <span>Save Prescription</span>
                                                    </button>
                                                </div>
                                            )}
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
                        </>
                    )}
                </>
            )}

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
