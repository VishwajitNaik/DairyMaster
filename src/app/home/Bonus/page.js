'use client';
import React, { useState } from 'react';
import axios from 'axios';

const MilkRecords = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [milkType, setMilkType] = useState('');
  const [bonusType, setBonusType] = useState(''); // New state for bonus type
  const [bonusValue, setBonusValue] = useState(''); // New state for bonus value
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchMilkRecords = async () => {
    try {
      setError(null);
      const response = await axios.post('/api/billkapat/bonus', { startDate, endDate, milkType });
      setData(response.data.userMilkData);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  // Function to calculate the bonus based on selected type
  const calculateBonus = (totalRakkam, totalLiter) => {
    if (bonusType === 'percentage') {
      return (totalRakkam / 100) * bonusValue; // Calculate percentage bonus
    } else if (bonusType === 'perLiter') {
      return totalLiter * bonusValue; // Calculate per liter bonus
    }
    return 0; // Default to 0 if no bonus type selected
  };

  // Handle the print action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <div className="gradient-bg container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Milk Records</h1>

        <div className="mb-4">
          <label className="block mb-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-black border rounded px-4 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-black border rounded px-4 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="text-black block mb-2">दूध प्रकार</label>
          <select
            value={milkType}
            onChange={(e) => setMilkType(e.target.value)}
            className="text-black border rounded px-4 py-2 w-full"
          >
            <option className="text-black" value="">
              Select Milk Type
            </option>
            <option className="text-black" value="गाय ">
              गाय
            </option>
            <option className="text-black" value="म्हैस ">
              म्हैस
            </option>
          </select>
        </div>

        {/* Bonus Type Selection */}
        <div className="mb-4">
          <label className="text-black block mb-2">बोनस प्रकार</label>
          <select
            value={bonusType}
            onChange={(e) => setBonusType(e.target.value)}
            className="text-black border rounded px-4 py-2 w-full"
          >
            <option className="text-black" value="">
              बोनस सिलेक्ट करा 
            </option>
            <option className="text-black" value="percentage">
              Bonus in Percentage
            </option>
            <option className="text-black" value="perLiter">
              Bonus per Liter
            </option>
          </select>
        </div>

        {/* Bonus Value Input */}
        <div className="mb-4">
          <label className="block mb-2">Bonus Value:</label>
          <input
            type="number"
            value={bonusValue}
            onChange={(e) => setBonusValue(e.target.value)}
            className="text-black border rounded px-4 py-2 w-full"
            placeholder="Enter Bonus Value"
          />
        </div>

        <button
          onClick={fetchMilkRecords}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Fetch Records
        </button>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
        >
          Print Records
        </button>

        {error && <div className="text-red-500 mt-4">{error}</div>}

        {data && (
          <div className="mt-4 rounded-md">
            <h2 className="text-xl font-bold mb-2">Results:</h2>
            <table className="bg-white table-auto w-[60%] border-collapse border border-gray-700 rounded-md -ml-4">
              <thead>
                <tr>
                  <th className="text-black border border-gray-700 px-2 py-2 text-left">User Register No</th>
                  <th className="text-black border border-gray-700 px-2 py-2 text-left">Total Liter</th>
                  <th className="text-black border border-gray-700 px-2 py-2 text-left">Total Rakkam (₹)</th>
                  <th className="text-black border border-gray-700 px-2 py-2 text-left">Bonus (₹)</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((user) => Object.keys(user.milkData).length > 0) // Filter out users with no milk data
                  .map((user) => {
                    // Calculate total liter and total rakkam for each user
                    const totals = Object.values(user.milkData).flat().reduce(
                      (acc, record) => {
                        acc.liter += record.liter;
                        acc.rakkam += record.rakkam;
                        return acc;
                      },
                      { liter: 0, rakkam: 0 }
                    );

                    // Calculate bonus
                    const bonus = calculateBonus(totals.rakkam, totals.liter);

                    return (
                      <tr key={user.userId}>
                        <td className="text-black border border-gray-500 px-2 py-2">{user.registerNo}</td>
                        <td className="text-black border border-gray-500 px-2 py-2">{totals.liter.toFixed(2)}</td>
                        <td className="text-black border border-gray-500 px-2 py-2">₹{totals.rakkam.toFixed(2)}</td>
                        <td className="text-black border border-gray-500 px-2 py-2">₹{bonus.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                {/* Total Row */}
                <tr>
                  <td className="font-bold text-black border border-gray-700 px-4 py-2">Total</td>
                  <td className="font-bold text-black border border-gray-700 px-4 py-2">
                    {data.reduce((sum, user) => sum + Object.values(user.milkData).flat().reduce((acc, record) => acc + record.liter, 0), 0).toFixed(2)}
                  </td>
                  <td className="font-bold text-black border border-gray-700 px-4 py-2">
                    ₹{data.reduce((sum, user) => sum + Object.values(user.milkData).flat().reduce((acc, record) => acc + record.rakkam, 0), 0).toFixed(2)}
                  </td>
                  <td className="font-bold text-black border border-gray-700 px-4 py-2">
                    ₹{data.reduce((sum, user) => {
                      const totals = Object.values(user.milkData).flat().reduce(
                        (acc, record) => {
                          acc.liter += record.liter;
                          acc.rakkam += record.rakkam;
                          return acc;
                        },
                        { liter: 0, rakkam: 0 }
                      );
                      return sum + calculateBonus(totals.rakkam, totals.liter);
                    }, 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilkRecords;
