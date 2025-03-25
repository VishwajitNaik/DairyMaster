"use client";

import { useState } from "react";
import axios from "axios";

const VikriRate = () => {
  const [vikriRateBuff, setVikriRateBuff] = useState("");
  const [vikriRateCow, setVikriRateCow] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post("/api/vikriRate", {
        VikriRateBuff: vikriRateBuff,
        VikriRateCow: vikriRateCow,
      });

      setMessage(response.data.message);
      setVikriRateBuff("");
      setVikriRateCow("");
    } catch (error) {
      console.error("Error adding Vikri rate:", error);
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">विक्री दर भरा </h2>
        {message && (
          <div className="mb-4 text-green-600 font-semibold">{message}</div>
        )}
        {error && (
          <div className="mb-4 text-red-600 font-semibold">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              विक्री दर भैंस (Vikri Rate Buff)
            </label>
            <input
              type="number"
              value={vikriRateBuff}
              onChange={(e) => setVikriRateBuff(e.target.value)}
              className="w-full border text-black border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter Vikri Rate for Buffalo"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 font-medium mb-1">
              विक्री दर गाय (Vikri Rate Cow)
            </label>
            <input
              type="number"
              value={vikriRateCow}
              onChange={(e) => setVikriRateCow(e.target.value)}
              className="w-full border border-gray-300 p-2 text-gray-900 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter Vikri Rate for Cow"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-gray-900 py-2 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VikriRate;
