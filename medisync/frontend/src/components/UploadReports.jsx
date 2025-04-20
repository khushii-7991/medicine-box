import React, { useState, useEffect } from 'react'

const UploadReports = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    const [availableDoctors, setAvailableDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Mock feedback data - replace with your actual API
    const [previousReports, setPreviousReports] = useState([
        {
            id: 1,
            patientName: 'John Doe',
            category: 'Blood Test',
            title: 'Complete Blood Count',
            date: '2024-02-15',
            doctor: 'Dr. Sarah Johnson',
            feedback: {
                summary: 'Patient shows mild anemia with slightly elevated white blood cell count.',
                findings: [
                    'Hemoglobin: 11.2 g/dL (Low)',
                    'WBC Count: 11,000/μL (Slightly Elevated)',
                    'Platelet Count: 250,000/μL (Normal)'
                ],
                recommendations: [
                    'Increase iron-rich foods in diet',
                    'Follow up blood test in 2 weeks',
                    'Consider iron supplements if symptoms persist'
                ],
                notes: 'Patient should monitor for fatigue and report any worsening symptoms.'
            }
        },
        {
            id: 2,
            patientName: 'John Doe',
            category: 'X-Ray',
            title: 'Chest X-Ray',
            date: '2024-01-20',
            doctor: 'Dr. Robert Wilson',
            feedback: {
                summary: 'Clear lungs with no signs of infection or abnormalities.',
                findings: [
                    'Normal lung fields',
                    'Clear costophrenic angles',
                    'Normal cardiac silhouette'
                ],
                recommendations: [
                    'No immediate follow-up required',
                    'Regular annual check-up recommended'
                ],
                notes: 'Patient has good lung health. Continue current lifestyle habits.'
            }
        }
    ]);

    const reportCategories = [
        { id: 1, name: 'Blood Test', description: 'Complete blood count, lipid profile, etc.' },
        { id: 2, name: 'X-Ray', description: 'Chest X-ray, bone X-ray, etc.' },
        { id: 3, name: 'MRI Scan', description: 'Brain MRI, spine MRI, etc.' },
        { id: 4, name: 'CT Scan', description: 'Head CT, abdominal CT, etc.' },
        { id: 5, name: 'Ultrasound', description: 'Abdominal ultrasound, pregnancy scan, etc.' },
        { id: 6, name: 'ECG', description: 'Electrocardiogram reports' },
        { id: 7, name: 'Urine Test', description: 'Urinalysis, culture reports' },
        { id: 8, name: 'Biopsy Report', description: 'Tissue sample analysis' },
        { id: 9, name: 'Pathology Report', description: 'Tissue and cell analysis' },
        { id: 10, name: 'Other', description: 'Other medical reports' }
    ];

    // Mock doctor data - replace with your actual API
    const doctorsByCategory = {
        'Blood Test': [
            { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Hematology', experience: '12 years', rating: 4.8 },
            { id: 2, name: 'Dr. Michael Chen', specialization: 'Pathology', experience: '8 years', rating: 4.7 }
        ],
        'X-Ray': [
            { id: 3, name: 'Dr. Robert Wilson', specialization: 'Radiology', experience: '15 years', rating: 4.9 },
            { id: 4, name: 'Dr. Emily Brown', specialization: 'Orthopedics', experience: '10 years', rating: 4.6 }
        ],
        'MRI Scan': [
            { id: 5, name: 'Dr. James Miller', specialization: 'Neuroradiology', experience: '14 years', rating: 4.9 },
            { id: 6, name: 'Dr. Lisa Anderson', specialization: 'Radiology', experience: '11 years', rating: 4.7 }
        ],
        'CT Scan': [
            { id: 7, name: 'Dr. David Lee', specialization: 'Radiology', experience: '13 years', rating: 4.8 },
            { id: 8, name: 'Dr. Maria Garcia', specialization: 'Oncology', experience: '9 years', rating: 4.6 }
        ],
        'Ultrasound': [
            { id: 9, name: 'Dr. Thomas White', specialization: 'Radiology', experience: '16 years', rating: 4.9 },
            { id: 10, name: 'Dr. Patricia Clark', specialization: 'Obstetrics', experience: '12 years', rating: 4.8 }
        ],
        'ECG': [
            { id: 11, name: 'Dr. Richard Taylor', specialization: 'Cardiology', experience: '18 years', rating: 4.9 },
            { id: 12, name: 'Dr. Jennifer Adams', specialization: 'Cardiology', experience: '10 years', rating: 4.7 }
        ],
        'Urine Test': [
            { id: 13, name: 'Dr. William Moore', specialization: 'Nephrology', experience: '15 years', rating: 4.8 },
            { id: 14, name: 'Dr. Susan Hall', specialization: 'Urology', experience: '11 years', rating: 4.6 }
        ],
        'Biopsy Report': [
            { id: 15, name: 'Dr. Charles King', specialization: 'Pathology', experience: '20 years', rating: 4.9 },
            { id: 16, name: 'Dr. Karen Scott', specialization: 'Oncology', experience: '14 years', rating: 4.8 }
        ],
        'Pathology Report': [
            { id: 17, name: 'Dr. Daniel Young', specialization: 'Pathology', experience: '16 years', rating: 4.9 },
            { id: 18, name: 'Dr. Nancy Allen', specialization: 'Pathology', experience: '12 years', rating: 4.7 }
        ],
        'Other': [
            { id: 19, name: 'Dr. Paul Turner', specialization: 'General Medicine', experience: '17 years', rating: 4.8 },
            { id: 20, name: 'Dr. Rebecca Martinez', specialization: 'General Medicine', experience: '13 years', rating: 4.7 }
        ]
    };

    useEffect(() => {
        if (selectedCategory) {
            setAvailableDoctors(doctorsByCategory[selectedCategory] || []);
            setSelectedDoctor(null);
        }
    }, [selectedCategory]);

    const filteredCategories = reportCategories.filter(category =>
        category.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <svg
                key={index}
                className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <div>
            <div class="bg-gray-50 min-h-screen font-sans">
                <nav class="bg-green-900 text-white p-5 flex justify-between items-center">
                    <h1 class="text-2xl font-bold">📄 Upload Reports</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Welcome, {userName}</span>
                    </div>
                </nav>

                <div class="max-w-4xl mx-auto py-12 px-6">
                    <h2 class="text-3xl font-bold text-green-800 mb-6 text-center">Upload Patient Report</h2>
                    <div class="space-y-8">
                        <form class="space-y-5 bg-white p-6 rounded-2xl shadow-xl max-w-2xl mx-auto">
                            <div>
                                <label class="block text-gray-700">Patient Name</label>
                                <input type="text" placeholder="Enter patient name" class="w-full border rounded-lg p-3" />
                            </div>

                            <div class="relative">
                                <label class="block text-gray-700">Report Category</label>
                                <div class="relative">
                                    <input
                                        type="text"
                                        value={categorySearch}
                                        placeholder="Select report category..."
                                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                        class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
                                        readOnly
                                    />
                                    {showCategoryDropdown && (
                                        <div class="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                            <div class="p-2 border-b">
                                                <input
                                                    type="text"
                                                    placeholder="Search category..."
                                                    value={categorySearch}
                                                    onChange={(e) => setCategorySearch(e.target.value)}
                                                    class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div class="max-h-60 overflow-y-auto">
                                                {filteredCategories.map((category) => (
                                                    <div
                                                        key={category.id}
                                                        onClick={() => {
                                                            setSelectedCategory(category.name);
                                                            setCategorySearch(category.name);
                                                            setShowCategoryDropdown(false);
                                                        }}
                                                        class="p-3 hover:bg-green-50 cursor-pointer"
                                                    >
                                                        <div class="font-medium">{category.name}</div>
                                                        <div class="text-sm text-gray-600">{category.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Available Doctors Section - Moved here */}
                            {selectedCategory && (
                                <div class="space-y-3">
                                    <label class="block text-gray-700">Available Doctors</label>
                                    <div class="space-y-3">
                                        {availableDoctors.map((doctor) => (
                                            <div
                                                key={doctor.id}
                                                onClick={() => setSelectedDoctor(doctor)}
                                                class={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                    selectedDoctor?.id === doctor.id
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'hover:border-green-300'
                                                }`}
                                            >
                                                <div class="flex items-center justify-between">
                                                    <div>
                                                        <h4 class="font-semibold">{doctor.name}</h4>
                                                        <p class="text-sm text-gray-600">{doctor.specialization}</p>
                                                        <p class="text-sm text-gray-600">{doctor.experience} experience</p>
                                                    </div>
                                                    <div class="flex items-center">
                                                        {renderStars(doctor.rating)}
                                                        <span class="ml-1 text-sm text-gray-600">({doctor.rating})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {selectedDoctor && (
                                        <div class="p-3 bg-green-50 rounded-lg">
                                            <p class="text-green-800">
                                                Selected: <span class="font-semibold">{selectedDoctor.name}</span>
                                            </p>
                                            <p class="text-sm text-gray-600 mt-1">
                                                {selectedDoctor.specialization} • {selectedDoctor.experience} experience
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                <label class="block text-gray-700">Report Title</label>
                                <input type="text" placeholder="Enter report title" class="w-full border rounded-lg p-3" />
                            </div>

                            <div>
                                <label class="block text-gray-700">Upload File</label>
                                <input type="file" class="w-full border rounded-lg p-3" />
                            </div>

                            <button type="submit" class="w-full bg-green-900 text-white py-3 rounded-xl hover:bg-green-800">Upload</button>
                        </form>

                        {/* Previous Reports Section */}
                        <div class="bg-white p-6 rounded-2xl shadow-xl max-w-2xl mx-auto">
                            <h3 class="text-xl font-bold text-green-800 mb-4 text-center">Previous Reports & Feedback</h3>
                            <div class="space-y-6">
                                {previousReports.map((report) => (
                                    <div key={report.id} class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div class="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 class="font-semibold text-lg">{report.title}</h4>
                                                <p class="text-sm text-gray-600">
                                                    {report.category} • {report.date}
                                                </p>
                                            </div>
                                            <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                                Reviewed by {report.doctor}
                                            </span>
                                        </div>

                                        <div class="space-y-4">
                                            <div>
                                                <h5 class="font-medium text-gray-700 mb-1">Summary</h5>
                                                <p class="text-sm text-gray-600">{report.feedback.summary}</p>
                                            </div>

                                            <div>
                                                <h5 class="font-medium text-gray-700 mb-1">Findings</h5>
                                                <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                    {report.feedback.findings.map((finding, index) => (
                                                        <li key={index}>{finding}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h5 class="font-medium text-gray-700 mb-1">Recommendations</h5>
                                                <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                    {report.feedback.recommendations.map((rec, index) => (
                                                        <li key={index}>{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {report.feedback.notes && (
                                                <div>
                                                    <h5 class="font-medium text-gray-700 mb-1">Additional Notes</h5>
                                                    <p class="text-sm text-gray-600">{report.feedback.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <footer class="text-center text-sm text-gray-500 p-5">
                    © 2025 Smart Medical System. All rights reserved.
                </footer>
            </div>
        </div>
    )
}

export default UploadReports