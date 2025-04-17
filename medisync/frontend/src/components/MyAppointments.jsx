import React from 'react'

const MyAppointments = () => {
    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">

                <nav class="bg-cyan-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl font-bold">📋 My Appointments</h1>
                    <a href="/" class="text-sm hover:underline">Logout</a>
                </nav>

                <div class="max-w-4xl mx-auto py-12 px-6">
                    <h2 class="text-3xl font-bold text-cyan-800 mb-6">Your Appointments</h2>
                    <div class="bg-white rounded-xl shadow-xl p-6 space-y-4">
                        <div class="flex justify-between border-b pb-4">
                            <div>
                                <h3 class="font-semibold text-lg">Routine Checkup</h3>
                                <p class="text-gray-500 text-sm">Date: 15 Apr 2025 | Time: 10:00 AM</p>
                            </div>
                            <span class="text-green-600 font-semibold">Confirmed</span>
                        </div>
                        <div class="flex justify-between border-b pb-4">
                            <div>
                                <h3 class="font-semibold text-lg">X-Ray Review</h3>
                                <p class="text-gray-500 text-sm">Date: 16 Apr 2025 | Time: 03:00 PM</p>
                            </div>
                            <span class="text-yellow-600 font-semibold">Pending</span>
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

export default MyAppointments