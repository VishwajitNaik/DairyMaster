import React, { useState } from 'react';

const VisitDetailsModel = ({ isOpen, onClose, onSubmit, onAccept, visitId }) => {
    const [visitDate, setVisitDate] = useState('');
    const [visitTime, setVisitTime] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = () => { 
        // Validation: check if visitDate and visitTime are provided
        if (!visitDate || !visitTime) {
            setError("Both Visit Date and Visit Time are required.");
            return;
        }

        // Call the onSubmit callback passed as a prop with visitDate and visitTime
        onSubmit({ visitDate, visitTime });

        // Trigger the Accept Order function
        if (onAccept) {
            onAccept(visitId);
        }

        // Reset form fields and close the modal
        setVisitDate('');
        setVisitTime('');
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-40'>
            <div className='bg-white rounded-lg shadow-lg w-80 p-6'>
                <h2 className='text-lg font-semibold text-gray-800 mb-4'>Visit Details</h2>

                {error && (
                    <div className='text-red-500 mb-4'>
                        {error}
                    </div>
                )}

                <label className='block mb-2'>
                    <span className='text-gray-700'>Visit Date:</span>
                    <input
                        type='date'
                        className='mt-1 text-black block w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200'
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        placeholder='Enter Visit Date'
                    />
                </label>

                <label className='block mb-2'>
                    <span className='text-gray-700'>Visit Time:</span>
                    <input
                        type='time'
                        className='mt-1 text-black block w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200'
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        placeholder='Enter Visit Time'
                    />
                </label>

                <div className='flex justify-end mt-4'>
                    <button
                        className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-200'
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>

                    <button
                        className='ml-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-200'
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisitDetailsModel;
// Compare this snippet from src/app/components/Models/OrderDetailsModal.js: