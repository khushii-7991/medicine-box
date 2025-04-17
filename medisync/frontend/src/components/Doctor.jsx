import React from 'react';

const Doctor = () => {
    return (
        <div>
            <div className="bg-gray-50 min-h-screen font-sans">

                <nav className="bg-cyan-900 text-white p-5 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">👨‍⚕️ Doctor Dashboard</h1>
                    <a href="/" className="text-sm hover:underline">Logout</a>
                </nav>

                <div className="max-w-7xl mx-auto py-12 px-6">

                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-cyan-800 mb-2">Welcome, Doctor!</h2>
                        <p className="text-gray-600">Manage patient records, prescriptions, appointments and reports from one place.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-prescription-bottle-medical text-7xl text-blue-700 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">Add Prescription</h3>
                            <button className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
                                <a href="/add-prescription" className="block w-full h-full">Add Now</a>
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-calendar-check text-7xl text-green-600 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">View Appointments</h3>
                            <button className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700">
                                <a href="/view-appointments" className="block w-full h-full">Check Now</a>
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-file-medical text-7xl text-purple-600 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">Patient Reports</h3>
                            <button className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700">
                                <a href="/reports" className="block w-full h-full">View Reports</a>
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-triangle-exclamation text-7xl text-red-600 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">Emergency Requests</h3>
                            <button className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700">
                                <a href="/emergency-requests" className="block w-full h-full">View Now</a>
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-calendar-day text-7xl text-yellow-500 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">Today's Appointments</h3>
                            <button className="w-full bg-yellow-500 text-white py-2 rounded-xl hover:bg-yellow-600">
                                <a href="/todays-appointment" className="block w-full h-full">View Now</a>
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-users text-7xl text-teal-600 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">Patient List</h3>
                            <button className="w-full bg-teal-600 text-white py-2 rounded-xl hover:bg-teal-700">
                                <a href="/patient-list" className="block w-full h-full">View List</a>
                            </button>
                        </div>

                    </div>

                </div>

                <footer className="text-center text-sm text-gray-500 p-5">
                    © 2025 Smart Medical System. All rights reserved.
                </footer>

            </div>
        </div>
    )
}

export default Doctor;