import React from 'react'

const ViewAppointments = () => {
    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">

                <nav class="bg-cyan-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl font-bold">📅 View Appointments</h1>
                    <a href="/" class="text-sm hover:underline">Logout</a>
                </nav>

                <div class="max-w-5xl mx-auto py-12 px-6">
                    <h2 class="text-3xl font-bold text-cyan-800 mb-6">All Scheduled Appointments</h2>
                    <table class="min-w-full bg-white border-collapse rounded-xl shadow-xl">
                        <thead class="bg-cyan-900 text-white">
                            <tr>
                                <th class="py-3 px-4 text-left">Patient</th>
                                <th class="py-3 px-4 text-left">Date</th>
                                <th class="py-3 px-4 text-left">Time</th>
                                <th class="py-3 px-4 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-t">
                                <td class="py-3 px-4">John Doe</td>
                                <td class="py-3 px-4">15 Apr 2025</td>
                                <td class="py-3 px-4">10:00 AM</td>
                                <td class="py-3 px-4 text-green-600">Confirmed</td>
                            </tr>
                            <tr class="border-t">
                                <td class="py-3 px-4">Emily Scott</td>
                                <td class="py-3 px-4">16 Apr 2025</td>
                                <td class="py-3 px-4">03:30 PM</td>
                                <td class="py-3 px-4 text-yellow-600">Pending</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <footer class="text-center text-sm text-gray-500 p-5">
                    © 2025 Smart Medical System. All rights reserved.
                </footer>

            </div>

        </div>
    )
}

export default ViewAppointments