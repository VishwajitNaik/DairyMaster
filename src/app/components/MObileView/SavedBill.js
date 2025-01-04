'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SavedBill = () => {

      const [bills, setBills] = useState([]); // State to hold fetched bills
      const [loading, setLoading] = useState(false); // State to manage loading state
      const [error, setError] = useState(''); // State to manage error messages
      const [startDate, setStartDate] = useState(''); // State for start date
      const [endDate, setEndDate] = useState(''); // State for end date
      const [filteredBills, setFilteredBills] = useState({}); // State to store filtered bills by date range
      const [showDropdown, setShowDropdown] = useState(null); // State to manage which dropdown to show
    
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
    <div className="bg-blue-300 sm:bg-gray-500 w-4/5 sm:w-7/12 mx-auto h-auto py-1 px-1 rounded-lg mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Date and Time Selection */}
        <div className="flex items-center">
          <input
            type="date"
            id="date"
            className="border rounded-md p-1 text-gray-700 text-sm w-1/1 sm:w-auto"
          />
        <input
            type="date"
            id="date"
            className="border rounded-md p-1 ml-2 text-gray-700 text-sm w-1/1 sm:w-auto"
          />
          
        </div>
        <div className="flex justify-center items-center mt-4">
          <button
            type="submit"
            className="bg-red-400 border rounded-md p-1 text-gray-700 text-sm w-1/3"
          >
            इथे क्लिक करा 
          </button>
        </div>

        
      {loading && <div className="text-center text-black">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-sm">Date</th>
              <th className="px-4 py-2 text-sm">Time</th>
              <th className="px-4 py-2 text-sm">Bill</th>
              <th className="px-4 py-2 text-sm">Action</th>
              <th className="px-4 py-2 text-sm">Action</th>
              <th className="px-4 py-2 text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td className="border px-4 py-2 text-sm">bill date</td>
                <td className="border px-4 py-2 text-sm">bill time</td>
                <td className="border px-4 py-2 text-sm">bill bill</td>
                <td className="border px-4 py-2 text-sm">action</td>
                <td className="border px-4 py-2 text-sm">action</td>
                <td className="border px-4 py-2 text-sm">action</td>
              </tr>
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default SavedBill
