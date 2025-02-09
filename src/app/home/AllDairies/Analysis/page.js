"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function SanghAnalysis() {
    const [cowData, setCowData] = useState([]);
    const [buffData, setBuffData] = useState([]);
    const [filter, setFilter] = useState("daily");
    const [selectedType, setSelectedType] = useState("cow"); // Default: Cow

    useEffect(() => {
        const fetchTrendData = async () => {
            try {
                const response = await axios.get(`/api/sangh/Analysis/Milk?filter=${filter}`);
                setCowData(response.data.cowTrendData || []);
                setBuffData(response.data.buffTrendData || []);
                console.log("Cow Data:", response.data.cowTrendData);
                console.log("Buffalo Data:", response.data.buffTrendData);
            } catch (error) {
                console.error("Error fetching trend data:", error);
            }
        };

        fetchTrendData();
    }, [filter]);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Milk Collection Analysis</h1>

            {/* Filter Selection */}
            <div className="flex items-center mb-4">
                <label className="mr-2 font-semibold">Filter:</label>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border rounded-md text-black"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* Tab Selection for Cow / Buffalo */}
            <div className="flex space-x-4 mb-4">
                <button
                    className={`p-2 rounded-md font-semibold text-black ${
                        selectedType === "cow" ? "bg-blue-500 text-black" : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedType("cow")}
                >
                    Cow Milk
                </button>
                <button
                    className={`p-2 rounded-md font-semibold text-black ${
                        selectedType === "buff" ? "bg-blue-500 text-black" : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedType("buff")}
                >
                    Buffalo Milk
                </button>
            </div>

            {/* Line Chart */}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={selectedType === "cow" ? cowData : buffData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalLiters" stroke="#8884d8" name="Total Liters" />
                    <Line type="monotone" dataKey="totalAmount" stroke="#82ca9d" name="Total Amount" />
                    <Line type="monotone" dataKey="growthRateLiters" stroke="#ff7300" name="Growth Rate (Liters)" />
                    <Line type="monotone" dataKey="growthRateAmount" stroke="#ff0000" name="Growth Rate (Amount)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
