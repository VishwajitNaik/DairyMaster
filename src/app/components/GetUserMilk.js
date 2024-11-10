"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function MilkRecords() {
  const [milkRecords, setMilkRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchMilkRecords = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/milk/getOwnerAllMilk", {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });
      setMilkRecords(response.data.data);
      console.log("Milk Records:", response.data.data);
    } catch (err) {
      setError("Failed to fetch milk records.");
      console.error("Error fetching milk records:", err.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]); // Add startDate and endDate as dependencies

  useEffect(() => {
    fetchMilkRecords();
  }, [fetchMilkRecords]); // Safe to include fetchMilkRecords as dependency

  return (
    <div className="container mx-auto mt-6 ">
      <h1 className="text-4xl font-bold text-center mb-6">Milk Records</h1>

      {/* Date Range Filter */}
      <div className="flex justify-center gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="text-black border px-4 py-2 rounded-md"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="text-black border px-4 py-2 rounded-md"
          placeholder="End Date"
        />
        <button
          onClick={fetchMilkRecords}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Filter
        </button>
      </div>

      {/* Loading and Error Messages */}
      {loading && <div className="text-center mt-6">Loading...</div>}
      {error && <div className="text-center text-red-500 mt-6">{error}</div>}

      {/* Milk Records Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-black py-2 px-4 border-b">Date</th>
                <th className="text-black py-2 px-4 border-b">Session</th>
                <th className="text-black py-2 px-4 border-b">Liter</th>
                <th className="text-black py-2 px-4 border-b">Fat</th>
                <th className="text-black py-2 px-4 border-b">SNF</th>
                <th className="text-black py-2 px-4 border-b">Rate</th>
                <th className="text-black py-2 px-4 border-b">Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(milkRecords) && milkRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-2 px-4 border-b text-center">
                    No milk records available.
                  </td>
                </tr>
              ) : (
                Array.isArray(milkRecords) &&
                milkRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="text-black py-2 px-4 border-b">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="text-black py-2 px-4 border-b">
                      {record.session}
                    </td>
                    <td className="text-black py-2 px-4 border-b">
                      {record.liter}
                    </td>
                    <td className="text-black py-2 px-4 border-b">
                      {record.fat}
                    </td>
                    <td className="text-black py-2 px-4 border-b">
                      {record.snf}
                    </td>
                    <td className="text-black py-2 px-4 border-b">
                      {record.dar}
                    </td>
                    <td className="text-black py-2 px-4 border-b">
                      {record.rakkam}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
