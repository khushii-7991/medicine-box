import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-green-50 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-green-500 to-teal-500 transform -skew-y-6 -translate-y-20 z-0"></div>
            <div className="absolute bottom-0 right-0 w-full h-36 bg-gradient-to-r from-indigo-500 to-purple-500 transform skew-y-6 translate-y-16 z-0"></div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/5 w-4 h-4 bg-green-400 rounded-full animate-float opacity-60"></div>
                <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-indigo-400 rounded-full animate-float-slow opacity-60"></div>
                <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-purple-400 rounded-full animate-float-medium opacity-60"></div>
                <div className="absolute top-2/3 right-1/5 w-3 h-3 bg-blue-400 rounded-full animate-float opacity-60"></div>
                <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-teal-400 rounded-full animate-float-slow opacity-60"></div>
            </div>
            
            {/* Medical icons */}
            <div className="absolute top-20 right-20 animate-float-slow hidden lg:block">
                <div className="text-6xl text-green-300 opacity-40">💊</div>
            </div>
            <div className="absolute bottom-20 left-20 animate-float-medium hidden lg:block">
                <div className="text-6xl text-green-300 opacity-40">💉</div>
            </div>
            
            {/* Main content */}
            <div className="relative z-10 container mx-auto px-6 py-10 flex flex-col lg:flex-row items-center min-h-screen mt-10">
                {/* Left side - Hero content */}
                <div className="w-full lg:w-1/2 flex flex-col items-start space-y-7 mb-8 lg:mb-0">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl shadow-lg mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-700">
                            MediSync
                        </h1>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                        Your Personal <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Health Assistant</span>
                    </h2>
                    
                    <p className="text-xl text-gray-600 max-w-md">
                        Seamlessly manage your medications, appointments, and health records all in one place. Experience healthcare simplified.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <a href="/login/patient" className="px-7 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-green-200/50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span>Patient Login</span>
                        </a>
                        <a href="/login/doctor" className="px-7 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-200/50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span>Doctor Login</span>
                        </a>
                    </div>
                    
                    <div className="flex items-center gap-7 mt-6">
                        <div className="flex flex-col items-center">
                            <div className="text-2xl font-bold text-gray-800">24/7</div>
                            <div className="text-sm text-gray-600">Support</div>
                        </div>
                        <div className="h-10 w-px bg-gray-300"></div>
                        <div className="flex flex-col items-center">
                            <div className="text-2xl font-bold text-gray-800">100%</div>
                            <div className="text-sm text-gray-600">Secure</div>
                        </div>
                        <div className="h-10 w-px bg-gray-300"></div>
                        <div className="flex flex-col items-center">
                            <div className="text-2xl font-bold text-gray-800">Easy</div>
                            <div className="text-sm text-gray-600">To Use</div>
                        </div>
                    </div>
                </div>
                
                {/* Right side - Image */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-500 rounded-3xl blur-xl opacity-30 animate-pulse-slow"></div>
                        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            <img 
                                src="https://img.freepik.com/free-vector/medical-healthcare-protection-illustration_1302-3613.jpg" 
                                alt="Healthcare illustration" 
                                className="w-full h-auto max-w-lg object-cover"
                            />
                        </div>
                        
                        {/* Floating cards */}
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100 animate-float-slow">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-800">Medication Reminders</div>
                                    <div className="text-xs text-gray-500">Never miss a dose</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100 animate-float-medium">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-800">Easy Appointments</div>
                                    <div className="text-xs text-gray-500">Book in seconds</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-sm py-4 mt-6">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-600 font-medium mb-4 md:mb-0">
                            2025 MediSync | Smart Medical System
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Terms of Service</a>
                            <a href="#" className="text-sm text-gray-600 hover:text-green-600 transition-colors">Contact Us</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes float-slow {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes float-medium {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: float-slow 6s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float-medium 5s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Home;