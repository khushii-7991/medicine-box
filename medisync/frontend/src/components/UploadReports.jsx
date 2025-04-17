import React from 'react'

const UploadReports = () => {
    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">

                <nav class="bg-cyan-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl font-bold">📄 Upload Reports</h1>
                    <a href="/" class="text-sm hover:underline">Logout</a>
                </nav>

                <div class="max-w-xl mx-auto py-12 px-6">
                    <h2 class="text-3xl font-bold text-cyan-800 mb-6">Upload Patient Report</h2>
                    <form class="space-y-5">
                        <div>
                            <label class="block text-gray-700">Patient Name</label>
                            <input type="text" placeholder="Enter patient name" class="w-full border rounded-lg p-3" />
                        </div>
                        <div>
                            <label class="block text-gray-700">Report Title</label>
                            <input type="text" placeholder="Enter report title" class="w-full border rounded-lg p-3" />
                        </div>
                        <div>
                            <label class="block text-gray-700">Upload File</label>
                            <input type="file" class="w-full border rounded-lg p-3" />
                        </div>
                        <button type="submit" class="w-full bg-cyan-900 text-white py-3 rounded-xl hover:bg-cyan-800">Upload</button>
                    </form>
                </div>

                <footer class="text-center text-sm text-gray-500 p-5">
                    © 2025 Smart Medical System. All rights reserved.
                </footer>

            </div>
        </div>
    )
}

export default UploadReports