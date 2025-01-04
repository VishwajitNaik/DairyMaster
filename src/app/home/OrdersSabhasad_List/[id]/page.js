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

  const { id } = useParams();

  const fetchOrders = useCallback(async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`/api/orders/afterKapatOrders/${id}`, {
        startDate,
        endDate,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setOrderData(response.data);
      }
    } catch (err) {
      setError("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  }, [id, startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
    }
  }, [startDate, endDate, fetchOrders]);

  const deleteOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/orders/deleteOrders?id=${orderId}`);

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setOrderData((prevData) => ({
          ...prevData,
          userOrders: prevData.userOrders.filter((order) => order._id !== orderId),
        }));
        setError(null);
      }
    } catch (err) {
      setError("Error deleting order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">उत्पादक ऑर्डर </h1>

        <form
          onSubmit={(e) => { e.preventDefault(); fetchOrders(); }}
          className="bg-gray-100 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="startDate" className="text-black font-medium">Start Date</label>
              <input
                type="date"
                id="startDate"
                className=" p-2 mt-1 rounded-md border border-gray-300 bg-white text-black"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="text-black font-medium">End Date</label>
              <input
                type="date"
                id="endDate"
                className=" p-2 mt-1 rounded-md border border-gray-300 bg-white text-black"
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

        {loading && <p className="mt-4 text-blue-500">Loading...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {!loading && orderData.userOrders?.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full bg-white text-black shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b text-left">दिनांक </th>
                  <th className="py-2 px-4 border-b text-left">रक्कम </th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderData.userOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="py-2 px-4 border-b">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{order.rakkam}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="py-2 px-4 border-t">Total</td>
                  <td className="py-2 px-4 border-t">{orderData.totalRakkam?.toFixed(2)}</td>
                  <td className="py-2 px-4 border-t"></td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p className="mt-6 text-gray-500">तुम्ही निवडलेल्या तरखेत कोणताही डाटा उपलब्ध नाही.</p>
        )}

        <h1 className="text-2xl font-bold mt-8">येणे बाकी </h1>
        {loading && <p className="mt-4 text-blue-500">Loading...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {!loading && orderData.userOrders?.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full bg-white text-black shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b text-left">दिनांक </th>
                  <th className="py-2 px-4 border-b text-left">रक्कम </th>
                </tr>
              </thead>
              <tbody>
                {orderData.userOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="py-2 px-4 border-b">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{order.rakkam}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="py-2 px-4 border-t">टोटल </td>
                  <td className="py-2 px-4 border-t">{orderData.totalRakkam?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-t">एकूण कपात </td>
                  <td className="py-2 px-4 border-t">{orderData.totalBillKapat?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-t">अडवांस जमा </td>
                  <td className="py-2 px-4 border-t">{orderData.totalAdvance?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-t">निव्वळ येणे बाकी </td>
                  <td className="py-2 px-4 border-t">{orderData.netPayment?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p className="mt-6 text-gray-500">तुम्ही निवडलेल्या तरखेत कोणताही डाटा उपलब्ध नाही.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
