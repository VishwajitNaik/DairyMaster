'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      <h1 className="text-2xl font-semibold text-black mb-4">Saved Bills</h1>
      
      {/* Date Pickers for Filtering */}
      <div className="flex justify-center space-x-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded text-black"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded text-black"
        />
        <button
          onClick={handleButtonClick}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Date Range
        </button>
      </div>

      {loading && <div className="text-center text-black">Loading...</div>}
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
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 text-left text-black font-semibold">User</th>
                      <th className="p-3 text-left text-black font-semibold">Total Liters</th>
                      <th className="p-3 text-left text-black font-semibold">Total Rakkam</th>
                      <th className="p-3 text-left text-black font-semibold">Total Kapat Rate</th>
                      <th className="p-3 text-left text-black font-semibold">Total Bill Kapat</th>
                      <th className="p-3 text-left text-black font-semibold">Net Payment</th>
                      <th className="p-3 text-left text-black font-semibold">Start Date</th>
                      <th className="p-3 text-left text-black font-semibold">End Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {filteredBills[rangeKey].map((bill) => (
                      <tr key={bill._id} className="hover:bg-gray-100">
                        <td className="p-3 text-black">{bill.user}</td>
                        <td className="p-3 text-black">{bill.totalLiters}</td>
                        <td className="p-3 text-black">{bill.totalRakkam}</td>
                        <td className="p-3 text-black">{bill.totalKapatRateMultiplybyTotalLiter}</td>
                        <td className="p-3 text-black">{bill.totalBillKapat}</td>
                        <td className="p-3 text-black">{bill.netPayment}</td>
                        <td className="p-3 text-black">{new Date(bill.startDate).toLocaleDateString()}</td>
                        <td className="p-3 text-black">{new Date(bill.endDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-black mt-4">No saved bills found for this date range.</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SavedBills;
