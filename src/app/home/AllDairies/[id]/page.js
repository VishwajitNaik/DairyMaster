'use client';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (id) {
      fetchOwnerDetails();
    }
    
    // Set default start and end dates to current date
    const currentDate = new Date().toISOString().split('T')[0];
    setStartDate(currentDate);
    setEndDate(currentDate);
  }, [id]);

  const fetchOwnerDetails = async () => {
    try {
      const res = await axios.get(`/api/owner/getOwners/${id}`);
      setOwner(res.data.data);
      setUsers(res.data.userData);
      setFilteredUsers(res.data.userData); // Initialize filtered users
    } catch (error) {
      console.error('Error fetching owner details:', error.message);
    }
  };

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      return; // Optionally handle missing dates
    }
    try {
      const res = await axios.get(`/api/owner/getOwners/${id}?startDate=${startDate}&endDate=${endDate}`);
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
      averageFat: averageFat.toFixed(2),
      totalRakkam: totalRakkam.toFixed(2),
      averageSNF: averageSNF.toFixed(2),
    };
  };

  const calculateTotalLitersForAllUsers = () => {
    let totalLiter = 0;
    let totalFat = 0;
    let totalSNF = 0;
    let count = 0;

    filteredUsers.forEach(user => {
      user.milkRecords.filter(record =>
        new Date(record.date) >= new Date(startDate) && new Date(record.date) <= new Date(endDate)
      ).forEach(record => {
        totalLiter += record.liter;
        totalFat += record.fat;
        totalSNF += record.snf;
        count++;
      });
    });

    const averageFat = count > 0 ? (totalFat / count).toFixed(2) : 0;
    const averageSNF = count > 0 ? (totalSNF / count).toFixed(2) : 0;

    return {
      totalLiter: totalLiter.toFixed(2),
      averageFat,
      averageSNF,
    };
  };

  if (!owner) {
    return <div>Loading...</div>;
  }

  const { totalLiter, averageFat, averageSNF } = calculateTotalLitersForAllUsers();

  return (
    <>
    <div className='gradient-bg flex flex-col items-center justify-center min-h-screen'>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Owner Details</h1>
        <div className="bg-white text-black shadow-md rounded-lg p-4 mb-4">
          <p><span className='font-semibold'>Name:</span> {owner.ownerName}</p>
          <p><span className='font-semibold'>Dairy Name:</span> {owner.dairyName}</p>
          <p><span className='font-semibold'>Owner ID:</span> {owner._id}</p>
        </div>

        <h2 className="text-xl font-bold mb-2">Users Created by {owner.ownerName}</h2>

        {/* Date Range Filter */}
        <div className="bg-white text-black shadow-md rounded-lg p-4 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleFilter}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Filter
          </button>
        </div>

        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div key={user._id} className="border-b border-gray-200 py-2">
              <p><span className='font-semibold'>User Name:</span> {user.name}</p>
              <p><span className='font-semibold'>User ID:</span> {user._id}</p>
              <p><span className='font-semibold'>Milk Type:</span> {user.milk}</p>

              <h3 className="text-lg font-semibold mb-2">Milk Records</h3>
              {user.milkRecords.length > 0 ? (
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
                    <tr className="bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900" colSpan="2">User Totals</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calculateStatistics(user.milkRecords).averageFat} Fat (Avg)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calculateStatistics(user.milkRecords).averageSNF} SNF (Avg)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calculateStatistics(user.milkRecords).totalLiter} Liters
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>No milk records for this user in the selected date range.</p>
              )}
            </div>
          ))
        ) : (
          <p>No users found for this owner.</p>
        )}


        <div className="bg-white text-black shadow-md rounded-lg p-4 mb-4">
          <p><span className='font-semibold'>Total Milk:</span> {totalLiter} Liters</p>
          <p><span className='font-semibold'>Average Fat:</span> {averageFat}</p>
          <p><span className='font-semibold'>Average SNF:</span> {averageSNF}</p>
        </div>
      </div>
      </div>
    </>
  );
};

export default SingleDairy;
