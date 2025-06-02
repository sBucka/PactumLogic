import React from "react";

const LoadingSpinner = () => {
  return (
    <div className='flex items-center justify-center min-h-96'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto'></div>
        <p className='mt-4 text-gray-600'>Načítavam dáta...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
