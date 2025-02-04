"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const AcceptedOrders = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dairies, setDairies] = useState([]);
    const [expandedDairy, setExpandedDairy] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/api/sangh/AllOrders");
                setDairies(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error.message);
                setError("Error fetching orders");
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const groupedOrders = dairies.reduce((acc, order) => {
        const { dairyName, orderType, quantity, _id, status } = order;
        if (!acc[dairyName]) acc[dairyName] = { orders: [], dairyName };

        // Group orders by status for easy categorization
        acc[dairyName].orders.push({ orderType, quantity, _id, status });
        return acc;
    }, {});

    return (
        <div>
        <h1 className="text-3xl font-bold mb-8 text-gray-700">Accepted Orders</h1>

        {Object.values(groupedOrders).map((dairy) => (
            <div
                key={dairy.dairyName}
                className={`bg-white shadow-lg rounded-lg p-6 w-full mb-4 cursor-pointer ${
                    expandedDairy === dairy.dairyName ? "border-2 border-green-500" : ""
                }`}
                onClick={() => setExpandedDairy(dairy.dairyName)}
            >
                <h2 className="text-xl font-semibold text-gray-800">{dairy.dairyName}</h2>
                <div className="flex flex-col w-full">
                    {expandedDairy === dairy.dairyName && (
                        <div className="mt-4">
                            <h3 className="font-bold text-green-600">Accepted Orders</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                {dairy.orders
                                    .filter((order) => order.status === "Accepted")
                                    .map((order) => (
                                        <OrderComponent
                                            key={order._id}
                                            order={order}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ))}
        </div>
    );

}

const OrderComponent = ({ order, onAccept, onSend, calculateProgress }) => (
    <div className="p-4 bg-blue-300 rounded-lg mb-4">
        <p className="text-black font-bold">Order Type: {order.orderType}</p>
        <p className="text-black">Quantity: {order.quantity}</p>
        <p className="text-black">Status: {order.status}</p>
    </div>
);


export default AcceptedOrders;