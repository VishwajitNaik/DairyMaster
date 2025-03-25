"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const VikriRateList = () => {
  const [vikriRates, setVikriRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVikriRates();
  }, []);

  const fetchVikriRates = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/user/getVikriRate");
      setVikriRates(response.data.data);
    } catch (error) {
      console.error("Error fetching VikriRates:", error);
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this VikriRate?")) return;

    try {
      await axios.delete("/api/user/getVikriRate", {
        data: { id }, // ✅ Send ID in the request body
      });
      setVikriRates((prev) => prev.filter((rate) => rate._id !== id));
    } catch (error) {
      console.error("Error deleting VikriRate:", error);
      setError(error.response?.data?.error || "Failed to delete");
    }
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Vikri Rate List</h2>

        {loading && <div className="text-blue-500 text-center">Loading...</div>}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {!loading && vikriRates.length === 0 && (
          <div className="text-gray-500 text-center">No Vikri Rates Found</div>
        )}

        {!loading && vikriRates.length > 0 && (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-800">
                <th className="p-2 border-r text-left">Buffalo Rate</th>
                <th className="p-2 border-r text-left">Cow Rate</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vikriRates.map((rate) => (
                <tr key={rate._id} className="border-b text-gray-800">
                  <td className="p-2 border-r">₹{rate.VikriRateBuff.toFixed(2)}</td>
                  <td className="p-2 border-r">₹{rate.VikriRateCow.toFixed(2)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(rate._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </div>
  );
};

export default VikriRateList;
