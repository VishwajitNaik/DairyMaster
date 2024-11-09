"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserOrderData() {
    const { id } = useParams();
    const [orderData, setOrderData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null); // Reset error state

        try {
            const res = await axios.post(`/api/orders/afterKapatOrders/${id}`);
            setOrderData(res.data);
        } catch (err) {
            setError('Failed to fetch orders. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    // Fetch orders when the component mounts
    useEffect(() => {
        fetchOrders();
    }, [id]); // Dependency array includes `id` to refetch if `id` changes

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Orders</h1>

            {/* No need for a form now */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && orderData.userOrders?.length > 0 ? (
                <table className="min-w-full bg-white text-black shadow-md rounded-lg mt-4">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Date</th>
                            <th className="py-2 px-4 border-b">Order No</th>
                            <th className="py-2 px-4 border-b">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderData.userOrders.map((order) => (
                            <tr key={order._id}>
                                <td className="py-2 px-4 border-b">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b">{order.orderNo}</td>
                                <td className="py-2 px-4 border-b">{order.rakkam}</td>
                            </tr>
                        ))}
                        {/* Total rakkam row */}
                        <tr className="bg-gray-100 font-bold">
                            <td colSpan="2" className="py-2 px-4 border-t">Total</td>
                            <td className="py-2 px-4 border-t">{orderData.totalRakkam?.toFixed(2)}</td>
                        </tr>
                        {/* Additional summary rows */}
                        <tr>
                            <td colSpan="2" className="py-2 px-4 border-t">Total Bill Kapat</td>
                            <td className="py-2 px-4 border-t">{orderData.totalBillKapat?.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="py-2 px-4 border-t">Total Advance Cuts</td>
                            <td className="py-2 px-4 border-t">{orderData.totalAdvance?.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="py-2 px-4 border-t">Net Payment</td>
                            <td className="py-2 px-4 border-t">{orderData.netPayment?.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                !loading && <p>No orders found.</p>
            )}
        </div>
    );
}
