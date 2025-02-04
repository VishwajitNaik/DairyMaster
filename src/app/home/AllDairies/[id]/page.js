'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const SingleDairy = () => {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showMilkRecords, setShowMilkRecords] = useState({}); // Object to track which user has clicked

  // Memoize the fetchOwnerDetails function with useCallback
  const fetchOwnerDetails = useCallback(async () => {
    try {
      const res = await axios.get(`/api/sangh/getOwners/${id}`);
      setOwner(res.data.data);
      setUsers(res.data.userData);
      setFilteredUsers(res.data.userData); // Initialize filtered users
    } catch (error) {
      console.error('Error fetching owner details:', error.message);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOwnerDetails();
    }

    // Set default start and end dates to current date
    const currentDate = new Date().toISOString().split('T')[0];
    setStartDate(currentDate);
    setEndDate(currentDate);
  }, [id, fetchOwnerDetails]); // Added fetchOwnerDetails to the dependency array

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      return; // Optionally handle missing dates
    }
    try {
      const res = await axios.get(`/api/sangh/getOwners/${id}?startDate=${startDate}&endDate=${endDate}`);
      setFilteredUsers(res.data.userData);
    } catch (error) {
      console.error('Error filtering milk records:', error.message);
    }
  };

  const calculateStatistics = (milkRecords) => {
    const filteredRecords = milkRecords.filter(record =>
      new Date(record.date) >= new Date(startDate) && new Date(record.date) <= new Date(endDate)
    );

    const totalLiter = filteredRecords.reduce((acc, record) => acc + record.liter, 0);
    const totalRakkam = filteredRecords.reduce((acc, record) => acc + record.rakkam, 0);
    const averageFat = filteredRecords.length > 0
      ? filteredRecords.reduce((acc, record) => acc + record.fat, 0) / filteredRecords.length
      : 0;
    const averageSNF = filteredRecords.length > 0
      ? filteredRecords.reduce((acc, record) => acc + record.snf, 0) / filteredRecords.length
      : 0;

    return {
      totalLiter: totalLiter.toFixed(2),
      totalRakkam: totalRakkam.toFixed(2),
      averageFat: averageFat.toFixed(2),
      averageSNF: averageSNF.toFixed(2),
    };
  };

  const calculateTotalLitersForAllUsers = () => {
    let totalLiter = 0;
    let totalFat = 0;
    let totalSNF = 0;
    let totalRakkam = 0;
    let count = 0;

    filteredUsers.forEach(user => {
      const stats = calculateStatistics(user.milkRecords);
      totalLiter += parseFloat(stats.totalLiter);
      totalFat += parseFloat(stats.averageFat);
      totalSNF += parseFloat(stats.averageSNF);
      totalRakkam += parseFloat(stats.totalRakkam);
      count++;
    });

    return {
      totalLiter: totalLiter.toFixed(2),
      totalFat: (totalFat / count).toFixed(2),
      totalSNF: (totalSNF / count).toFixed(2),
      totalRakkam: totalRakkam.toFixed(2),
    };
  };

  const toggleMilkRecords = (userId) => {
    setShowMilkRecords((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId], // Toggle display for the user
    }));
  };

  if (!owner) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='gradient-bg flex flex-col items-center justify-center min-h-screen'>
        <div className="container mx-auto p-4">
          <div className="bg-white p-6 rounded-lg mt-10 shadow-md w-full max-w-4xl mx-auto shadow-white">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Owner Profile
          </h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
              <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2 w-32">
                Register No:
              </strong>
              <span className="text-gray-800 text-lg font-medium">
              {owner.ownerName}
              </span>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
              <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2 w-32">
                Name:
              </strong>
              <span className="text-gray-800 text-lg font-medium">
                {owner.ownerName}
              </span>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
              <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2 w-32">
                Dairy Name:
              </strong>
              <span className="text-gray-800 text-lg font-medium">
                {owner.dairyName}
              </span>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
              <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2 w-32">
                Email:
              </strong>
              <span className="text-gray-800 text-lg font-medium">
                {owner.email}
              </span>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center">
              <strong className="bg-blue-200 text-gray-700 p-2 rounded-md mr-2 w-32">
                Phone:
              </strong>
              <span className="text-gray-800 text-lg font-medium">
                {owner.phone}
              </span>
            </div>
          </div>
        </div>


          <h2 className="text-xl font-bold mb-2">Users </h2>

          {/* Date Range Filter */}
          <div className="bg-white text-black shadow-md rounded-lg p-4 mb-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Start Date</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="text-black p-2 font-mono mr-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm pr-10"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">End Date</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="text-black p-2 font-mono mr-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm pr-10"
      />
    </div>
  </div>
  <button
    onClick={handleFilter}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
  >
    Filter
  </button>
</div>


          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => {
              const userStats = calculateStatistics(user.milkRecords);
              return (
                <div key={user._id} className="border-b border-gray-200 py-2">
                <div className="bg-orange-200 p-4 rounded-lg mt-6 shadow-md w-full max-w-2xl mx-auto shadow-white">
  <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
    User Details
  </h1>
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="bg-blue-100 p-3 rounded-md shadow flex items-center">
      <strong className="bg-blue-200 text-gray-700 px-2 py-1 rounded mr-2 w-24 text-sm">
        User Name
      </strong>
      <span className="text-gray-800 text-sm font-medium">
        {user.name}
      </span>
    </div>
    <div className="bg-blue-100 p-3 rounded-md shadow flex items-center">
      <strong className="bg-blue-200 text-gray-700 px-2 py-1 rounded mr-2 w-24 text-sm">
        Mobile No.
      </strong>
      <span className="text-gray-800 text-sm font-medium">
        {user.phone}
      </span>
    </div>
    <div className="bg-blue-100 p-3 rounded-md shadow flex items-center">
      <strong className="bg-blue-200 text-gray-700 px-2 py-1 rounded mr-2 w-24 text-sm">
        Milk Type
      </strong>
      <span className="text-gray-800 text-sm font-medium">
        {user.milk}
      </span>
    </div>
  </div>
</div>


                  <h3 className="text-lg font-semibold mb-2 shadow-md shadow-gray-400 w-fit mt-6">Milk Records</h3>

                  {/* Button to toggle milk records display */}
                  <button
                    onClick={() => toggleMilkRecords(user._id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mb-4"
                  >
                    {showMilkRecords[user._id] ? 'Hide Milk Records' : 'Show Milk Records'}
                  </button>

                  {showMilkRecords[user._id] && user.milkRecords.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liter</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fat</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SNF</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {user.milkRecords.filter(record =>
                          new Date(record.date) >= new Date(startDate) && new Date(record.date) <= new Date(endDate)
                        ).map(record => (
                          <tr key={record._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {new Date(record.date).toLocaleDateString('en-GB')} {/* Formats date as dd/mm/yyyy */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.liter}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.fat}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.snf}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.rakkam}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Click Above button detailed milk info.</p>
                  )}

                  <div className="bg-blue-300 p-4 rounded-lg mt-6 shadow-md w-full max-w-4xl mx-auto shadow-white">
  <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
    User Statistics
  </h1>
  <div className="flex flex-wrap justify-between items-center gap-4">
    <div className="bg-green-100 p-3 rounded-md shadow flex items-center">
      <strong className="bg-green-200 text-gray-700 px-2 py-1 rounded mr-2 text-sm">
        Total Liter:
      </strong>
      <span className="text-gray-800 text-sm font-medium">
        {userStats.totalLiter}
      </span>
    </div>
    <div className="bg-green-100 p-3 rounded-md shadow flex items-center">
      <strong className="bg-green-200 text-gray-700 px-2 py-1 rounded mr-2 text-sm">
        Average Fat:
      </strong>
      <span className="text-gray-800 text-sm font-medium">
        {userStats.averageFat}
      </span>
    </div>
    <div className="bg-green-100 p-3 rounded-md shadow flex items-center">
      <strong className="bg-green-200 text-gray-700 px-2 py-1 rounded mr-2 text-sm">
        Average SNF:
      </strong>
      <span className="text-gray-800 text-sm font-medium">
        {userStats.averageSNF}
      </span>
    </div>
    <div className="bg-green-100 p-3 rounded-md shadow flex items-center">
      <strong className="bg-green-200 text-gray-700 px-2 py-1 rounded mr-2 text-sm">
        Total Rakkam:
      </strong>
      <span className="text-gray-800 text-sm font-medium">
        {userStats.totalRakkam}
      </span>
    </div>
  </div>
</div>

                </div>
              );
            })
          ) : (
            <p>Click Above button detailed milk info.</p>
          )}

          {/* Final Total */}
          <div className="mt-8 bg-white text-black shadow-md rounded-lg p-4 mb-4">
            <h3 className="text-xl font-semibold mb-2">Final Total for All Users</h3>
            <p><strong>Total Liter:</strong> {calculateTotalLitersForAllUsers().totalLiter}</p>
            <p><strong>Average Fat:</strong> {calculateTotalLitersForAllUsers().totalFat}</p>
            <p><strong>Average SNF:</strong> {calculateTotalLitersForAllUsers().totalSNF}</p>
            <p><strong>Total Rakkam:</strong> {calculateTotalLitersForAllUsers().totalRakkam}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleDairy;
