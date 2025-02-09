"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import { useParams } from "next/navigation";

const MilkGrowthChart = () => {
  const [filter, setFilter] = useState("daily");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get userId from URL params (dynamic route)
  const { userId } = useParams();

  // Fetch milk data based on the selected filter and userId
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error state before making the API call
      try {
        // Ensure that the userId is present and dynamically added to the request URL
        if (userId) {
          const response = await axios.get(`/api/analysis/milkUser/${userId}?filter=${filter}`);
          setChartData(response.data.trendData || []);
        }
      } catch (error) {
        setError("Error fetching milk data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [filter, userId]);

  return (
    <div className="gradient-bg">
      <div className="w-full h-[500px] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">📊 Milk Growth & Drop Rate</h2>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {["daily", "weekly", "monthly", "yearly"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === type
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-center mb-6">{error}</div>
        )}

        {/* Loading Spinner */}
        {loading && !error && (
          <div className="flex justify-center mb-6">
            <div className="animate-spin h-8 w-8 border-4 border-t-4 border-blue-500 rounded-full"></div>
          </div>
        )}

        {/* Chart Container - Full Width with Fixed Height */}
        {!loading && !error && (
          <div className="w-full flex justify-center bg-white p-4 rounded-lg shadow-md">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="period" tick={{ fill: "#4A5568", fontSize: 14 }} />
                <YAxis tick={{ fill: "#4A5568", fontSize: 14 }} />
                <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "8px" }} />
                <Legend
                  verticalAlign="top"
                  wrapperStyle={{ fontSize: "14px", color: "#4A5568" }}
                />

                <Line
                  type="monotone"
                  dataKey="totalLiters"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  name="एकूण लिटर"
                />
                <Line
                  type="monotone"
                  dataKey="growthRateLiters"
                  stroke="#16A34A"
                  strokeWidth={2}
                  name="एकूण लिटर वाढ %"
                />
                <Line
                  type="monotone"
                  dataKey="totalAmount"
                  stroke="#F97316"
                  strokeWidth={2}
                  name="एकूण रक्कम"
                />
                <Line
                  type="monotone"
                  dataKey="growthRateAmount"
                  stroke="#DC2626"
                  strokeWidth={2}
                  name="रक्कम वाढ (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilkGrowthChart;
