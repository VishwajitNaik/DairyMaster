"use client";
import { useState } from 'react';
import axios from 'axios';

const CompleteOrderButton = ({ orderId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleCompleteOrder = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.patch('/api/sangh/deliverStatusComplete', { orderId });
            setSuccessMessage(response.data.message);
            // Optionally, you could refresh the orders list or perform other actions here
        } catch (error) {
            console.error("Error completing order:", error.message);
            setError(error.response?.data?.error || "Failed to complete order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleCompleteOrder}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
            >
                {loading ? "Completing..." : "Complete Order"}
            </button>
            {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default CompleteOrderButton;
