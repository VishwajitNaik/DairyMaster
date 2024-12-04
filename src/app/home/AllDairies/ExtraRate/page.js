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
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Extra Rate Management</h1>

      {/* Form to add Extra Rate */}
      <form onSubmit={handleAddRate} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Buffalo Rate</label>
          <input
            type="text"
            value={buffRate}
            onChange={(e) => setBuffRate(e.target.value)}
            placeholder="Enter Buffalo Rate"
            className="text-black w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Cow Rate</label>
          <input
            type="number"
            value={cowRate}
            onChange={(e) => setCowRate(e.target.value)}
            placeholder="Enter Cow Rate"
            className="text-black w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Rate
        </button>
      </form>

      {/* Error and Success Messages */}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

      {/* Display Existing Extra Rates */}
      <h2 className="text-xl font-bold mb-4">Existing Rates</h2>
      {extraRates.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Buffalo Rate</th>
              <th className="border border-gray-300 px-4 py-2">Cow Rate</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {extraRates.map((rate) => (
              <tr key={rate._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {rate.BuffRate}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {rate.CowRate}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleDeleteRate(rate._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No extra rates available.</p>
      )}
    </div>
  );
};

export default ExtraRate;
