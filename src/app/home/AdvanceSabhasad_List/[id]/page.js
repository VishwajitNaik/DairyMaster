"use client";
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Loading from "@/app/components/Loading/Loading";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalAdvance, setTotalAdvance] = useState(0);
  const { id } = useParams();

  // Memoizing the fetchOrders function
  const fetchOrders = useCallback(async () => {
    if (startDate && endDate) {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/advance/GetAdvanceUserSide', {
          params: {
            userId: id,
            startDate,
            endDate,
          },
        });
        setOrders(response.data.data || []); // Ensure the data exists
        setTotalAdvance(response.data.totalAdvance || 0);
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

  const totalRate = orders.reduce((total, order) => total + parseFloat(order.rakkam || 0), 0);

  // // Function to delete an order
  // const deleteOrder = async (orderId) => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.delete(`/api/billkapat/deleteBillkapat?id=${orderId}`);
  //     if (response.data.error) {
  //       setError(response.data.error);
  //     } else {
  //       setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
  //       setError(null);
  //     }
  //   } catch (error) {
  //     setError('Failed to delete order');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4 text-center bg-transparent shadow-md rounded-md shadow-black w-fit p-2">सभासद अडवांस </h1>

        <div className="mb-4 flex flex-wrap items-center space-x-4">
  <label className="block font-bold text-lg sm:w-auto ml-4 p-2 shadow-md rounded-md shadow-black w-fit">
    पासून
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
            />
  </label>
  <label className="block font-bold text-lg sm:w-auto ml-4 p-2 shadow-md rounded-md shadow-black w-fit">
    पर्यंत
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
      />
  </label>
  <button
    onClick={fetchOrders}
    className="w-full md:w-36 p-4 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
  >
    अडवांस पहा 
  </button>
</div>
        {error && <p className="text-red-500">{error}</p>}
        {orders.length > 0 ? (
          <div className="overflow-x-auto rounded-md shadow-md shadow-black">
            <table className="w-full bg-white text-black shadow-md rounded-lg text-sm">
              <thead>
                <tr className="bg-gray-200 font-bold text-xs md:text-sm">
                  <th className="py-3 px-4 border-b text-center">तारीख (Date)</th>
                  <th className="py-3 px-4 border-b text-center">रक्कम (Amount)</th>
                  <th className="py-3 px-4 border-b text-center">कृती (Actions)</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-center font-bold">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b text-center">{order.rakkam}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-300 font-bold">
                  <td className="py-3 px-4 border-t text-center">एकूण (Total)</td>
                  <td className="py-3 px-4 border-t text-center">{totalRate.toFixed(2)}</td>
                  <td className="py-3 px-4 border-t text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center flex font-bold text-2xl justify-center relative align-middle ">या तारखांमध्ये अडवांस उपलब्ध नाही.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
