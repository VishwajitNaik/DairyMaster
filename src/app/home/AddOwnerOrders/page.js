"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const OrderForm = () => {
    const [orderTypes, setOrderTypes] = useState([]);
    const [selectedOrderType, setSelectedOrderType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitRate, setUnitRate] = useState('');
    const [totalAmount, setTotalAmount] = useState('');

    useEffect(() => {
        const fetchOrderTypes = async () => {
            try {
                const response = await axios.get('/api/sangh/GetOrders');
                setOrderTypes(response.data.data);
            } catch (error) {
                console.error('Error fetching order types:', error.message);
            }
        };
        fetchOrderTypes();
    }, []);

    useEffect(() => {
        if (selectedOrderType) {
            const selectedOrder = orderTypes.find(
                (order) => order.ProductName === selectedOrderType
            );
            if (selectedOrder) {
                setUnitRate(selectedOrder.ProductRate);
            }
        }
    }, [selectedOrderType, orderTypes]);

    useEffect(() => {
        if (quantity && unitRate) {
            setTotalAmount(quantity * unitRate);
        }
    }, [quantity, unitRate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            orderType: selectedOrderType,
            quantity: quantity,
            rate: totalAmount,
        };

        try {
            const res = await axios.post('/api/owner/AddOrders', payload);
            toast.success(res.data.message || 'Order submitted successfully!');

            // Clear form fields after submission
            setSelectedOrderType('');
            setQuantity('');
            setUnitRate('');
            setTotalAmount('');
        } catch (error) {
            toast.error('Error storing order information.');
            console.error('Error storing order information:', error.message);
        }
    };

    return (
        <div 
        className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
        style={{
        backgroundImage: 'url(/assets/truck.jpg)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}
        >
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
            <h1 className="text-3xl font-bold mb-8 text-gray-700">New Order</h1>

            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Order Information</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="orderType" className="block text-gray-600 font-medium mb-2">Order Type</label>
                        <select
                            id="orderType"
                            value={selectedOrderType}
                            onChange={(e) => setSelectedOrderType(e.target.value)}
                            className="text-black w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow"
                            required
                        >
                            <option value="" disabled>Select an order type</option>
                            {orderTypes.map((order) => (
                                <option key={order._id} value={order.ProductName}>
                                    {order.ProductName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="quantity" className="block text-gray-600 font-medium mb-2">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="text-black w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow"
                            placeholder="Enter quantity"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="unitRate" className="block text-gray-600 font-medium mb-2">Unit Rate</label>
                        <input
                            type="number"
                            id="unitRate"
                            value={unitRate}
                            readOnly
                            className="text-black w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow"
                        />
                    </div>

                    <div>
                        <label htmlFor="totalAmount" className="block text-gray-600 font-medium mb-2">Total Amount</label>
                        <input
                            type="number"
                            id="totalAmount"
                            value={totalAmount}
                            readOnly
                            className="text-black w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow"
                        />
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Submit Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;
