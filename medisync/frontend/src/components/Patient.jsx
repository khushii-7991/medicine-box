import React from 'react'

const Patient = () => {
    return (
        <div>
            <div className="bg-gray-50 min-h-screen font-sans">
                <nav className="bg-cyan-900 text-white p-5 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">🩺 Patient Dashboard</h1>
                    <a href="/" className="text-sm text-pink-900 hover:underline">Logout</a>
                </nav>

                <div className="max-w-7xl mx-auto py-12 px-6">

                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-cyan-800 mb-2">Welcome, Patient!</h2>
                        <p className="text-gray-600">Check prescriptions, book appointments, upload reports and track your health status here.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-notes-medical text-7xl text-pink-600 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">View Prescriptions</h3>
                            <a href="/view-prescriptions">
                                <button className="w-full bg-pink-600 text-white py-2 rounded-xl hover:bg-pink-700">Check Now</button>
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-calendar-plus text-7xl text-purple-600 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">Book Appointment</h3>
                            <a href="/book-appointment">
                                <button className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700">Book Now</button>
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-file-upload text-7xl text-blue-600 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">Upload Reports</h3>
                            <a href="/upload-reports">
                                <button className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">Upload</button>
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-bell text-7xl text-green-600 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">Health Reminders</h3>
                            <a href="/health-remainders">
                                <button className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700">View Reminders</button>
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-phone-volume text-7xl text-red-600 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">Emergency Help</h3>
                            <a href="/emergency-help">
                                <button className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700">Call Now</button>
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition hover:scale-105">
                            <i className="fa-solid fa-calendar-days text-7xl text-teal-600 mb-4 block text-center"></i>
                            <h3 className="text-xl font-semibold text-center mb-4">My Appointments</h3>
                            <a href="/my-appointments">
                                <button className="w-full bg-teal-600 text-white py-2 rounded-xl hover:bg-teal-700">View Appointments</button>
                            </a>
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

export default Patient;