import React from 'react';

const MedicineNotification = ({ message }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
      {message}
    </div>
  );
};

export default MedicineNotification; 