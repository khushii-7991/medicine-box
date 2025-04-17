import React from 'react'

const BookAppointment = () => {
    return (
        <div class="bg-gray-50 min-h-screen font-sans">

            <nav class="bg-cyan-900 text-white p-5 flex justify-between items-center">
                <h1 class="text-2xl font-bold">📅 Book Appointment</h1>
                <a href="patient_dashboard.html" class="text-sm hover:underline">Back to Dashboard</a>
            </nav>

            <div class="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-12">
                <h2 class="text-3xl font-bold text-center text-cyan-800 mb-6">Book a New Appointment</h2>

                <form action="#" method="POST" class="space-y-5">

                    <div>
                        <label class="block mb-2 font-semibold">Your Name</label>
                        <input type="text" name="patient_name" placeholder="Enter your name" required
                            class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-600" />
                    </div>

                    <div>
                        <label class="block mb-2 font-semibold">Select Category</label>
                        <select name="category" required
                            class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-600">
                            <option value="" disabled selected>Select a category</option>
                            <option value="General Physician">General Physician</option>
                            <option value="Dentist">Dentist</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                        </select>
                    </div>

                    <div>
                        <label class="block mb-2 font-semibold">Prefer Location</label>
                        <select name="location" required
                            class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-600">
                            <option value="" disabled selected>Select location</option>
                            <option value="Bhopal">Bhopal</option>
                            <option value="Indore">Indore</option>
                            <option value="Jabalpur">Jabalpur</option>
                            <option value="Gwalior">Gwalior</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label class="block mb-2 font-semibold">Select Date</label>
                        <input type="date" name="date" required
                            class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-600" />
                    </div>

                    <div>
                        <label class="block mb-2 font-semibold">Select Time</label>
                        <input type="time" name="time" required
                            class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-600" />
                    </div>

                    <div>
                        <button type="submit"
                            class="w-full bg-cyan-800 text-white py-3 rounded-xl text-lg hover:bg-cyan-900 transition">Book Appointment</button>
                    </div>

                </form>
            </div>

            <footer class="text-center text-sm text-gray-500 p-5 mt-10">
                © 2025 Smart Medical System. All rights reserved.
            </footer>

        </div>
    )
}

export default BookAppointment