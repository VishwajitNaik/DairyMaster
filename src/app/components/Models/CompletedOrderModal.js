// CompletedOrderModal.js
import React from 'react';

const CompletedOrderModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-xl font-bold mb-4">Order Completed</h2>
                <p className="text-gray-700 mb-4">
                    This order is completed. Thank you!
                </p>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompletedOrderModal;
