// PendingOrderModal.js
import React, { useState } from 'react';

const PendingOrderModal = ({ isOpen, onClose, onSubmit }) => {
    const [truckNo, setTruckNo] = useState('');
    const [driverMobNo, setDriverMobNo] = useState('');

    if (!isOpen) return null;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit({ truckNo, driverMobNo });
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-xl font-bold mb-4">Send Order Details</h2>
                <form onSubmit={handleFormSubmit}>
                    <label className="block mb-2 text-gray-700">
                        Truck Number
                        <input
                            type="text"
                            value={truckNo}
                            onChange={(e) => setTruckNo(e.target.value)}
                            className="w-full mt-1 p-2 border rounded"
                            required
                        />
                    </label>
                    <label className="block mb-4 text-gray-700">
                        Driver Mobile Number
                        <input
                            type="tel"
                            value={driverMobNo}
                            onChange={(e) => setDriverMobNo(e.target.value)}
                            className="w-full mt-1 p-2 border rounded"
                            required
                        />
                    </label>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PendingOrderModal;
