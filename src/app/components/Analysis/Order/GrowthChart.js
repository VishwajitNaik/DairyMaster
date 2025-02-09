"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

export default function GrowthChart() {
    const [chartData, setChartData] = useState([]);

    useEffect(() =>{
        async function fetchData(params) {
            try {
                const res = await axios.get("/api/analysis/orders");
                setChartData(res.data.trendata);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="w-full h-[400px] flex justify-center items-center bg-gray-800">
            <ResponsiveContainer width="90%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="growthRate" stroke="#FF5733" name="Growth Rate (%)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
