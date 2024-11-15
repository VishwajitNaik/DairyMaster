"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function MilkRecords() {
  const [milkRecords, setMilkRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState({});

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
      
      // Calculate summary
      calculateSummary(response.data.data);
    } catch (err) {
      setError("Failed to fetch milk records.");
      console.error("Error fetching milk records:", err.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchMilkRecords();
  }, [fetchMilkRecords]);

  const calculateSummary = (records) => {
    const summaryData = { म्हैस: {}, गाय: {} };
  
    ["म्हैस", "गाय"].forEach((type) => {
      const filteredRecords = records.filter(record => record.milk.trim() === type);
  
      const totalLiter = filteredRecords.reduce((total, record) => total + (parseFloat(record.liter) || 0), 0);
      const totalFat = filteredRecords.reduce((total, record) => total + (parseFloat(record.fat) || 0), 0);
      const totalSnf = filteredRecords.reduce((total, record) => total + (parseFloat(record.snf) || 0), 0);
      const totalRate = filteredRecords.reduce((total, record) => total + (parseFloat(record.dar) || 0), 0);
      const totalRakkam = filteredRecords.reduce((total, record) => total + (parseFloat(record.rakkam) || 0), 0);
  
      const avgFat = filteredRecords.length > 0 ? totalFat / filteredRecords.length : 0;
      const avgSnf = filteredRecords.length > 0 ? totalSnf / filteredRecords.length : 0;
      const avgRate = filteredRecords.length > 0 ? totalRate / filteredRecords.length : 0;
  
      summaryData[type] = {
        totalLiter,
        avgFat,
        avgSnf,
        avgRate,
        totalRakkam,
      };
    });
  
    setSummary(summaryData);
  };
  

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
        <div className="overflow-x-auto mb-8">
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

      {/* Summary Section */}
      {!loading && !error && (
        <div className="summary-section mb-6">
          <h2 className="text-2xl font-bold mb-4">Summary</h2>
          {["म्हैस", "गाय"].map((type) => (
            <div key={type} className="mb-4">
              <h3 className="text-xl font-semibold">{type}</h3>
              <p>Total Liter: {summary[type]?.totalLiter || 0}</p>
              <p>Average Fat: {summary[type]?.avgFat.toFixed(2) || 0}</p>
              <p>Average SNF: {summary[type]?.avgSnf.toFixed(2) || 0}</p>
              <p>Average Rate: {summary[type]?.avgRate.toFixed(2) || 0}</p>
              <p>Total Amount (रक्कम): {summary[type]?.totalRakkam || 0}</p>
            </div>
          ))}
          <div className="font-bold">
  Combined Total Amount: {(summary["म्हैस"]?.totalRakkam || 0) + (summary["गाय"]?.totalRakkam || 0)}
</div>
        </div>
      )}
    </div>
  );
}
