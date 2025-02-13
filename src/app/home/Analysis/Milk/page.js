"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function MilkGrowthChart() {
    const [chartData, setChartData] = useState([]);
    const [filter, setFilter] = useState("daily"); // Default filter is daily

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/api/analysis/milk/?filter=${filter}&ownerId=67a2fc4984ac9d1796e9b656`);
                console.log("Milk Growth Data:", response.data);  // Debugging line
                setChartData(response.data.trendData);
            } catch (error) {
                console.error("Error fetching milk growth data:", error);
            }
        }
        fetchData();
    }, [filter]);
    

    return (
        <div className="gradient-bg">
            <div className="w-full p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">📊 Milk Growth & Drop Rate</h2>

                {/* Filter Buttons */}
                <div className="flex justify-center gap-4 mb-6">
                    {["daily", "10days", "monthly", "yearly"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                                filter === type ? "bg-blue-600 text-white shadow-md" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                            }`}
                        >
                            {type === "10days" ? "10 Days" : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {/* 📈 Milk Quantity Chart */}
                <div className="w-full flex justify-center bg-white p-4 rounded-lg shadow-md mb-8">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                            <XAxis dataKey="period" tick={{ fill: "#4A5568", fontSize: 14 }} />
                            <YAxis tick={{ fill: "#4A5568", fontSize: 14 }} />
                            <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "8px" }} />
                            <Legend verticalAlign="top" wrapperStyle={{ fontSize: "14px", color: "#4A5568" }} />
                            
                            <Line type="monotone" dataKey="totalLiters" stroke="#4F46E5" strokeWidth={2} name="एकूण लिटर" />
                            <Line type="monotone" dataKey="growthRateLiters" stroke="#16A34A" strokeWidth={2} name="एकूण लिटर वाढ %" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* 💰 Amount Chart */}
                <div className="w-full flex justify-center bg-white p-4 rounded-lg shadow-md">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                            <XAxis dataKey="period" tick={{ fill: "#4A5568", fontSize: 14 }} />
                            <YAxis tick={{ fill: "#4A5568", fontSize: 14 }} />
                            <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "8px" }} />
                            <Legend verticalAlign="top" wrapperStyle={{ fontSize: "14px", color: "#4A5568" }} />
                            
                            <Line type="monotone" dataKey="totalAmount" stroke="#F97316" strokeWidth={2} name="एकूण रक्कम" />
                            <Line type="monotone" dataKey="growthRateAmount" stroke="#DC2626" strokeWidth={2} name="रक्कम वाढ (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
