import React from 'react'

const PatientList = () => {
    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">

                <nav class="bg-cyan-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl text-cyan font-bold">👨‍⚕️ Patient List</h1>
                    <a href="/" class="text-sm hover:underline">Logout</a>
                </nav>

                <div class="max-w-7xl mx-auto py-12 px-6">

                    <div class="text-center mb-10">
                        <h2 class="text-4xl font-bold text-cyan-800 mb-2">Patient List</h2>
                        <p class="text-gray-600">View and manage patient details.</p>
                    </div>

                    <div class="overflow-x-auto shadow-xl rounded-2xl">
                        <table class="min-w-full bg-white border-collapse">
                            <thead class="text-white">
                                <tr>
                                    <th class="py-3 px-4 text-left">Patient Name</th>
                                    <th class="py-3 px-4 text-left">Age</th>
                                    <th class="py-3 px-4 text-left">Gender</th>
                                    <th class="py-3 px-4 text-left">Phone Number</th>
                                    <th class="py-3 px-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-t">
                                    <td class="py-3 px-4">John Doe</td>
                                    <td class="py-3 px-4">45</td>
                                    <td class="py-3 px-4">Male</td>
                                    <td class="py-3 px-4">+1234567890</td>
                                    <td class="py-3 px-4 text-center">
                                        <button class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">View</button>
                                    </td>
                                </tr>
                                <tr class="border-t">
                                    <td class="py-3 px-4">Jane Roe</td>
                                    <td class="py-3 px-4">30</td>
                                    <td class="py-3 px-4">Female</td>
                                    <td class="py-3 px-4">+0987654321</td>
                                    <td class="py-3 px-4 text-center">
                                        <button class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">View</button>
                                    </td>
                                </tr>
                                <tr class="border-t">
                                    <td class="py-3 px-4">Michael Lee</td>
                                    <td class="py-3 px-4">60</td>
                                    <td class="py-3 px-4">Male</td>
                                    <td class="py-3 px-4">+1122334455</td>
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

export default PatientList