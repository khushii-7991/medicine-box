import React from 'react'

const Reports = () => {
    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">

                <nav class="bg-cyan-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl font-bold">👨‍⚕️ Patient Reports</h1>
                    <a href="/" class="text-sm hover:underline">Logout</a>
                </nav>

                <div class="max-w-7xl mx-auto py-12 px-6">

                    <div class="text-center mb-10">
                        <h2 class="text-4xl font-bold text-blue-800 mb-2">Patient Reports</h2>
                        <p class="text-gray-600">View and download patient reports from here.</p>
                    </div>

                    <div class="overflow-x-auto shadow-xl rounded-2xl">
                        <table class="min-w-full bg-white border-collapse">
                            <thead class="bg-cyan-900 text-white">
                                <tr>
                                    <th class="py-3 px-4 text-left">Patient Name</th>
                                    <th class="py-3 px-4 text-left">Report Type</th>
                                    <th class="py-3 px-4 text-left">Date</th>
                                    <th class="py-3 px-4 text-left">Doctor Name</th>
                                    <th class="py-3 px-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-t">
                                    <td class="py-3 px-4">John Doe</td>
                                    <td class="py-3 px-4">Blood Test</td>
                                    <td class="py-3 px-4">April 12, 2025</td>
                                    <td class="py-3 px-4">Dr. Smith</td>
                                    <td class="py-3 px-4 text-center">
                                        <button class="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700">View</button>
                                    </td>
                                </tr>
                                <tr class="border-t">
                                    <td class="py-3 px-4">Jane Roe</td>
                                    <td class="py-3 px-4">X-Ray</td>
                                    <td class="py-3 px-4">April 10, 2025</td>
                                    <td class="py-3 px-4">Dr. Taylor</td>
                                    <td class="py-3 px-4 text-center">
                                        <button class="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700">View</button>
                                    </td>
                                </tr>
                                <tr class="border-t">
                                    <td class="py-3 px-4">Michael Lee</td>
                                    <td class="py-3 px-4">ECG</td>
                                    <td class="py-3 px-4">April 5, 2025</td>
                                    <td class="py-3 px-4">Dr. Patel</td>
                                    <td class="py-3 px-4 text-center">
                                        <button class="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700">View</button>
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

export default Reports