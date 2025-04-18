import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedDoctorRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('doctorToken');
      
      if (!token) {
        toast.error('You must be logged in as a doctor to access this page');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // Token exists, consider the user authenticated
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // You could return a loading spinner here
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    // Redirect to login with the return url
    return <Navigate to="/login/doctor" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedDoctorRoute;
