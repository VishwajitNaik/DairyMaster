"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import CompleteOrderButton from '../../../components/CompleteOrderButton.js';
import Loading from '../../../components/Loading/Loading';

const DisplayOrders = () => {
    const [orders, setOrders] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [filter, setFilter] = useState("Pending"); // State for filtering orders

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/owner/GetOreders');
                setOrders(response.data.data);
                setLoading(false);
                console.log("Order Details", response.data.data);
            } catch (error) {
                console.error("Error fetching orders:", error.message);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const calculateProgress = (order) => {
        if (order.status === 'Completed') {
            return 100;
        }
        let progress = 0;
        if (order.status === 'Accepted') {
            progress += 30;
        }
        if (order.truckNo && order.driverMobNo) {
            progress += 30;
        }
        return progress;
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const filteredOrders = orders.filter((order) => {
        if (filter === "Pending") return order.status === "Pending";
        if (filter === "Accepted") return order.status === "Accepted";
        if (filter === "Completed") return order.status === "Completed";
        return true;
    });

    if (loading) {
        return <div className="text-center"><Loading /></div>;
    }

    return (
        <div className="banner flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <video autoPlay loop muted className="opacity-50">
                <source src="/assets/milk.mp4" type="video/mp4" /> 
            </video>
            <h1 className="text-3xl font-bold mb-8 text-white shadow-md z-10 shadow-black bg-slate-600 p-2 rounded-lg">Order List</h1>
            
            {/* Filter Buttons */}
            <div className="z-10 flex space-x-4 mb-8">
                <button 
                    onClick={() => handleFilterChange("Pending")} 
                    className={`px-4 py-2 rounded-lg ${filter === "Pending" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                    Pending Orders
                </button>
                <button 
                    onClick={() => handleFilterChange("Accepted")} 
                    className={`px-4 py-2 rounded-lg ${filter === "Accepted" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                    Accepted Orders
                </button>
                <button 
                    onClick={() => handleFilterChange("Completed")} 
                    className={`px-4 py-2 rounded-lg ${filter === "Completed" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                >
                    Completed Orders
                </button>
            </div>

            {/* Orders Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl z-50">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => {
                        const progress = calculateProgress(order);
                        return (
                            <div key={index} className="bg-white shadow-lg rounded-lg p-6 w-full">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">{order.orderType}</h2>
                                <p className="text-gray-600 mb-2"><strong>Quantity:</strong> {order.quantity}</p>
                                <p className="text-gray-600 mb-2">
                                    <strong>Truck No:</strong> {order.truckNo || 'Order Not Accepted'}
                                </p>
                                <p className="text-gray-600 mb-4">
                                    <strong>Driver Mob No:</strong> {order.driverMobNo || 'Order Not Accepted'}
                                </p>
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <span className="text-xs font-semibold inline-block text-teal-600 uppercase px-2 py-1 rounded-full">
                                            {progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                        <div
                                            style={{ width: `${progress}%` }}
                                            className="bg-teal-600 h-full rounded-full"
                                        />
                                    </div>
                                </div>
                                {order.status === "Accepted" && (
                                    <div className="flex justify-center mt-4">
                                        <CompleteOrderButton orderId={order._id} />
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-gray-600 text-center">No orders found in this category.</div>
                )}
            </div>
        </div>
    );
};

export default DisplayOrders;
