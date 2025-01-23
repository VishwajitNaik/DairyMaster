"use client";

import React, { useState, useCallback } from "react";
import axios from "axios";
import Loading from "../components/Loading/Loading";

export default function MilkRecords() {
  const [milkRecords, setMilkRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({});

  
  const fetchMilkRecords = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/milk/getOwnerAllMilk", {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          page: currentPage,  // Pass current page
          limit: 10,           // Set records per page
        },
      });

      if (response.data && response.data.data) {
        setMilkRecords(response.data.data);
        setTotalPages(response.data.totalPages); // Update total pages from API response
        calculateSummary(response.data.data);
      } else {
        setError("No data available.");
      }
    } catch (err) {
      setError("Failed to fetch milk records.");
      console.error("Error fetching milk records:", err.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, currentPage]);


  const calculateSummary = (records) => {
    const summaryData = { म्हैस: {}, गाय: {} };
    ["म्हैस", "गाय"].forEach((type) => {
      const filteredRecords = records.filter(
        (record) => record.milk.trim() === type
      );

      const totalLiter = filteredRecords.reduce(
        (total, record) => total + (parseFloat(record.liter) || 0),
        0
      );
      const totalFat = filteredRecords.reduce(
        (total, record) => total + (parseFloat(record.fat) || 0),
        0
      );
      const totalSnf = filteredRecords.reduce(
        (total, record) => total + (parseFloat(record.snf) || 0),
        0
      );
      const totalRate = filteredRecords.reduce(
        (total, record) => total + (parseFloat(record.dar) || 0),
        0
      );
      const totalRakkam = filteredRecords.reduce(
        (total, record) => total + (parseFloat(record.rakkam) || 0),
        0
      );

      const avgFat =
        filteredRecords.length > 0 ? totalFat / filteredRecords.length : 0;
      const avgSnf =
        filteredRecords.length > 0 ? totalSnf / filteredRecords.length : 0;
      const avgRate =
        filteredRecords.length > 0 ? totalRate / filteredRecords.length : 0;

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

  const morningRecords = milkRecords.filter(
    (record) => record.session === "morning"
  );
  const eveningRecords = milkRecords.filter(
    (record) => record.session === "evening"
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <h1 className="text-4xl font-bold text-center mb-6">सर्व दूध </h1>

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
      {loading && <div className="text-center mt-6"><Loading /></div>}
      {error && <div className="text-center text-red-500 mt-6">{error}</div>}

      {/* Morning and Evening Records Side by Side */}
      {!loading && !error && milkRecords.length > 0 && (
        <div className="grid grid-cols-2 gap-8">
          {/* Morning Records Table */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">सकाळ </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                  <th className="text-black py-2 px-4 bg-gray-400">दिनांक </th>
                    <th className="text-black py-2 px-4 bg-gray-400">रजि. नं.</th>
                    <th className="text-black py-2 px-4 bg-gray-400">लिटर</th>
                    <th className="text-black py-2 px-4 bg-gray-400">फॅट</th>
                    <th className="text-black py-2 px-4 bg-gray-400">SNF</th>
                    <th className="text-black py-2 px-4 bg-gray-400">दर </th>
                    <th className="text-black py-2 px-4 bg-gray-400">एकूण</th>
                  </tr>
                </thead>
                <tbody>
                  {morningRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-200">
                      <td className="text-black py-2 px-4 font-semibold bg-gray-400 border border-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.registerNo}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.liter}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.fat}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.snf}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.dar}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.rakkam}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Evening Records Table */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">संध्याकाळ </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-200">
                <tr>
                  <th className="text-black py-2 px-4 bg-gray-400">दिनांक </th>
                    <th className="text-black py-2 px-4 bg-gray-400">रजि. नं.</th>
                    <th className="text-black py-2 px-4 bg-gray-400">लिटर</th>
                    <th className="text-black py-2 px-4 bg-gray-400">फॅट</th>
                    <th className="text-black py-2 px-4 bg-gray-400">SNF</th>
                    <th className="text-black py-2 px-4 bg-gray-400">दर </th>
                    <th className="text-black py-2 px-4 bg-gray-400">एकूण</th>
                  </tr>
                </thead>
                <tbody>
                  {eveningRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-200">
                      <td className="text-black py-2 px-4 border- font-semibold bg-gray-400 border border-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.registerNo}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.liter}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.fat}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.snf}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.dar}
                      </td>
                      <td className="text-black py-2 px-4 border-b border-gray-400">
                        {record.rakkam}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handlePrevPage}
          className="px-4 py-2 mx-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={currentPage === 1}
        >
          मागे 
        </button>
        <span className="px-4 py-2 text-lg">
          पान  {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 mx-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={currentPage === totalPages}
        >
          पुढे 
        </button>
      </div>
    </div>
  );
}
