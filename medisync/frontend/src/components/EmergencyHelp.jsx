import React from 'react'

const EmergencyHelp = () => {
    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">

                <nav class="bg-cyan-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl font-bold">🚨 Emergency Help</h1>
                    <a href="/" class="text-sm hover:underline">Logout</a>
                </nav>

                <div class="max-w-xl mx-auto py-12 px-6 text-center">
                    <h2 class="text-3xl font-bold text-red-600 mb-6">Need Immediate Assistance?</h2>
                    <p class="mb-8 text-gray-600">Click the button below to send an emergency alert.</p>
                    <button class="bg-red-600 text-white text-lg py-4 px-8 rounded-xl hover:bg-red-700">Send Emergency Alert</button>
                </div>

                <footer class="text-center text-sm text-gray-500 p-5">
                    © 2025 Smart Medical System. All rights reserved.
                </footer>

            </div>
        </div>
    )
}

export default EmergencyHelp