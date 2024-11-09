import React,{useState} from 'react';

const Modal = ({ isOpen, onClose, onSubmit }) => {
    const [truckNo, setTruckNo] = useState('');
    const [driverMobNo, setDriverMobNo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ truckNo, driverMobNo });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Send Order Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Truck No:</label>
                        <input
                            type="text"
                            value={truckNo}
                            onChange={(e) => setTruckNo(e.target.value)}
                            className="text-black mt-1 block w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Driver Mob No:</label>
                        <input
                            type="tel"
                            value={driverMobNo}
                            onChange={(e) => setDriverMobNo(e.target.value)}
                            className="text-black mt-1 block w-full border border-gray-300 rounded p-2"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="mr-2 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
