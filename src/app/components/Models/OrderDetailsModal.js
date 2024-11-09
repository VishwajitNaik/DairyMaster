import React, { useState } from 'react';

const OrderDetailsModal = ({ isOpen, onClose, onSubmit }) => {
    const [truckNo, setTruckNo] = useState('');
    const [driverMobNo, setDriverMobNo] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = () => {
        // Validation: check if truckNo and driverMobNo are provided
        if (!truckNo || !driverMobNo) {
            setError("Both Truck Number and Driver Mobile Number are required.");
            return;
        }

        // Call the onSubmit callback passed as a prop with truckNo and driverMobNo
        onSubmit({ truckNo, driverMobNo });

        // Reset form fields and close the modal
        setTruckNo('');
        setDriverMobNo('');
        setError(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-80 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Send Order Details</h2>
                
                {error && (
                    <div className="text-red-500 mb-4">
                        {error}
                    </div>
                )}

                <label className="block mb-2">
                    <span className="text-gray-700">Truck Number:</span>
                    <input
                        type="text"
                        className="mt-1 text-black block w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        value={truckNo}
                        onChange={(e) => setTruckNo(e.target.value)}
                        placeholder="Enter Truck Number"
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Driver Mobile Number:</span>
                    <input
                        type="text"
                        className="text-black mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        value={driverMobNo}
                        onChange={(e) => setDriverMobNo(e.target.value)}
                        placeholder="Enter Driver Mobile Number"
                    />
                </label>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
