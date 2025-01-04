"use client";
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { id } = useParams();

  // Memoizing the fetchOrders function
  const fetchOrders = useCallback(async () => {
    if (startDate && endDate) {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/billkapat/getBillKapat', {
          params: {
            userId: id,
            startDate,
            endDate,
          },
        });
        setOrders(response.data.data || []); // Ensure the data exists
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please select both start and end dates.');
      setLoading(false);
    }
  }, [id, startDate, endDate]); // Adding the required dependencies

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
    }
  }, [fetchOrders, startDate, endDate]); // Now includes fetchOrders as dependency

  const totalRate = orders.reduce((total, order) => total + parseFloat(order.rate || 0), 0);

  // Function to delete an order
  const deleteOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/billkapat/deleteBillkapat?id=${orderId}`);
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setOrderData((prevData) => ({
          ...prevData,
          userOrders: prevData.userOrders.filter((order) => order._id !== orderId),
        }));
        setError(null);
      }
    } catch (error) {
      setError('Failed to delete order');
    } finally{
      setLoading(false);
    }
  };
  
  return (
    <div className="gradient-bg flex flex-col min-h-screen">
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">बिल कपात </h1>

      <div className="mb-4 flex items-center space-x-4">
        <label className="block">
          पासून
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-black border rounded p-2 ml-4"
          />
        </label>
        <label className="block">
          पर्यंत
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-black border rounded p-2 ml-4"
          />
        </label>
        <button
          onClick={fetchOrders}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch Orders
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {orders.length > 0 ? (
        <table className="w-max bg-white text-black shadow-md rounded-lg">
  <thead>
    <tr className="bg-gray-200 font-bold">
      <th className="py-3 px-4 border-b text-center">तारीख (Date)</th>
      <th className="py-3 px-4 border-b text-center">रक्कम (Amount)</th>
      <th className="py-3 px-4 border-b text-center">कृती (Actions)</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => (
      <tr key={order._id} className="hover:bg-gray-100">
        <td className="py-2 px-4 border-b text-center">{new Date(order.date).toLocaleDateString()}</td>
        <td className="py-2 px-4 border-b text-center">{order.rate}</td>
        <td className="py-2 px-4 border-b text-center">
          <button
            onClick={() => deleteOrder(order._id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
    <tr className="bg-gray-100 font-bold">
      <td className="py-3 px-4 border-t text-center">एकूण (Total)</td>
      <td className="py-3 px-4 border-t text-center">{totalRate.toFixed(2)}</td>
      <td className="py-3 px-4 border-t text-center"></td>
    </tr>
  </tbody>
</table>

      ) : (
        <p>No orders found for the selected date range.</p>
      )}
    </div>
    </div>
  );
};

export default OrdersPage;


