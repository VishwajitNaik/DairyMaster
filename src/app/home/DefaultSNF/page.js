"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const AddDefaultSNF = () => {
  const [snf, setSnf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [defaultSNF, setDefaultSNF] = useState(null);

  // Function to handle form submission for adding SNF
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/milk/DefaultSNF", { snf });
      setSuccess(response.data.message);
      setSnf(""); // Clear input field on success
      fetchDefaultSNF(); // Refresh the default SNF after adding
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add default SNF");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch default SNF
  const fetchDefaultSNF = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/milk/GetDefaultSNF");
      setDefaultSNF(response.data.data);
    } catch (error) {
      setError("Failed to fetch default SNF");
    } finally {
      setLoading(false);
    }
  };

  // Fetch default SNF on component mount
  useEffect(() => {
    fetchDefaultSNF();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">फिक्स SNF सेट करा </h1>

      {/* Form to add SNF */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-300 p-6 rounded shadow-md w-full max-w-md shadow-gray-500 hover:bg-blue-200"
      >
        <div className="mb-4">
          <label htmlFor="snf" className="block text-gray-700 mb-2 font-bold text-xl">
            SNF:
          </label>
          <input
            type="text"
            id="snf"
            value={snf}
            onChange={(e) => setSnf(e.target.value)}
            className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
            placeholder="Enter SNF value"
          />
        </div>

        <div className="flex justify-center items-center">
        <button
          type="submit"
          className="w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add SNF"}
        </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </form>

      {/* Display Default SNF */}
      {defaultSNF && (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md mt-6">
          <h2 className="text-lg font-bold mb-4">Default SNF Information</h2>
          <p className="text-gray-700">
            <strong>फिक्स SNF - </strong> {defaultSNF.snf}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddDefaultSNF;
