"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ExtraRate = () => {
  const [extraRates, setExtraRates] = useState([]); // State for fetched extra rates
  const [buffRate, setBuffRate] = useState(""); // Input for BuffRate
  const [cowRate, setCowRate] = useState(""); // Input for CowRate
  const [error, setError] = useState(""); // Error message state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  // Fetch Extra Rates on component mount
  useEffect(() => {
    async function fetchExtraRates() {
      try {
        const res = await axios.get("/api/sangh/ExtraRate", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Token from localStorage
          },
        });
        setExtraRates(res.data.data);
      } catch (error) {
        console.error("Error fetching extra rates:", error.message);
      }
    }
    fetchExtraRates();
  }, []);

  // Handle form submission to add Extra Rate
  const handleAddRate = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    setSuccessMessage(""); // Reset success state

    if (!buffRate || !cowRate) {
      setError("Both BuffRate and CowRate are required.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/sangh/ExtraRate",
        { BuffRate: buffRate, CowRate: parseFloat(cowRate) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccessMessage(res.data.message); // Show success message
      setExtraRates((prev) => [...prev, res.data.data]); // Update rates list
      setBuffRate(""); // Reset input fields
      setCowRate("");
    } catch (error) {
      console.error("Error adding extra rate:", error.message);
      setError("Failed to add extra rate. Please try again.");
    }
  };

  // Handle delete rate
  const handleDeleteRate = async (rateId) => {
    setError(""); // Reset error state
    setSuccessMessage(""); // Reset success state

    try {
      const res = await axios.delete(`/api/sangh/ExtraRate?id=${rateId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccessMessage(res.data.message); // Show success message
      setExtraRates((prev) => prev.filter((rate) => rate._id !== rateId)); // Update rates list
    } catch (error) {
      console.error("Error deleting extra rate:", error.message);
      setError("Failed to delete extra rate. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
    <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Extra Rate Management</h1>
  
    {/* Form to add Extra Rate */}
    <form onSubmit={handleAddRate} className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
  <div className="flex flex-col md:flex-row gap-4">
    {/* Buffalo Rate Input */}
    <div className="flex-1">
  <label className="block text-sm font-medium mb-2 text-gray-700">Buffalo Rate</label>
  <input
    type="text" // Keep type as "text" to allow custom validation
    value={buffRate}
    onChange={(e) => {
      const value = e.target.value;
      // Allow only numbers and dots
      if (/^\d*\.?\d*$/.test(value)) {
        setBuffRate(value);
      }
    }}
    placeholder="Enter Buffalo Rate"
    className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
  />
</div>

    {/* Cow Rate Input */}
    <div className="flex-1">
      <label className="block text-sm font-medium mb-2 text-gray-700">Cow Rate</label>
      <input
        type="text"
        value={cowRate}
        onChange={(e) => {
          const value = e.target.value;
          // Allow only numbers and dots
          if (/^\d*\.?\d*$/.test(value)) {
            setCowRate(value);
          }
        }}
        placeholder="Enter Cow Rate"
        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>

    {/* Submit Button */}
    <div className="flex items-end">
      <button
        type="submit"
        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        Add Rate
      </button>
    </div>
  </div>
</form>
  
    {/* Error and Success Messages */}
    {error && <p className="text-red-600 text-center mb-4">{error}</p>}
    {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}
  
    {/* Display Existing Extra Rates */}
    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Existing Rates</h2>
    {extraRates.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-6 py-4 text-left text-sm font-medium text-gray-700">Buffalo Rate</th>
              <th className="border border-gray-300 px-6 py-4 text-left text-sm font-medium text-gray-700">Cow Rate</th>
              <th className="border border-gray-300 px-6 py-4 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {extraRates.map((rate) => (
              <tr key={rate._id} className="hover:bg-gray-50 transition-all">
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-700">{rate.BuffRate}</td>
                <td className="border border-gray-300 px-6 py-4 text-sm text-gray-700">{rate.CowRate}</td>
                <td className="border border-gray-300 px-6 py-4 text-center">
                  <button
                    onClick={() => handleDeleteRate(rate._id)}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-600 text-center">No extra rates available.</p>
    )}
  </div>
  );
};

export default ExtraRate;
