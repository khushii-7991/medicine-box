import React from 'react'

const ViewPrescriptions = () => {
    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">

                <nav class="bg-cyan-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl font-bold">💊 View Prescriptions</h1>
                    <a href="/" class="text-sm hover:underline">Logout</a>
                </nav>

                <div class="max-w-6xl mx-auto py-10 px-5">
                    <h2 class="text-3xl font-bold text-cyan-800 mb-6">Your Prescriptions</h2>

                    <div class="overflow-x-auto shadow-xl rounded-2xl">
                        <table class="min-w-full bg-white border-collapse">
                            <thead class="bg-cyan-900 text-white">
                                <tr>
                                    <th class="py-3 px-4 text-left">Medicine</th>
                                    <th class="py-3 px-4 text-left">Dosage</th>
                                    <th class="py-3 px-4 text-left">Meal Timing</th>
                                    <th class="py-3 px-4 text-left">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-t">
                                    <td class="py-3 px-4">Paracetamol</td>
                                    <td class="py-3 px-4">2 Times a Day</td>
                                    <td class="py-3 px-4">After Meal</td>
                                    <td class="py-3 px-4">5 Days</td>
                                </tr>
                                <tr class="border-t">
                                    <td class="py-3 px-4">Vitamin C</td>
                                    <td class="py-3 px-4">Once a Day</td>
                                    <td class="py-3 px-4">Before Meal</td>
                                    <td class="py-3 px-4">10 Days</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ViewPrescriptions