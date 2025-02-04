"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AddKapatOption = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [kapatType, setKapatType] = useState('');
  const [kapatCode, setKapatCode] = useState('');
  const [kapatName, setKapatName] = useState('');
  const [kapatRate, setKapatRate] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for submit button
  const [errorMessage, setErrorMessage] = useState(''); // Error messages
  const [successMessage, setSuccessMessage] = useState(''); // Success messages

  const handleKapatTypeChange = (event) => {
    setKapatType(event.target.value);
    setKapatRate(''); // Clear rate input when type changes
  };

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    setCurrentDate(formattedDate);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const payload = {
      date: currentDate,
      KapatType: kapatType,
      kapatCode,
      kapatName,
      kapatRate: kapatType === 'Sthir Kapat' ? kapatRate : null,
    };

    try {
      const res = await axios.post('/api/sangh/AddKapatOption', payload);
      setSuccessMessage(res.data.message || "Kapat added successfully!");
      // Clear form on success
      setKapatType('');
      setKapatCode('');
      setKapatName('');
      setKapatRate('');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to add Kapat!");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className=" flex flex-col items-center justify-center min-h-screen">
  <div className=" p-6 rounded-lg shadow-md shadow-gray-700 w-full max-w-2xl mx-auto">
    <h1 className="text-2xl font-semibold text-white mb-4">Add Kapat Option</h1>

    {/* Display Messages */}
    {errorMessage && (
      <div className="bg-red-500 text-white p-2 rounded mb-4">{errorMessage}</div>
    )}
    {successMessage && (
      <div className="bg-green-500 text-white p-2 rounded mb-4">{successMessage}</div>
    )}

    <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded-lg">
      {/* First Row: Date and Kapat Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="date" className="text-white font-medium">Date:</label>
          <input
            type="date"
            id="date"
            className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            required
          />
        </div>
        <div>
          <label htmlFor="kapat-type" className="text-white font-medium">Kapat Type:</label>
          <select
            id="kapat-type"
            className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full"
            value={kapatType}
            onChange={handleKapatTypeChange}
            required
          >
            <option value="">Choose...</option>
            <option value="Kapat">Kapat</option>
            <option value="Sthir Kapat">Sthir Kapat</option>
          </select>
        </div>
      </div>

      {/* Second Row: Kapat Code and Kapat Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="kapat-code" className="text-white font-medium">Kapat Code:</label>
          <input
            type="number"
            id="kapat-code"
            className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full"
            value={kapatCode}
            onChange={(e) => setKapatCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="kapat-name" className="text-white font-medium">Kapat Name:</label>
          <input
            type="text"
            id="kapat-name"
            className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full"
            value={kapatName}
            onChange={(e) => setKapatName(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Third Row: Kapat Rate (Conditional) and Submit Button */}
      <div className="grid grid-cols-1 gap-4">
        {kapatType === 'Sthir Kapat' && (
          <div>
            <label htmlFor="kapat-rate" className="text-white font-medium">Kapat Rate:</label>
            <input
              type="number"
              id="kapat-rate"
              className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full"
              value={kapatRate}
              onChange={(e) => setKapatRate(e.target.value)}
              required
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 ${
            loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-semibold rounded-md transition-colors duration-200`}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default AddKapatOption;
