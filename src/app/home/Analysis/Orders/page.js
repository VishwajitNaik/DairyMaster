"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OrderTrendChart = () => {
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("daily");

  // Fetch data when filter changes
  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const res = await axios.get(`/api/analysis/orders/?filter=${filter}`);
        setChartData(res.data.trendData);
      } catch (error) {
        console.error('Error fetching trend data:', error);
      }
    };

    fetchTrendData();
  }, [filter]);

  return (
    <div className="gradient-bg">
    <div className="w-full h-[500px] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">📊 Order Trend Analysis</h2>
      
      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {["daily", "weekly", "monthly", "yearly"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
              filter === type ? "bg-blue-600 text-white shadow-md" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="w-full flex justify-center bg-white p-4 rounded-lg shadow-md">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="period" tick={{ fill: "#4A5568", fontSize: 14 }} />
            <YAxis tick={{ fill: "#4A5568", fontSize: 14 }} />
            <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "8px" }} />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: "14px", color: "#4A5568" }} />
            
            <Line type="monotone" dataKey="totalAmount" stroke="#4F46E5" strokeWidth={2} name="Total Amount" />
            <Line type="monotone" dataKey="totalOrders" stroke="#16A34A" strokeWidth={2} name="Total Orders" />
            <Line type="monotone" dataKey="averageAmount" stroke="#F97316" strokeWidth={2} name="Average Amount" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
  );
};

export default OrderTrendChart;
