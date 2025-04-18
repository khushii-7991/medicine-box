import React, { useState } from 'react';
import { FiDownload, FiFilter, FiSearch, FiEye, FiShare2, FiPrinter, FiCalendar, FiUser, FiFileText } from 'react-icons/fi';

const Reports = () => {
    // Sample report data - in a real app, this would come from an API
    const [reports, setReports] = useState([
        {
            id: 1,
            patientName: "John Doe",
            patientImage: "https://randomuser.me/api/portraits/men/32.jpg",
            patientId: "PT-10045",
            reportType: "Blood Test",
            category: "laboratory",
            date: "2025-04-12",
            doctor: "Dr. Emily Smith",
            status: "normal",
            summary: "All values within normal range. Cholesterol slightly elevated but within acceptable limits.",
            fileSize: "2.4 MB",
            fileType: "PDF"
        },
        {
            id: 2,
            patientName: "Jane Smith",
            patientImage: "https://randomuser.me/api/portraits/women/44.jpg",
            patientId: "PT-10089",
            reportType: "X-Ray (Chest)",
            category: "radiology",
            date: "2025-04-10",
            doctor: "Dr. Michael Taylor",
            status: "abnormal",
            summary: "Small opacity detected in lower right lung. Follow-up recommended in 2 weeks.",
            fileSize: "8.7 MB",
            fileType: "DICOM"
        },
        {
            id: 3,
            patientName: "Michael Lee",
            patientImage: "https://randomuser.me/api/portraits/men/15.jpg",
            patientId: "PT-10132",
            reportType: "ECG",
            category: "cardiology",
            date: "2025-04-05",
            doctor: "Dr. Sarah Patel",
            status: "critical",
            summary: "Irregular heartbeat detected. Immediate cardiology consultation recommended.",
            fileSize: "1.2 MB",
            fileType: "PDF"
        },
        {
            id: 4,
            patientName: "Emily Wilson",
            patientImage: "https://randomuser.me/api/portraits/women/67.jpg",
            patientId: "PT-10156",
            reportType: "MRI (Brain)",
            category: "radiology",
            date: "2025-04-08",
            doctor: "Dr. James Wilson",
            status: "normal",
            summary: "No abnormalities detected. All structures appear normal.",
            fileSize: "15.6 MB",
            fileType: "DICOM"
        },
        {
            id: 5,
            patientName: "Robert Johnson",
            patientImage: "https://randomuser.me/api/portraits/men/92.jpg",
            patientId: "PT-10178",
            reportType: "Liver Function Test",
            category: "laboratory",
            date: "2025-04-15",
            doctor: "Dr. Lisa Wong",
            status: "abnormal",
            summary: "Elevated ALT and AST levels. Further investigation recommended.",
            fileSize: "1.8 MB",
            fileType: "PDF"
        }
    ]);

    // State for search, filtering, and selected report
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);
    
    // Filter reports based on search term and active filter
    const filteredReports = reports.filter(report => {
        // Search filter
        const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             report.doctor.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category filter
        const matchesFilter = activeFilter === 'all' || 
                             report.category === activeFilter ||
                             (activeFilter === 'critical' && report.status === 'critical');
        
        return matchesSearch && matchesFilter;
    });

    // Format date to be more readable
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    
    // Get status badge styling
    const getStatusBadge = (status) => {
        switch(status) {
            case 'normal':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'abnormal':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    // Get category icon
    const getCategoryIcon = (category) => {
        switch(category) {
            case 'laboratory':
                return <div className="bg-purple-100 p-3 rounded-full"><FiFileText className="h-6 w-6 text-purple-600" /></div>;
            case 'radiology':
                return <div className="bg-blue-100 p-3 rounded-full"><FiEye className="h-6 w-6 text-blue-600" /></div>;
            case 'cardiology':
                return <div className="bg-red-100 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg></div>;
            default:
                return <div className="bg-gray-100 p-3 rounded-full"><FiFileText className="h-6 w-6 text-gray-600" /></div>;
        }
    };

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 animate-fadeIn">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Patient Reports
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    View, analyze, and manage all patient medical reports.
                </p>
            </div>

            {/* Search and filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search by patient name, report type, or doctor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setActiveFilter('all')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeFilter === 'all' 
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        All Reports
                    </button>
                    <button 
                        onClick={() => setActiveFilter('laboratory')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeFilter === 'laboratory' 
                                ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Laboratory
                    </button>
                    <button 
                        onClick={() => setActiveFilter('radiology')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeFilter === 'radiology' 
                                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Radiology
                    </button>
                    <button 
                        onClick={() => setActiveFilter('cardiology')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeFilter === 'cardiology' 
                                ? 'bg-red-100 text-red-700 border border-red-300' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Cardiology
                    </button>
                    <button 
                        onClick={() => setActiveFilter('critical')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                            activeFilter === 'critical' 
                                ? 'bg-red-100 text-red-700 border border-red-300' 
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Critical
                    </button>
                </div>
            </div>

            {/* Main content - split view */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Reports list */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-medium text-gray-700">{filteredReports.length}</span> of <span className="font-medium text-gray-700">{reports.length}</span> reports
                            </p>
                        </div>
                        
                        <ul className="divide-y divide-gray-200">
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <li 
                                        key={report.id} 
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${selectedReport?.id === report.id ? 'bg-indigo-50' : ''}`}
                                        onClick={() => setSelectedReport(report)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                {getCategoryIcon(report.category)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {report.reportType}
                                                    </p>
                                                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusBadge(report.status)}`}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center mt-1">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        <img className="h-8 w-8 rounded-full" src={report.patientImage} alt="" />
                                                    </div>
                                                    <div className="ml-2">
                                                        <p className="text-sm text-gray-700 truncate">{report.patientName}</p>
                                                        <p className="text-xs text-gray-500 truncate">{report.patientId}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <FiCalendar className="mr-1 h-3 w-3" />
                                                        <span>{formatDate(report.date)}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <FiUser className="mr-1 h-3 w-3" />
                                                        <span>{report.doctor}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="p-8 text-center text-gray-500">
                                    No reports found matching your criteria.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Report details */}
                <div className="w-full lg:w-1/3">
                    {selectedReport ? (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedReport.reportType}</h3>
                                    <p className="text-sm text-gray-500">{formatDate(selectedReport.date)}</p>
                                </div>
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(selectedReport.status)}`}>
                                    {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                                </span>
                            </div>
                            
                            <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
                                <img className="h-12 w-12 rounded-full object-cover mr-4" src={selectedReport.patientImage} alt="" />
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">{selectedReport.patientName}</h4>
                                    <p className="text-sm text-gray-600">{selectedReport.patientId}</p>
                                </div>
                            </div>
                            
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Report Summary</h5>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">{selectedReport.summary}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Doctor</p>
                                    <p className="text-sm font-medium">{selectedReport.doctor}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Category</p>
                                    <p className="text-sm font-medium capitalize">{selectedReport.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">File Type</p>
                                    <p className="text-sm font-medium">{selectedReport.fileType}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">File Size</p>
                                    <p className="text-sm font-medium">{selectedReport.fileSize}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                                    <FiDownload className="h-4 w-4" />
                                    <span>Download</span>
                                </button>
                                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
                                    <FiPrinter className="h-4 w-4" />
                                    <span>Print</span>
                                </button>
                                <button className="flex-none border border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                    <FiShare2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-full flex flex-col items-center justify-center text-center">
                            <div className="bg-indigo-100 p-4 rounded-full mb-4">
                                <FiFileText className="h-10 w-10 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Selected</h3>
                            <p className="text-gray-500">Select a report from the list to view details.</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Reports;