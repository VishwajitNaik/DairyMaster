'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SavedBills = () => {
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

  // Function to calculate totals for the bills
  const calculateTotals = (bills) => {
    return bills.reduce(
      (totals, bill) => {
        totals.totalLiters += bill.totalLiters || 0;
        totals.totalRakkam += bill.totalRakkam || 0;
        totals.totalKapatRate += bill.totalKapatRateMultiplybyTotalLiter || 0;
        totals.totalBillKapat += bill.totalBillKapat || 0;
        totals.netPayment += bill.netPayment || 0;
        return totals;
      },
      {
        totalLiters: 0,
        totalRakkam: 0,
        totalKapatRate: 0,
        totalBillKapat: 0,
        netPayment: 0,
      }
    );
  };

  // Function to handle printing the summary report
  const handlePrint = (rangeKey) => {
    const bills = filteredBills[rangeKey];
    const totals = calculateTotals(bills);
    
    const printContent = `
      <h2>Summary Report for ${rangeKey.replace('_', ' to ')}</h2>
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Total Liters</td><td>${totals.totalLiters}</td></tr>
          <tr><td>Total Rakkam</td><td>${totals.totalRakkam}</td></tr>
          <tr><td>Total Kapat Rate</td><td>${totals.totalKapatRate}</td></tr>
          <tr><td>Total Bill Kapat</td><td>${totals.totalBillKapat}</td></tr>
          <tr><td>Net Payment</td><td>${totals.netPayment}</td></tr>
        </tbody>
      </table>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
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
      {Object.keys(filteredBills).map((rangeKey) => {
        const bills = filteredBills[rangeKey];
        const totals = calculateTotals(bills);

        return (
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
                <div className="mt-4 p-4 bg-gray-200 rounded">
                  <h3 className="font-semibold text-black">Total for this date range:</h3>
                  <table className="min-w-full table-auto mt-4">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 text-left text-black">Description</th>
                        <th className="py-2 px-4 text-left text-black">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 text-black">Total Liters</td>
                        <td className="py-2 px-4 text-black">{totals.totalLiters}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 text-black">Total Rakkam</td>
                        <td className="py-2 px-4 text-black">{totals.totalRakkam}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 text-black">Total Kapat Rate</td>
                        <td className="py-2 px-4 text-black">{totals.totalKapatRate}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 text-black">Total Bill Kapat</td>
                        <td className="py-2 px-4 text-black">{totals.totalBillKapat}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 text-black">Net Payment</td>
                        <td className="py-2 px-4 text-black">{totals.netPayment}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Print Button */}
                  <button
                    onClick={() => handlePrint(rangeKey)}
                    className="mt-4 p-2 bg-purple-500 text-white rounded"
                  >
                    Print Summary
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SavedBills;
