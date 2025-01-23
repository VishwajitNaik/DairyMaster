'use client';
import React, { useState } from 'react';
import axios from 'axios';

const MilkRecords = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [milkType, setMilkType] = useState('');
  const [bonusType, setBonusType] = useState('');
  const [bonusValue, setBonusValue] = useState('');
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

  const calculateBonus = (totalRakkam, totalLiter) => {
    if (bonusType === 'percentage') {
      return (totalRakkam / 100) * bonusValue;
    } else if (bonusType === 'perLiter') {
      return totalLiter * bonusValue;
    }
    return 0;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">बोनस विवरण</h1>

        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col w-full sm:w-1/6">
            <label className="block m-2">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-black border rounded px-4 py-2"
            />
          </div>
          <div className="flex flex-col w-full sm:w-1/6">
            <label className="block m-2">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-black border rounded px-4 py-2"
            />
          </div>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col w-full sm:w-1/3">
            <label className="block m-2">दूध प्रकार</label>
            <select
              value={milkType}
              onChange={(e) => setMilkType(e.target.value)}
              className="text-black border rounded px-4 py-2"
            >
              <option className="text-black" value="">
                दूध प्रकार 
              </option>
              <option className="text-black" value="गाय ">
                गाय
              </option>
              <option className="text-black" value="म्हैस ">
                म्हैस
              </option>
            </select>
          </div>
          <div className="flex flex-col w-full sm:w-1/3">
            <label className="block m-2">बोनस प्रकार</label>
            <select
              value={bonusType}
              onChange={(e) => setBonusType(e.target.value)}
              className="text-black border rounded px-4 py-2"
            >
              <option className="text-black" value="">
                बोनस सिलेक्ट करा
              </option>
              <option className="text-black" value="percentage">
                टक्केवारी 
              </option>
              <option className="text-black" value="perLiter">
                प्रती लिटर 
              </option>
            </select>
          </div>
          <div className="flex flex-col w-full sm:w-1/3">
            <label className="block m-2">बोनस मूल्य</label>
            <input
              type="number"
              value={bonusValue}
              onChange={(e) => setBonusValue(e.target.value)}
              className="text-black border rounded px-4 py-2"
              placeholder="Enter Bonus Value"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <button
            onClick={fetchMilkRecords}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
          >
          बोनस काढा 
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
          >
            Print बोनस 
          </button>
        </div>

        {error && <div className="text-red-500 mt-4">{error}</div>}

        {data && (
          <div className="mt-4 overflow-x-auto">
            <h2 className="text-xl font-bold mb-2">Results:</h2>
            <table className="bg-white table-auto w-1/2 border-collapse border border-gray-700">
              <thead>
                <tr>
                  <th className="text-black border border-gray-700 px-2 py-2 w-8 text-left">र. नं </th>
                  <th className="text-black border border-gray-700 px-2 py-2 text-left">एकूण लिटर </th>
                  <th className="text-black border border-gray-700 px-2 py-2 text-left">एकूण रक्कम (₹)</th>
                  <th className="text-black border border-gray-700 px-2 py-2 text-left">बोनस (₹)</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((user) => Object.keys(user.milkData).length > 0)
                  .map((user) => {
                    const totals = Object.values(user.milkData).flat().reduce(
                      (acc, record) => {
                        acc.liter += record.liter;
                        acc.rakkam += record.rakkam;
                        return acc;
                      },
                      { liter: 0, rakkam: 0 }
                    );
                    const bonus = calculateBonus(totals.rakkam, totals.liter);

                    return (
                      <tr key={user.userId}>
                        <td className="text-black border border-gray-500 px-4 py-2">{user.registerNo}</td>
                        <td className="text-black border border-gray-500 px-4 py-2">{totals.liter.toFixed(2)}</td>
                        <td className="text-black border border-gray-500 px-4 py-2">{totals.rakkam.toFixed(2)}</td>
                        <td className="text-black border border-gray-500 px-4 py-2">{bonus.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                <tr>
                  <td className="font-bold text-black border border-gray-700 px-4 py-2">एकूण </td>
                  <td className="font-bold text-black border bg-slate-300 border-gray-700 px-4 py-2">
                    {data.reduce((sum, user) => sum + Object.values(user.milkData).flat().reduce((acc, record) => acc + record.liter, 0), 0).toFixed(2)}
                  </td>
                  <td className="font-bold text-black border bg-slate-300 border-gray-700 px-4 py-2">
                    {data.reduce((sum, user) => sum + Object.values(user.milkData).flat().reduce((acc, record) => acc + record.rakkam, 0), 0).toFixed(2)}
                  </td>
                  <td className="font-bold text-black border bg-slate-300 border-gray-700 px-4 py-2">
                    {data.reduce((sum, user) => {
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
