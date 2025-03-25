"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Loading from "@/app/components/Loading/Loading";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { id } = useParams();

  const fetchOrders = useCallback(async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/billkapat/getBillKapat", {
        params: { userId: id, startDate, endDate },
      });
      setOrders(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [id, startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
    }
  }, [fetchOrders, startDate, endDate]);

  const totalRate = orders.reduce((total, order) => total + parseFloat(order.rate || 0), 0);

  const deleteOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/billkapat/deleteBillkapat?id=${orderId}`);
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        setError(null);
      }
    } catch (error) {
      setError("Failed to delete order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center bg-transparent shadow-md rounded-md shadow-black w-fit p-2 mx-auto">
          बिल कपात
        </h1>

        {/* Date Selection & Button */}
        <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
          <label className="block font-bold text-lg sm:w-auto p-2 shadow-md rounded-md shadow-black w-full sm:w-fit">
            पासून
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-black p-2 text-base md:text-xl border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
            />
          </label>
          <label className="block font-bold text-lg sm:w-auto p-2 shadow-md rounded-md shadow-black w-full">
            पर्यंत
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-black p-2 text-base md:text-xl border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
            />
          </label>
          <button
            onClick={fetchOrders}
            className="w-full sm:w-36 p-3 md:p-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
            disabled={loading}
          >
            {loading ? "Loading..." : "कपात पहा "}
          </button>
        </div>

        {/* Loading / Error / Data Display */}
        {loading ? (
          <div className="text-center mt-10">
            <Loading />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : orders.length > 0 ? (
          <div className="overflow-auto rounded-md shadow-md shadow-black">
            <table className="w-full bg-white text-black shadow-md rounded-lg text-sm">
              <thead>
                <tr className="bg-gray-200 font-bold text-xs md:text-sm">
                  <th className="py-3 px-2 border border-gray-400 text-center">तारीख (Date)</th>
                  <th className="py-3 px-2 border border-gray-400 text-center">रक्कम (Amount)</th>
                  <th className="py-3 px-2 border border-gray-400 text-center">कृती (Actions)</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-100 text-xs md:text-sm">
                    <td className="py-2 px-4 border border-gray-400 text-center font-bold">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-2 border border-gray-400 text-center">{order.rate}</td>
                    <td className="py-2 px-2 border border-gray-400 text-center">
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition text-xs md:text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold text-xs md:text-sm">
                  <td className="py-3 px-2 border border-gray-400 text-center">एकूण (Total)</td>
                  <td className="py-3 px-2 border border-gray-400 text-center">{totalRate.toFixed(2)}</td>
                  <td className="py-3 px-2 border border-gray-400 text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center font-bold text-xl md:text-2xl mt-4">या तारखांमध्ये बिल कपात उपलब्ध नाही.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
