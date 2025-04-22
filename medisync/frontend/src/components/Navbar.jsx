import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Determine the active page
  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    // Load user data based on user type
    if (userType === 'doctor') {
      const doctorData = JSON.parse(localStorage.getItem('doctorData') || '{}');
      setUserData(doctorData);
    } else if (userType === 'patient') {
      const patientData = JSON.parse(localStorage.getItem('patientData') || '{}');
      setUserData(patientData);
    }
  }, [userType]);

  const handleLogout = () => {
    if (userType === 'doctor') {
      localStorage.removeItem('doctorToken');
      localStorage.removeItem('doctorData');
      navigate('/login/doctor');
    } else if (userType === 'patient') {
      localStorage.removeItem('patientToken');
      localStorage.removeItem('patientData');
      navigate('/login/patient');
    }
  };

  // Get color scheme based on user type
  const getColorScheme = () => {
    if (userType === 'doctor') {
      return {
        gradient: 'from-blue-600 to-indigo-700',
        highlight: 'blue-500',
        icon: 'blue-600',
        hover: 'hover:bg-blue-700',
        active: 'bg-blue-700',
        button: 'from-blue-500 to-indigo-600',
        text: 'text-blue-600'
      };
    } else {
      return {
        gradient: 'from-green-600 to-teal-700',
        highlight: 'green-500',
        icon: 'green-600',
        hover: 'hover:bg-green-700',
        active: 'bg-green-700',
        button: 'from-green-500 to-teal-600',
        text: 'text-green-600'
      };
    }
  };

  const colors = getColorScheme();
  const userName = userType === 'doctor' ? `Dr. ${userData.name || 'Doctor'}` : userData.name || 'Patient';

  return (
    <nav className={`bg-gradient-to-r ${colors.gradient} text-white shadow-lg fixed top-0 left-0 right-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to={userType === 'doctor' ? '/doctor' : '/patient'} className="flex items-center">
              <div className="bg-white p-2 rounded-full shadow-md mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">MediSync</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {userType === 'doctor' && (
              <>
                <Link to="/add-prescription" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/add-prescription') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Prescriptions
                </Link>
                <Link to="/view-appointments" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/view-appointments') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Appointments
                </Link>
                <Link to="/patient-list" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/patient-list') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Patients
                </Link>
              </>
            )}
            
            {userType === 'patient' && (
              <>
                <Link to="/view-prescriptions" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/view-prescriptions') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Prescriptions
                </Link>
                <Link to="/my-appointments" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/my-appointments') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Appointments
                </Link>
                <Link to="/upload-reports" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/upload-reports') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Reports
                </Link>
              </>
            )}
          </div>

          {/* User info and logout */}
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full px-4 py-1.5 shadow-md">
              <span className={`font-medium ${colors.text}`}>{userName}</span>
            </div>
            <button 
              onClick={handleLogout}
              className={`bg-gradient-to-r ${colors.button} px-4 py-1.5 rounded-full shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm">Logout</span>
            </button>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/10 backdrop-blur-lg">
            {userType === 'doctor' && (
              <>
                <Link to="/add-prescription" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/add-prescription') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Prescriptions
                </Link>
                <Link to="/view-appointments" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/view-appointments') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Appointments
                </Link>
                <Link to="/patient-list" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/patient-list') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Patients
                </Link>
              </>
            )}
            
            {userType === 'patient' && (
              <>
                <Link to="/view-prescriptions" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/view-prescriptions') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Prescriptions
                </Link>
                <Link to="/my-appointments" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/my-appointments') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Appointments
                </Link>
                <Link to="/upload-reports" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/upload-reports') ? colors.active : 'hover:bg-white/10'} transition-colors duration-200`}>
                  Reports
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
