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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-700">Milk Rates</h1>

      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-black py-3 px-4 border-b">High Fat B</th>
              <th className="text-black py-3 px-4 border-b">High Rate B</th>
              <th className="text-black py-3 px-4 border-b">Low Fat B</th>
              <th className="text-black py-3 px-4 border-b">Low Rate B</th>
              <th className="text-black py-3 px-4 border-b">High Fat C</th>
              <th className="text-black py-3 px-4 border-b">High Rate C</th>
              <th className="text-black py-3 px-4 border-b">Low Fat C</th>
              <th className="text-black py-3 px-4 border-b">Low Rate C</th>
              <th className="text-black py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => (
              <tr key={rate._id} className="text-center">
                <td className="text-black py-2 px-4 border-b">{rate.HighFatB}</td>
                <td className="text-black py-2 px-4 border-b">{rate.HighRateB}</td>
                <td className="text-black py-2 px-4 border-b">{rate.LowFatB}</td>
                <td className="text-black py-2 px-4 border-b">{rate.LowRateB}</td>
                <td className="text-black py-2 px-4 border-b">{rate.HighFatC}</td>
                <td className="text-black py-2 px-4 border-b">{rate.HighRateC}</td>
                <td className="text-black py-2 px-4 border-b">{rate.LowFatC}</td>
                <td className="text-black py-2 px-4 border-b">{rate.LowRateC}</td>
                <td className="text-black py-2 px-4 border-b">
                  <button
                    onClick={() => deleteRate(rate._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RatesDisplay;
