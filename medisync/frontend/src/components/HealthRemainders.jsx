import React from 'react'

const HealthRemainders = () => {
    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">

                <nav class="bg-cyan-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl font-bold">⏰ Health Reminders</h1>
                    <a href="/" class="text-sm hover:underline">Logout</a>
                </nav>

                <div class="max-w-xl mx-auto py-12 px-6">
                    <h2 class="text-3xl font-bold text-cyan-800 mb-6">Set a New Reminder</h2>
                    <form class="space-y-5">
                        <div>
                            <label class="block text-gray-700">Reminder Title</label>
                            <input type="text" class="w-full border rounded-lg p-3" placeholder="e.g. Take Medicine" />
                        </div>
                        <div>
                            <label class="block text-gray-700">Time</label>
                            <input type="time" class="w-full border rounded-lg p-3" />
                        </div>
                        <button class="w-full bg-cyan-900 text-white py-3 rounded-xl hover:bg-cyan-800">Add Reminder</button>
                    </form>
                </div>

                <footer class="text-center text-sm text-gray-500 p-5">
                    © 2025 Smart Medical System. All rights reserved.
                </footer>

            </div>
        </div>
    )
}

export default HealthRemainders