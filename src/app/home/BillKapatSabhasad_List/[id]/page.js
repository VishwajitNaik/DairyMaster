'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = ({ params }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchOrders = async () => {
    if (startDate && endDate) {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/billkapat/getBillKapat', {
          params: {
            userId: params.id,
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
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
    }
  }, [startDate, endDate]);

  const totalRate = orders.reduce((total, order) => total + parseFloat(order.rate || 0), 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Orders</h1>

      <div className="mb-4">
        <label className="block mb-2">
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2 w-full"
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
        <table className="min-w-full bg-white text-black shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Order No</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 border-b">{new Date(order.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{order.orderNo}</td>
                <td className="py-2 px-4 border-b">{order.rate}</td>
                <td className="py-2 px-4 border-b">
                  {/* Add edit and delete functionality as needed */}
                </td>
              </tr>
            ))}
            {/* Total amount row */}
            <tr className="bg-gray-100 font-bold">
              <td colSpan="2" className="py-2 px-4 border-t">Total</td>
              <td className="py-2 px-4 border-t">{totalRate.toFixed(2)}</td>
              <td className="py-2 px-4 border-t"></td>
            </tr> 
          </tbody>
        </table>
      ) : (
        <p>No orders found for the selected date range.</p>
      )}

    </div>
  );
};

export default OrdersPage;
