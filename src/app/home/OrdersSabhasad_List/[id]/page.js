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
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrders();
          }}
          className="bg-gray-400 rounded-lg shadow-md p-4 md:p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6">
            <input
              type="date"
              id="startDate"
              className="text-black p-2 text-sm md:text-xl font-mono mb-2 md:mb-0 md:mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full md:w-1/4 bg-gray-200 rounded-md shadow-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <input
              type="date"
              id="endDate"
              className="text-black p-2 text-sm md:text-xl font-mono mb-2 md:mb-0 md:mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full md:w-1/4 bg-gray-200 rounded-md shadow-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-36 p-3 md:p-4 mt-2 md:mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
              disabled={loading}
            >
              {loading ? "Fetching..." : "Generate Bills"}
            </button>
          </div>
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
                  <td className="py-2 px-4 border-t font-bold text-xl">निव्वळ येणे बाकी </td>
                  <td className="py-2 px-4 border-t font-bold text-xl">{orderData.netPayment?.toFixed(2)}</td>
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
