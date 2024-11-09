"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import OrderDetailsModal from '@/app/components/Models/OrderDetailsModal';

const DisplayDairiesWithOrders = () => {
    const [dairies, setDairies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [expandedDairy, setExpandedDairy] = useState(null);

    useEffect(() => {
        const fetchDairies = async () => {
            try {
                const response = await axios.get('/api/sangh/AllOrders');
                setDairies(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dairies and orders:", error.message);
                setError("Error fetching dairies and orders");
                setLoading(false);
            }
        };
        fetchDairies();
    }, []);

    const handleSendButtonClick = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async ({ truckNo, driverMobNo }) => {
        try {
            await axios.post('/api/sangh/orderAcptStatus', {
                orderId: selectedOrderId,
                truckNo,
                driverMobNo
            });
            alert("Order details sent successfully!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error sending order details:", error.message);
            alert("Failed to send order details");
        }
    };

    const handleOrderAccept = async (orderId) => {
        try {
            await axios.patch('/api/sangh/patchOrders', { orderId });
            setDairies(prevDairies =>
                prevDairies.map(dairy => ({
                    ...dairy,
                    orders: Array.isArray(dairy.orders) ?
                        dairy.orders.map(order =>
                            order._id === orderId ? { ...order, status: "Accepted" } : order
                        ) : []
                }))
            );
            alert("Order accepted successfully!");
        } catch (error) {
            console.error("Error accepting order:", error.message);
            alert("Failed to accept order");
        }
    };

    const calculateProgress = (status) => {
        switch (status) {
            case 'Completed':
                return 100;
            case 'Accepted':
                return 50;
            case 'Order Placed':
            case 'Pending':
            default:
                return 0;
        }
    };

    const groupedOrders = dairies.reduce((acc, order) => {
        const { dairyName, orderType, quantity, _id, status } = order;
        if (!acc[dairyName]) acc[dairyName] = { orders: [], dairyName };
        
        // Group orders by status for easy categorization
        acc[dairyName].orders.push({ orderType, quantity, _id, status });
        return acc;
    }, {});

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8 text-gray-700">Dairies and Their Orders</h1>

            {Object.values(groupedOrders).map((dairy) => (
                <div
                    key={dairy.dairyName}
                    className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mb-4 cursor-pointer"
                    onClick={() => setExpandedDairy(expandedDairy === dairy.dairyName ? null : dairy.dairyName)}
                >
                    <h2 className="text-xl font-semibold text-gray-800">{dairy.dairyName}</h2>

                    {expandedDairy === dairy.dairyName && (
                        <div className="mt-4">
                            <h3 className="font-bold text-green-600">Pending Orders</h3>
                            {dairy.orders.filter(order => order.status === 'Pending').map(order => (
                                <OrderComponent key={order._id} order={order} onAccept={handleOrderAccept} onSend={handleSendButtonClick} calculateProgress={calculateProgress} />
                            ))}

                            <h3 className="font-bold text-blue-600 mt-4">Accepted Orders</h3>
                            {dairy.orders.filter(order => order.status === 'Accepted').map(order => (
                                <OrderComponent key={order._id} order={order} onAccept={handleOrderAccept} onSend={handleSendButtonClick} calculateProgress={calculateProgress} />
                            ))}

                            <h3 className="font-bold text-gray-500 mt-4">Completed Orders</h3>
                            {dairy.orders.filter(order => order.status === 'Completed').map(order => (
                                <OrderComponent key={order._id} order={order} calculateProgress={calculateProgress} />
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <OrderDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
};

const OrderComponent = ({ order, onAccept, onSend, calculateProgress }) => (
    <div className="p-4 bg-gray-50 rounded-lg mb-4">
        <p className="text-black font-bold">Order Type: {order.orderType}</p>
        <p className="text-black">Quantity: {order.quantity}</p>

        {order.status !== "Completed" && (
            <>
                <button
                    className={`${
                        order.status === "Accepted" ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                    } text-white font-bold py-2 px-4 rounded mt-2`}
                    onClick={() => onAccept(order._id)}
                    disabled={order.status === "Accepted"}
                >
                    {order.status === "Accepted" ? "Order Accepted" : "Accept Order"}
                </button>

                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2 ml-2"
                    onClick={() => onSend(order._id)}
                >
                    Send
                </button>
            </>
        )}

        <div className="relative pt-1 mt-4">
            <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-semibold inline-block text-teal-600 uppercase px-2 py-1 rounded-full">
                    {calculateProgress(order.status)}%
                </span>
            </div>
            <div className="flex h-2 mb-2 overflow-hidden text-xs bg-gray-200 rounded">
                <div
                    style={{ width: `${calculateProgress(order.status)}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-600"
                />
            </div>
        </div>
    </div>
);

export default DisplayDairiesWithOrders;
