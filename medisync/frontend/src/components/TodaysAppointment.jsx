import React from 'react'

const TodaysAppointment = () => {
    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">

                <nav class="bg-cyan-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl font-bold">📅 Today's Appointments</h1>
                    <a href="/" class="text-sm hover:underline">Logout</a>
                </nav>

                <div class="max-w-7xl mx-auto py-12 px-6">

                    <div class="text-center mb-10">
                        <h2 class="text-4xl font-bold text-blue-800 mb-2">Today's Appointments</h2>
                        <p class="text-gray-600">Manage and check today's scheduled appointments.</p>
                    </div>

                    <div class="overflow-x-auto shadow-xl rounded-2xl">
                        <table class="min-w-full bg-white border-collapse">
                            <thead class="bg-cyan-900 text-white">
                                <tr>
                                    <th class="py-3 px-4 text-left">Patient Name</th>
                                    <th class="py-3 px-4 text-left">Appointment Time</th>
                                    <th class="py-3 px-4 text-left">Reason</th>
                                    <th class="py-3 px-4 text-left">Status</th>
                                    <th class="py-3 px-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-t">
                                    <td class="py-3 px-4">John Doe</td>
                                    <td class="py-3 px-4">10:00 AM</td>
                                    <td class="py-3 px-4">Routine Checkup</td>
                                    <td class="py-3 px-4 text-green-600">Confirmed</td>
                                    <td class="py-3 px-4 text-center">
                                        <button class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">View</button>
                                    </td>
                                </tr>
                                <tr class="border-t">
                                    <td class="py-3 px-4">Jane Roe</td>
                                    <td class="py-3 px-4">11:30 AM</td>
                                    <td class="py-3 px-4">Blood Pressure Check</td>
                                    <td class="py-3 px-4 text-yellow-600">Pending</td>
                                    <td class="py-3 px-4 text-center">
                                        <button class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">View</button>
                                    </td>
                                </tr>
                                <tr class="border-t">
                                    <td class="py-3 px-4">Michael Lee</td>
                                    <td class="py-3 px-4">02:00 PM</td>
                                    <td class="py-3 px-4">Consultation</td>
                                    <td class="py-3 px-4 text-red-600">Cancelled</td>
                                    <td class="py-3 px-4 text-center">
                                        <button class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">View</button>
                                    </td>
                                </tr>
                                <tr class="border-t">
                                    <td class="py-3 px-4">Emily Scott</td>
                                    <td class="py-3 px-4">03:30 PM</td>
                                    <td class="py-3 px-4">X-Ray</td>
                                    <td class="py-3 px-4 text-green-600">Confirmed</td>
                                    <td class="py-3 px-4 text-center">
                                        <button class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">View</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                <footer class="text-center text-sm text-gray-500 p-5">
                    © 2025 Smart Medical System. All rights reserved.
                </footer>

            </div>
        </div>
    )
}

export default TodaysAppointment