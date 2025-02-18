"use client";

import { useState } from "react";
import axios from "axios";

const OrdersByDateRange = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`/api/orders/datewiseAlluserOrder?startDate=${startDate}&endDate=${endDate}`);
      setOrders(response.data.data);
      setTotalOrders(response.data.totalOrders);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg flex items-center flex-col min-h-screen p-4 sm:p-8">
      <h1 className="text-2xl mb-4">Orders by Date Range</h1>
      <div className="mb-4 space-x-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="text-black p-2 font-mono mr-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-40 bg-gray-200 rounded-md shadow-sm pr-10"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="text-black p-2 font-mono mr-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-40 bg-gray-200 rounded-md shadow-sm pr-10"
        />
        <button
          onClick={fetchOrders}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch Orders
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="mb-4">Loading orders...</p>}

      {orders.length > 0 && (
        <div className="w-full max-w-3xl mt-6">
          <table className="w-full border border-collapse text-center">
            <thead>
              <tr className="bg-gray-300">
              <th className="border px-4 py-2 text-black">Date</th>
                <th className="border px-4 py-2 text-black ">रजिस्टर नं.</th>
                <th className="border px-4 py-2 text-black">उत्पादकाचे नाव </th>
                <th className="border px-4 py-2 text-black">Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                <td className="border px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{order.createdBy.registerNo}</td>
                  <td className="border px-4 py-2">{order.createdBy.name}</td>
                  <td className="border px-4 py-2">{order.rakkam}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 font-bold">Total Orders: {totalOrders}</p>
        </div>
      )}
    </div>
  );
};

export default OrdersByDateRange;
