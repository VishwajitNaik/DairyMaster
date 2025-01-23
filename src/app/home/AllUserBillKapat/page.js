"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/app/components/Loading/Loading";

const BillKapatTable = () => {
  const [billKapatData, setBillKapatData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBillKapatData = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/api/billkapat/AllUserBillKapat?startDate=${startDate}&endDate=${endDate}`
      );
      setBillKapatData(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">सर्व उत्पादक बिल कपात रक्कम</h1>

        {/* Date Range Inputs */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
          <div className="w-full sm:w-auto">
            <input
              type="date"
              className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="text-white">ते</div>
          <div className="w-full sm:w-auto">
            <input
              type="date"
              className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="w-full md:w-36 p-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
            onClick={fetchBillKapatData}
          >
            Fetch Data
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Loading State */}
        {loading && <p>
          <Loading />
        </p>}

        {/* Data Table */}
        {!loading && billKapatData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 bg-slate-300">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-black border border-gray-300 px-4 py-2 text-left">
                    उत्पादक नं
                  </th>
                  <th className="text-black border border-gray-300 px-4 py-2 text-left">
                    कपात तारीख
                  </th>
                  <th className="text-black border border-gray-300 px-4 py-2 text-left">
                    रक्कम
                  </th>
                </tr>
              </thead>
              <tbody>
                {billKapatData.map((user) =>
                  user.records.map((record) => (
                    <tr key={record._id} className="border-b">
                      <td className="text-black border border-gray-300 px-4 py-2">
                        {user.registerNo}
                      </td>
                      <td className="text-black border border-gray-300 px-4 py-2">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="text-black border border-gray-300 px-4 py-2">
                        {record.rate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillKapatTable;
