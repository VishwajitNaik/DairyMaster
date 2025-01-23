"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

const RatesDisplay = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get('/api/milkrate/getRates');
        setRates(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rates:", error.message);
        setError("Error fetching rates");
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const deleteRate = async (rateId) => {
    try {
      await axios.delete(`/api/milkrate/deleterate?id=${rateId}`);
      setRates((prevRates) => prevRates.filter((rate) => rate._id !== rateId));
    } catch (error) {
      console.error("Error deleting rate:", error.message);
      alert("Error deleting rate");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="gradient-bg">
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-white text-center bg-transparent p-2 shadow-md shadow-black ">
      दूध दर 
    </h1>
  
    <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4 md:p-6 overflow-x-auto">
  <table className="w-full border-collapse border border-gray-200">
    {/* Main Header */}
    <thead>
      <tr>
        <th colSpan="4" className="text-black py-3 px-2 md:px-4 border-b bg-gray-300">म्हैस दर </th>
        <th colSpan="4" className="text-black py-3 px-2 md:px-4 border-b bg-gray-300">गाय दर </th>
        <th className="text-black py-3 px-2 md:px-4 border-b bg-gray-300"></th>
      </tr>
    </thead>
    {/* Sub Header */}
    <thead>
      <tr>
        {/* Headers for Buff Rate (B) */}
        <th className="text-black py-3 px-2 md:px-4 border-b bg-gray-200">जास्त फॅट</th>
        <th className="text-black py-3 px-2 md:px-4 border-b bg-gray-200">जास्त फॅट दर</th>
        <th className="text-black py-3 px-2 md:px-4 border-b bg-gray-200">कमी फॅट </th>
        <th className="text-black py-3 px-2 md:px-4 border-b bg-gray-200">कमी फॅट दर</th>
        {/* Headers for Cow Rate (C) */}
        <th className="text-black py-3 px-2 md:px-4 border-b bg-gray-200">जास्त फॅट</th>
        <th className="text-black py-3 px-2 md:px-4 border-b bg-gray-200">जास्त फॅट दर</th>
        <th className="text-black py-3 px-2 md:px-4 border-b bg-gray-200">कमी फॅट</th>
        <th className="text-black py-3 px-2 md:px-4 border-b bg-gray-200">कमी फॅट दर</th>
        {/* Actions */}
        <th className="text-black py-3 px-2 md:px-4 border-b bg-gray-200">Actions</th>
      </tr>
    </thead>
    {/* Table Body */}
    <tbody>
      {rates.map((rate) => (
        <tr key={rate._id} className="text-center">
          {/* Data for Buff Rate (B) */}
          <td className="text-black py-2 px-2 md:px-4 border-b">{rate.HighFatB}</td>
          <td className="text-black py-2 px-2 md:px-4 border-b">{rate.HighRateB}</td>
          <td className="text-black py-2 px-2 md:px-4 border-b">{rate.LowFatB}</td>
          <td className="text-black py-2 px-2 md:px-4 border-b">{rate.LowRateB}</td>
          {/* Data for Cow Rate (C) */}
          <td className="text-black py-2 px-2 md:px-4 border-b">{rate.HighFatC}</td>
          <td className="text-black py-2 px-2 md:px-4 border-b">{rate.HighRateC}</td>
          <td className="text-black py-2 px-2 md:px-4 border-b">{rate.LowFatC}</td>
          <td className="text-black py-2 px-2 md:px-4 border-b">{rate.LowRateC}</td>
          {/* Actions */}
          <td className="text-black py-2 px-2 md:px-4 border-b">
            <button
              onClick={() => deleteRate(rate._id)}
              className="bg-red-500 text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-red-600 text-sm md:text-base"
            >
              डिलिट करा 
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  </div>
  </div>
  );
};

export default RatesDisplay;
