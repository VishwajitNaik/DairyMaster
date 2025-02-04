'use client';
import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [owner, setOwner] = useState([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState(null); // Track selected owner for Milk Info
  const [milkInfo, setMilkInfo] = useState(null);

  // Fetch owner data
  useEffect(() => {
    async function getOwners() {
      try {
        const res = await axios.get('/api/sangh/getOwners');
        console.log('Sangh Data', res.data.data);
        setOwner(res.data.data);
      } catch (error) {
        console.log('Failed to fetch users:', error.message);
      }
    }
    getOwners();
  }, []);


  
  const handleMilkInfo = async (ownerId) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/sangh/getMilkInfo/${ownerId}`, {
        params: { startDate, endDate },
      });

      const { totalLiters, avgFat, avgSNF, totalRakkam } = res.data.data;
      setMilkInfo({
        totalMilk: totalLiters,
        avgFat,
        avgSNF,
        totalRakkam,
      });
      setSelectedOwnerId(ownerId); // Set the selected owner for displaying milk info
      console.log(res.data);
    } catch (error) {
      console.error('Failed to fetch milk info:', error.message);
      setError('Failed to fetch milk info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="gradient-bg flex flex-col min-h-screen p-4">
        <div className="container text-black mx-auto mt-6">
          <div className="flex justify-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold shadow-md shadow-gray-700 p-4">ओनर लिस्ट</h1>
          </div>

          {/* Date Range Filter */}
          <div className="mb-6 flex flex-col md:flex-row items-center">
          <p className='text-xl font-bold text-white mr-4'>Milk Info Date</p>
            <label className="mr-2 mb-2 md:mb-0 text-xl font-semibold">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-1/5 bg-gray-200 rounded-md shadow-sm"
            />
            <label className="mr-2 ml-0 md:ml-4 mb-2 md:mb-0 text-xl font-semibold">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-1/5 bg-gray-200 rounded-md shadow-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-2 md:px-4 border-b">Reg No.</th>
                  <th className="py-2 px-2 md:px-4 border-b">Owner Name</th>
                  <th className="py-2 px-2 md:px-4 border-b">Dairy Name</th>
                  <th className="py-2 px-2 md:px-4 border-b">Phone</th>
                  <th className="py-2 px-2 md:px-4 border-b">Email</th>
                  <th className="py-2 px-2 md:px-4 border-b">Owner Details</th>
                  <th className="py-2 px-2 md:px-4 border-b">Milk Info</th>
                </tr>
              </thead>
              <tbody>
                {owner.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-2 px-4 border-b text-center">
                      No user created yet
                    </td>
                  </tr>
                ) : (
                  owner.map((ownerList, index) => (
                    <React.Fragment key={index}>
                      <tr className="hover:bg-gray-100">
                        <td className="py-2 border-b px-2 md:px-4 text-left">{ownerList.registerNo}</td>
                        <td className="py-2 border-b px-2 md:px-4 text-left">{ownerList.ownerName}</td>
                        <td className="py-2 border-b px-2 md:px-4 text-left">{ownerList.dairyName}</td>
                        <td className="py-2 border-b px-2 md:px-4 text-left">{ownerList.phone}</td>
                        <td className="py-2 border-b px-2 md:px-4 text-left">{ownerList.email}</td>
                        <td className="py-2 border-b px-2 md:px-4 text-left">
                          <Link href={`/home/AllDairies/${ownerList._id}`}>
                            <button className="bg-blue-400 hover:bg-blue-700 text-white rounded-md p-2 flex items-center justify-center">
                              <span>User Details</span>
                            </button>
                          </Link>
                        </td>
                        <td className="py-2 border-b px-2 md:px-4 text-center">
                          <button
                            className="bg-green-400 hover:bg-green-700 text-white rounded-md p-2"
                            onClick={() => handleMilkInfo(ownerList._id)}
                          >
                            Milk Info
                          </button>
                        </td>
                      </tr>
                      {selectedOwnerId === ownerList._id && milkInfo && (
  <tr>
    <td colSpan="7" className="bg-gray-100 p-4 border-b">
      <div className="text-left">
        <h2 className="text-lg font-bold mb-2">
          Milk Info for {ownerList.ownerName}
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-4 py-2 text-left">Total Milk (L)</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Average Fat (%)</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Average SNF (%)</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Total Rakkam</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="border border-gray-400 px-4 py-2">{milkInfo.totalMilk}</td>
              <td className="border border-gray-400 px-4 py-2">{milkInfo.avgFat}</td>
              <td className="border border-gray-400 px-4 py-2">{milkInfo.avgSNF}</td>
              <td className="border border-gray-400 px-4 py-2">{milkInfo.totalRakkam}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </td>
  </tr>
)}

                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;