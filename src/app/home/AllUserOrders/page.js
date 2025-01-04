"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const UserOrdersBillKapat = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetching data when the startDate and endDate change
  useEffect(() => {
    if (startDate && endDate) {
      setLoading(true);
      setError("");
      axios
        .get("/api/orders/AllUserOrders", {
          params: { startDate, endDate },
        })
        .then((response) => {
          setData(response.data.data);
        })
        .catch(() => {
          setError("Failed to fetch data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [startDate, endDate]);

  return (
    <div className="gradient-bg flex flex-col min-h-screen p-4 sm:p-8">
      <h1 className="text-2xl sm:text-4xl mb-8 text-center">
        सर्व उत्पादक बाकी पाहणे
      </h1>

      {/* Date range filter inputs */}
      <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
        <div className="flex flex-col sm:flex-row items-center">
          <label className="text-sm sm:text-base font-bold mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 text-black border rounded w-full sm:w-auto"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center">
          <label className="text-sm sm:text-base font-bold mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 text-black border rounded w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Loading and error messages */}
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Data table */}
      <div className="overflow-x-auto">
        {data.length > 0 ? (
          <table className="table-auto border-collapse w-full bg-white text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-black border px-4 py-2">तारीख</th>
                <th className="text-black border px-4 py-2">उत्पादक नं</th>
                <th className="text-black border px-4 py-2">उत्पादक</th>
                <th className="text-black border px-4 py-2">रक्कम</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.userId} className="text-center">
                  <td className="text-black border px-4 py-2">{new Date().toLocaleDateString()}</td>
                  <td className="text-black border px-4 py-2">{user.registerNo}</td>
                  <td className="text-black border px-4 py-2">{user.username}</td>
                  <td className="text-black border px-4 py-2">{user.remainingAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p className="text-center">No data available for the selected date range</p>
        )}
      </div>
    </div>
  );
};

export default UserOrdersBillKapat;
