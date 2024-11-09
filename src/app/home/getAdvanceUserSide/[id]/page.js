'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AdvanceDetailsUserSide() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [advanceData, setAdvanceData] = useState([]);

  const fetchAdvance = async () => {
    setLoading(true);
    setError(null); // Reset error state
    console.log("Fetching advance data with:", { id, startDate, endDate });

    try {
      const res = await axios.get(`/api/advance/GetAdvanceUserSide`, {
        params: {
          userId: id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      // Ensure data exists and is an array
      const fetchedData = res.data.data || [];
      setAdvanceData(fetchedData);
    } catch (err) {
      setError('Failed to fetch advance data');
      console.error('Error fetching advance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAdvance();
    }
  }, [id, startDate, endDate]);

  return (
    <div className="gradient-bg flex flex-col items-center justify-center min-h-screen">
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">Advance Details</h1>
      
      <div className="flex flex-col md:flex-row items-center mb-4 space-y-2 md:space-y-0 md:space-x-4">
        <div className="text-black w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
  
        <div className="text-black w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
  
        <button onClick={fetchAdvance} className="p-2 bg-blue-500 text-white rounded w-full md:w-auto">
          Fetch Advances
        </button>
      </div>
  
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="bg-white p-4 shadow-md rounded-md text-black w-full overflow-x-auto">
          {advanceData && advanceData.length > 0 ? (
            <table className="w-full text-left table-auto border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Order No</th>
                  <th className="border px-2 py-1">Username</th>
                  <th className="border px-2 py-1">Milk Type</th>
                  <th className="border px-2 py-1">Amount (रक्कम)</th>
                </tr>
              </thead>
              <tbody>
                {advanceData.map((adv) => (
                  <tr key={adv._id}>
                    <td className="border px-2 py-1">{new Date(adv.date).toLocaleDateString('en-GB')}</td>
                    <td className="border px-2 py-1">{adv.orderNo || '-'}</td>
                    <td className="border px-2 py-1">{adv.username}</td>
                    <td className="border px-2 py-1">{adv.milktype}</td>
                    <td className="border px-2 py-1">{adv.rakkam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center">No advance data available for the selected dates.</div>
          )}
        </div>
      )}
    </div>
  </div>
  
  );
}
