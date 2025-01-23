'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from "../components/Loading/Loading";

const SavedBills = () => {
  const [bills, setBills] = useState([]); // State to hold fetched bills
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(''); // State to manage error messages
  const [startDate, setStartDate] = useState(''); // State for start date
  const [endDate, setEndDate] = useState(''); // State for end date
  const [filteredBills, setFilteredBills] = useState({}); // State to store filtered bills by date range
  const [showDropdown, setShowDropdown] = useState(null); // State to manage which dropdown to show

  // Function to fetch bills based on date range
  const fetchBillsByDateRange = async (start, end) => {
    setLoading(true);
    setError('');
    try {
      const endpoint = `/api/billkapat/savedBills?startDate=${start}&endDate=${end}`;
      const response = await axios.get(endpoint);
      setFilteredBills((prev) => ({
        ...prev,
        [`${start}_${end}`]: response.data.data,
      }));
    } catch (err) {
      console.error('Failed to fetch bills:', err.message);
      setError('Failed to fetch bills. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle button click to fetch bills and store date range
  const handleButtonClick = () => {
    if (startDate && endDate) {
      fetchBillsByDateRange(startDate, endDate);
    }
  };

  // Function to toggle the display of dropdown for a specific date range
  const toggleDropdown = (rangeKey) => {
    setShowDropdown(showDropdown === rangeKey ? null : rangeKey);
  };

  return (
    
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[1000px] mx-auto">
      <h1 className="text-2xl font-bold text-black bg-green-300 p-2 shadow-md w-fit rounded-md">मागील बिल सूची</h1>
      
      {/* Date Pickers for Filtering */}
      <div className="bg-blue-300 sm:bg-gray-500 w-4/5 sm:w-fit mx-auto h-auto py-1 px-1 rounded-lg mt-4 flex flex-row">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-1/3 bg-gray-200 rounded-md shadow-sm"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-1/3 bg-gray-200 rounded-md shadow-sm"
        />
        <button
          onClick={handleButtonClick}
          className="w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
        >
          बिल पहा
        </button>
      </div>

      {loading && <div className="text-center text-black"><Loading /></div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Buttons for each date range */}
      {Object.keys(filteredBills).map((rangeKey) => (
        <div key={rangeKey} className="mt-4">
          <button
            onClick={() => toggleDropdown(rangeKey)}
            className="p-2 bg-green-500 text-white rounded w-full"
          >
            {rangeKey.replace('_', ' to ')}
          </button>

          {/* Dropdown or Popup Display for the filtered bills */}
          {showDropdown === rangeKey && (
            <div className="mt-2 p-4 border rounded shadow bg-gray-100">
              {filteredBills[rangeKey].length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-3 text-left border border-gray-600 text-black font-semibold text-xs sm:text-sm">रजि. नं.</th>
                        <th className="p-3 text-left border border-gray-600 text-black font-semibold text-xs sm:text-sm">उत्पादक </th>
                        <th className="p-3 text-left border border-gray-600 text-black font-semibold text-xs sm:text-sm">एकूण लिटर</th>
                        <th className="p-3 text-left border border-gray-600 text-black font-semibold text-xs sm:text-sm">एकूण रक्कम </th>
                        <th className="p-3 text-left border border-gray-600 text-black font-semibold text-xs sm:text-sm">एकूण स्थिर कपात</th>
                        <th className="p-3 text-left border border-gray-600 text-black font-semibold text-xs sm:text-sm">एकूण कपात</th>
                        <th className="p-3 text-left border border-gray-600 text-black font-semibold text-xs sm:text-sm">निव्वळ अदा</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {filteredBills[rangeKey].map((bill) => (
                        <tr key={bill._id} className="hover:bg-gray-100">
                          <td className="p-3 border border-gray-400 text-black text-xs sm:text-sm">{bill.registerNo}</td>
                          <td className="p-3 border border-gray-400 text-black text-xs sm:text-sm">{bill.user}</td>
                          <td className="p-3 border border-gray-400 text-black text-xs sm:text-sm">{bill.totalLiters}</td>
                          <td className="p-3 border border-gray-400 text-black text-xs sm:text-sm">{bill.totalRakkam}</td>
                          <td className="p-3 border border-gray-400 text-black text-xs sm:text-sm">{bill.totalKapatRateMultiplybyTotalLiter.toFixed(2)}</td>
                          <td className="p-3 border border-gray-400 text-black text-xs sm:text-sm">{bill.totalBillKapat}</td>
                          <td className="p-3 border border-gray-400 text-black text-xs sm:text-sm">{bill.netPayment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-black mt-4">या दिनांकाची बील समारी उपलब्ध नाही बील जतन करा .</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SavedBills;
