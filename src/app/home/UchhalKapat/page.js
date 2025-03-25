"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function BillKapatPage() {
  const [billKapat, setBillKapat] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const fetchBillKapatData = async () => {
    try {
      if (!startDate || !endDate) {
        setError("Please select both start and end dates");
        return;
      }

      const response = await axios.post("/api/user/ucchal/getKapatuchhal", {
        startDate,
        endDate,
      });

      setBillKapat(response.data.data || []);
      console.log("Bill Kapat Data:", response.data.data);
      
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch data");
    }
  };

  let total = 0;

  return (
    <div className="gradient-bg flex flex-col min-h-screen items-center justify-center p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Bill Kapat Data
      </h2>

      {/* ✅ Date Range Picker */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-400 text-black px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-400 text-black px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={fetchBillKapatData}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Fetch Data
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* ✅ Data Table */}
      <div className="overflow-x-auto w-full">
        {billKapat.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 shadow-lg bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-6 border border-gray-300 text-left">
                  राजिस्टर नं.
                </th>
                <th className="py-3 px-6 border border-gray-300 text-left">
                  दिनांक
                </th>
                <th className="py-3 px-6 border border-gray-300 text-left">
                  रक्कम
                </th>
                <th className="py-3 px-6 border border-gray-300 text-left">
                  शिल्लक
                </th>
              </tr>
            </thead>
            <tbody>
              {billKapat.map((record, index) => {
                // Convert `rate` value to negative and calculate running total
                const rakkam = parseFloat(record.rate) || 0;
                total += rakkam;

                return (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="py-3 px-6 border border-gray-300 text-gray-800">
                      {record.registerNo}
                    </td>
                    <td className="py-3 px-6 border border-gray-300 text-gray-800">
                      {new Date(record.date).toLocaleDateString("en-GB")}
                    </td>
                    <td
                      className={`py-3 px-6 border border-gray-300 ${
                        String(rakkam).startsWith("-")
                          ? "text-red-500"
                          : "text-gray-800"
                      }`}
                    >
                      {rakkam.toFixed(2)}
                    </td>
                    <td className="py-3 px-6 border border-gray-300 text-gray-800">
                      {total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}

              {/* ✅ Total Row */}
              <tr className="bg-gray-200 font-semibold">
                <td
                  className="py-3 px-6 border border-gray-300 text-gray-800"
                  colSpan="3"
                >
                  एकूण
                </td>
                <td className="py-3 px-6 border border-gray-300 text-gray-800">
                  {total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No data found</p>
        )}
      </div>
    </div>
  );
}
