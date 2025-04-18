import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

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
  
  return (
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
  );
};

export default Layout;
