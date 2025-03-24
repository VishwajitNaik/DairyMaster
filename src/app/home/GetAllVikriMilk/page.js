"use client";

import { useState } from "react";
import axios from "axios";

const VikriMilkPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const handleFetchData = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    try {
      setError("");
      const response = await axios.get(`/api/GetAllVikriMilk`, {
        params: { startDate, endDate }
      });

      setData(response.data.data);
    } catch (err) {
      console.error("Error fetching Vikri Milk records:", err);
      setError(err.response?.data?.error || "Failed to fetch records");
    }
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
    <div className=" max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Vikri Milk Records</h1>

      {/* ✅ Mobile-Responsive Date Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border text-black rounded p-2 w-full sm:w-auto"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border text-black rounded p-2 w-full sm:w-auto"
        />
        <button
          onClick={handleFetchData}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-blue-600"
        >
          Fetch Data
        </button>
      </div>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {/* ✅ Mobile-Friendly Table (Scrolls Horizontally on Small Screens) */}
      <div className="overflow-x-auto">
        {data.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-black border border-gray-300 p-2">Date</th>
                <th className="text-black border border-gray-300 p-2">Register No</th>
                <th className="text-black border border-gray-300 p-2">Milk Type</th>
                <th className="text-black border border-gray-300 p-2">Liters</th>
                <th className="text-black border border-gray-300 p-2">Rate</th>
                <th className="text-black border border-gray-300 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record) => (
                <tr key={record._id} className="hover:bg-gray-400 bg-gray-300">
                  <td className="text-black border border-gray-300 p-2">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="text-black border border-gray-300 p-2">
                    {record.createdBy?.registerNo || "-"}
                  </td>
                  <td className="text-black border border-gray-300 p-2">
                    {record.milk || "-"}
                  </td>
                  <td className="text-black border border-gray-300 p-2">
                    {record.liter || "-"}
                  </td>
                  <td className="text-black border border-gray-300 p-2">
                    {record.dar || "-"}
                  </td>
                  <td className="text-black border border-gray-300 p-2">
                    {record.rakkam || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No records found</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default VikriMilkPage;
