import React from 'react'

const AddPrescription = () => {
    return (
        <div class="bg-gray-50 min-h-screen font-sans">

            <nav class="bg-cyan-900 text-white p-5 flex justify-between items-center">
                <h1 class="text-2xl font-bold">👨‍⚕️ Smart Medical System</h1>
                <a href="/" class="text-sm hover:underline">Logout</a>
            </nav>

            <div class="max-w-xl mx-auto py-12 px-6">
                <h2 class="text-3xl font-bold text-cyan-800 mb-6 text-center">Add Prescription</h2>

                <form class="bg-white p-8 rounded-2xl shadow-xl space-y-6">

                    <div>
                        <label class="block font-medium text-gray-700 mb-1">Medicine Name</label>
                        <input type="text" placeholder="Enter medicine name" class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700 mb-1">Dosage Time</label>
                        <input type="text" placeholder="Eg. 1-0-1 or Morning & Night" class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700 mb-1">When to take</label>
                        <select class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option>Select option</option>
                            <option>Before Meal</option>
                            <option>After Meal</option>
                        </select>
                    </div>

                    <div>
                        <label class="block font-medium text-gray-700 mb-1">Till When (End Date)</label>
                        <input type="date" class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>

                    <button type="submit" class="w-full bg-cyan-800 text-white font-medium py-3 rounded-xl hover:bg-cyan-900 transition">Add Prescription</button>

                </form>
            </div>

            <footer class="text-center text-sm text-gray-500 p-5">
                © 2025 Smart Medical System. All rights reserved.
            </footer>

        </div>
    )
}

export default AddPrescription