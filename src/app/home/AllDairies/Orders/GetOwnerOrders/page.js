"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailsModal from "@/app/components/Models/OrderDetailsModal";
import Link from "next/link";

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
                const response = await axios.get("/api/sangh/AllOrders");
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
            // Update order details and status
            await axios.post("/api/sangh/orderAcptStatus", {
                orderId: selectedOrderId,
                truckNo,
                driverMobNo,
            });
            await handleOrderAccept(selectedOrderId); // Call accept logic
            alert("Order details sent and accepted successfully!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error processing order:", error.message);
            alert("Failed to process order");
        }
    };

    const handleOrderAccept = async (orderId) => {
        try {
            await axios.patch("/api/sangh/patchOrders", { orderId });
            setDairies((prevDairies) =>
                prevDairies.map((dairy) => ({
                    ...dairy,
                    orders: Array.isArray(dairy.orders)
                        ? dairy.orders.map((order) =>
                              order._id === orderId ? { ...order, status: "Accepted" } : order
                          )
                        : [],
                }))
            );
        } catch (error) {
            console.error("Error accepting order:", error.message);
            throw new Error("Failed to accept order");
        }
    };

    const calculateProgress = (status) => {
        switch (status) {
            case "Completed":
                return 100;
            case "Accepted":
                return 50;
            case "Order Placed":
            case "Pending":
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
        <div className="flex flex-col w-full items-center min-h-screen bg-gray-300 p-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-700">Dairies and Their Orders</h1>
            <div className="flex flex-row w-full justify-center space-x-4">
            <Link href="/home/AllDairies/Orders/AcceptedOrders">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4">
                check accepted orders
            </button>
            </Link>
            <Link href="/home/AllDairies/Orders/CompletedOrders">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4">
                check Completed orders
            </button>
            </Link>
            </div>
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
                                <h3 className="font-bold text-green-600">Pending Orders</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                    {dairy.orders
                                        .filter((order) => order.status === "Pending")
                                        .map((order) => (
                                            <OrderComponent
                                                key={order._id}
                                                order={order}
                                                onAccept={handleOrderAccept}
                                                onSend={handleSendButtonClick}
                                                calculateProgress={calculateProgress}
                                            />
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
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
    <div className="p-4 bg-blue-300 rounded-lg mb-4">
        <p className="text-black font-bold">Order Type: {order.orderType}</p>
        <p className="text-black">Quantity: {order.quantity}</p>

        {order.status !== "Completed" && (
            <>
                <button
                    className={`${
                        order.status === "Accepted"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                    } text-white font-bold py-2 px-4 rounded mt-2`}
                    onClick={() => onSend(order._id)}
                >
                    Accept Order
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
