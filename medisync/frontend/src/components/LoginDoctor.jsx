import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const LoginDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    speciality: '',
    city: '',
    hospital: '',
    experience: 0,
    consultationFee: 0,
  });
  const [hospitals, setHospitals] = useState([]);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check if there's a redirect path from a protected route
  const from = location.state?.from || '/doctor-profile';

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('doctorToken');
    if (token) {
      toast.success('Already logged in as doctor');
      navigate('/doctor-profile');
    }

    // Fetch hospitals from the database
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/hospital');
        setHospitals(response.data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    fetchHospitals();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? '/doctor/signup' : '/doctor/login';
      const loadingToast = toast.loading(isSignup ? 'Creating account...' : 'Logging in...');

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("data", data);
      console.log("response", response);

      toast.dismiss(loadingToast);

      if (!response.ok) {
        toast.error(data.message || 'Something went wrong');
        throw new Error(data.message || 'Something went wrong');
      }

      if (response.ok) {
        if (!isSignup) {
          localStorage.setItem('doctorToken', data.token);
          localStorage.setItem('doctorData', JSON.stringify(data.user));
          toast.success('Login successful!');
        }
        if (isSignup) {
          setIsSignup(false);
          toast.success('Registration successful! Please login.');
          setFormData({
            name: '',
            email: '',
            password: '',
            speciality: '',
            city: '',
            hospital: '',
            experience: 0,
            consultationFee: 0,
          });
          return;
        }
        navigate(from);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-blue-500 to-indigo-600 transform -skew-y-6 -translate-y-20 z-0"></div>
      <div className="absolute bottom-0 right-0 w-full h-40 bg-gradient-to-r from-cyan-500 to-blue-500 transform skew-y-6 translate-y-20 z-0"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-4 h-4 bg-blue-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-indigo-400 rounded-full animate-float-slow opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-cyan-400 rounded-full animate-float-medium opacity-60"></div>
        <div className="absolute top-2/3 right-1/5 w-3 h-3 bg-blue-400 rounded-full animate-float opacity-60"></div>
      </div>

      {/* Medical icon */}
      <div className="absolute top-20 right-20 animate-float-slow hidden lg:block">
        <div className="text-6xl text-blue-300 opacity-40">👨‍⚕️</div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-30 animate-pulse-slow"></div>

          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-white/20 p-3 rounded-xl mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">
                  {isSignup ? 'Doctor Sign Up' : 'Doctor Login'}
                </h2>
              </div>
              <p className="text-center text-blue-100">
                {isSignup
                  ? 'Create your account to join our medical platform'
                  : 'Welcome back! Please login to your account'}
              </p>
            </div>

            {/* Form content */}
            <div className="p-8">
              {error && (
                <div className={`p-4 rounded-lg mb-6 text-center ${error.includes('successful') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignup && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-gray-700 text-sm font-semibold">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Dr. John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-700 text-sm font-semibold">
                        Speciality
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="speciality"
                          value={formData.speciality}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Cardiologist, Neurologist, etc."
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-700 text-sm font-semibold">
                        City
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Mumbai, Delhi, etc."
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-700 text-sm font-semibold">
                        Hospital
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={hospitalSearch}
                          onClick={() => setShowHospitalDropdown(!showHospitalDropdown)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                          placeholder="Select a hospital"
                          readOnly
                          required
                        />
                        {showHospitalDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                            <div className="p-2 border-b">
                              <input
                                type="text"
                                placeholder="Search hospitals..."
                                value={hospitalSearch}
                                onChange={(e) => setHospitalSearch(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              {hospitals
                                .filter(hospital => 
                                  hospital.name.toLowerCase().includes(hospitalSearch.toLowerCase())
                                )
                                .map((hospital) => (
                                  <div
                                    key={hospital._id}
                                    onClick={() => {
                                      setFormData({ ...formData, hospital: hospital._id });
                                      setHospitalSearch(hospital.name);
                                      setShowHospitalDropdown(false);
                                    }}
                                    className="p-3 hover:bg-blue-50 cursor-pointer"
                                  >
                                    <div className="font-medium">{hospital.name}</div>
                                    <div className="text-sm text-gray-600">{hospital.city}, {hospital.address}</div>
                                    <div className="text-xs text-gray-500">Contact: {hospital.contactNumber}</div>
                                  </div>
                                ))}
                              {hospitals.filter(hospital => 
                                hospital.name.toLowerCase().includes(hospitalSearch.toLowerCase())
                              ).length === 0 && (
                                <div className="p-3 text-center text-gray-500">
                                  No hospitals found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-700 text-sm font-semibold">
                        Experience (Years)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Years of experience"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-700 text-sm font-semibold">
                        Consultation Fee (₹)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <input
                          type="number"
                          name="consultationFee"
                          value={formData.consultationFee}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Consultation fee in rupees"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-semibold">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="doctor@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-semibold">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSignup ? 'Create Account' : 'Login'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm text-gray-500">Or</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setError('');
                      setFormData({
                        name: '',
                        email: '',
                        password: '',
                        speciality: '',
                        city: '',
                        hospital: '',
                        experience: 0,
                        consultationFee: 0,
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {isSignup
                      ? 'Already have an account? Login'
                      : "Don't have an account? Sign Up"}
                  </button>
                  <Link to="/login/patient" className="block mt-3 text-gray-600 hover:text-blue-600 transition-colors">
                    Are you a patient? Login here
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Floating card */}
          <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100 animate-float-medium hidden md:block">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Secure Access</div>
                <div className="text-xs text-gray-500">End-to-end encrypted</div>
              </div>
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

export default LoginDoctor;