import React from 'react'

const EmergencyReports = () => {
    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">

                <nav class="bg-green-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl font-bold">🩺 Doctor Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Welcome, {userName}</span>
                    </div>
                </nav>

                <div class="max-w-6xl mx-auto py-12 px-6">

                    <div class="text-center mb-10">
                        <h2 class="text-4xl font-bold text-green-800 mb-2">Emergency Requests</h2>
                        <p class="text-gray-600">Review and respond to patient emergencies instantly.</p>
                    </div>

                    <div class="space-y-6">

                        <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center">
                            <div>
                                <h3 class="text-xl font-semibold text-gray-800">Patient: Riya Sharma</h3>
                                <p class="text-gray-500 text-sm">Time: 14 Apr 2025, 09:45 AM</p>
                                <p class="text-red-600 mt-2 font-medium">Condition: Severe chest pain</p>
                            </div>
                            <div class="mt-4 md:mt-0 flex space-x-4">
                                <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                    Accept
                                </button>
                                <button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                                    Decline
                                </button>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center">
                            <div>
                                <h3 class="text-xl font-semibold text-gray-800">Patient: Aryan Verma</h3>
                                <p class="text-gray-500 text-sm">Time: 14 Apr 2025, 08:30 AM</p>
                                <p class="text-red-600 mt-2 font-medium">Condition: High fever & vomiting</p>
                            </div>
                            <div class="mt-4 md:mt-0 flex space-x-4">
                                <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                                    Accept
                                </button>
                                <button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                                    Decline
                                </button>
                            </div>
                        </div>

                    </div>

                </div>

                <footer class="text-center text-sm text-gray-500 p-5">
                    © 2025 Smart Medical System. All rights reserved.
                </footer>

            </div>
        </div>
    )
}

export default EmergencyReports