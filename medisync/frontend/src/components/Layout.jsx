import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaBell, FaUser, FaFileMedical, FaBook, FaUpload, FaAmbulance, FaPills, FaInfoCircle } from 'react-icons/fa';

// Layout component that wraps authenticated pages
const Layout = ({ children, userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated based on userType
    const checkAuth = () => {
      if (userType === 'doctor') {
        const token = localStorage.getItem('doctorToken');
        const doctorData = JSON.parse(localStorage.getItem('doctorData') || '{}');
        
        if (!token) {
          navigate('/login/doctor', { state: { from: location.pathname } });
          return;
        }
        
        setUserData(doctorData);
        setIsAuthenticated(true);
      } else if (userType === 'patient') {
        const token = localStorage.getItem('patientToken');
        const patientData = JSON.parse(localStorage.getItem('patientData') || '{}');
        
        if (!token) {
          navigate('/login/patient', { state: { from: location.pathname } });
          return;
        }
        
        setUserData(patientData);
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, [userType, navigate, location.pathname]);
  
  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null;
  }
  
  // Get background color based on user type
  const getBgColor = () => {
    return userType === 'doctor' 
      ? 'bg-gradient-to-br from-blue-50 to-indigo-100' 
      : 'bg-gradient-to-br from-green-50 to-teal-100';
  };

  const patientMenuItems = [
    { path: '/patient', icon: <FaHome />, label: 'Dashboard', exact: true },
    { path: '/profile', icon: <FaUser />, label: 'Profile' },
    { path: '/view-prescriptions', icon: <FaFileMedical />, label: 'Prescriptions' },
    { path: '/book-appointment', icon: <FaBook />, label: 'Book Appointment' },
    { path: '/upload-reports', icon: <FaUpload />, label: 'Upload Reports' },
    { path: '/health-reminders', icon: <FaBell />, label: 'Health Reminders' },
    { path: '/emergency-help', icon: <FaAmbulance />, label: 'Emergency Help' },
    { path: '/my-appointments', icon: <FaCalendarAlt />, label: 'My Appointments' },
    { path: '/medicine-tracking', icon: <FaPills />, label: 'Medicine Tracking' },
    { path: '/medicine-info', icon: <FaInfoCircle />, label: 'Medicine Info' }
  ];

  const doctorMenuItems = [
    { path: '/doctor', icon: <FaHome />, label: 'Dashboard', exact: true },
    { path: '/add-prescription', icon: <FaFileMedical />, label: 'Add Prescription' },
    { path: '/view-appointments', icon: <FaCalendarAlt />, label: 'View Appointments' },
    { path: '/reports', icon: <FaFileMedical />, label: 'Reports' },
    { path: '/emergency-requests', icon: <FaAmbulance />, label: 'Emergency Requests' },
    { path: '/todays-appointment', icon: <FaCalendarAlt />, label: "Today's Appointments" },
    { path: '/patient-list', icon: <FaUser />, label: 'Patient List' }
  ];

  const menuItems = userType === 'patient' ? patientMenuItems : doctorMenuItems;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">
            {userType === 'patient' ? 'Patient Portal' : 'Doctor Portal'}
          </h2>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className={`min-h-screen ${getBgColor()}`}>
          <Navbar userType={userType} />
          <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
            {children}
          </div>
          
          {/* Footer */}
          <footer className="bg-white bg-opacity-70 backdrop-blur-sm text-center p-6 mt-12">
            <p className="text-gray-600 font-medium">© 2025 MediSync | Smart Medical System. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
