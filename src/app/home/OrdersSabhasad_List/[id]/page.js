"use client";
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const OrdersPage = () => {
  const [orderData, setOrderData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { id } = useParams(); // Correctly extract the userId from params

  // Use useCallback to memoize the fetchOrders function
  const fetchOrders = useCallback(async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    setLoading(true);
    setError(null); // Reset error state

    try {
      const response = await axios.post(`/api/orders/afterKapatOrders/${id}`, {
        startDate,
        endDate,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setOrderData(response.data);

        // Set netPayment in context for access in other components
        if (response.data.netPayment) {
          setNetPayment(response.data.netPayment);
        }
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [id, startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
    }
  }, [startDate, endDate, fetchOrders]);

  return (
    <div className="gradient-bg flex flex-col r min-h-screen">
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Orders</h1>

      <form
        onSubmit={(e) => { e.preventDefault(); fetchOrders(); }}
        className="bg-gray-100 p-4 rounded-lg shadow-md"
      >
        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
          <div className="flex flex-col mb-4 md:mb-0">
            <label htmlFor="startDate" className="text-black font-medium">Start Date:</label>
            <input
              type="date"
              id="startDate"
              className="p-2 rounded-md border border-gray-300 bg-white text-black"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mb-4 md:mb-0">
            <label htmlFor="endDate" className="text-black font-medium">End Date:</label>
            <input
              type="date"
              id="endDate"
              className="p-2 rounded-md border border-gray-300 bg-white text-black"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Generate Bills"}
        </button>
      </form>

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
        !loading && <p>No orders found for the selected date range.</p>
      )}
    </div>
    </div>
  );
};

export default OrdersPage;
