'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navebars/SanghNavBar';

const Page = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [owner, setOwner] = useState([]);
  const [milkInfo, setMilkInfo] = useState(null); // State for storing milk information

  // Fetch owner data
  useEffect(() => {
    async function getOwners() {
      try {
        const res = await axios.get("/api/sangh/getOwners");
        console.log("sangh Data", res.data.data);
        setOwner(res.data.data);
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
      }
    }
    getOwners();
  }, []);

  // Fetch bill data
  const handleFetchBills = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/sangh/getBills', { startDate, endDate });
      setBillData(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error("Failed to fetch bill data:", error.message);
      setError('Failed to fetch bill data');
    } finally {
      setLoading(false);
    }
  };

  const handleMilkInfo = async (ownerId) => {
    setLoading(true);
    setError('');
    try {
      // Log the dates for debugging
      console.log("Fetching milk info for owner:", ownerId);
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
  
      // Construct query parameters
      const params = {};
      if (startDate) {
        params.startDate = startDate; // Add startDate if provided
      }
      if (endDate) {
        params.endDate = endDate; // Add endDate if provided
      }
  
      // Make the GET request to the API with date range and ownerId
      const res = await axios.get(`/api/sangh/getMilkInfo/${ownerId}`, { params });
  
      // Destructure the response data properly
      const { totalLiters, avgFat, avgSNF, userData } = res.data.data;
  
      // Set the state with the fetched data
      setMilkInfo({
        totalMilk: totalLiters,
        avgFat: avgFat,
        avgSNF: avgSNF,
        userData: userData // If you want to use this for rendering user-specific data
      });
  
      console.log(res.data); // For debugging purposes
    } catch (error) {
      console.error("Failed to fetch milk info:", error.message);
      setError('Failed to fetch milk info');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <Navbar /> {/* Pass the fetched Sangh name to the Navbar */}
      <div className="container text-black mx-auto mt-6">
        <div className="flex justify-center mb-6">
          <h1 className="text-4xl font-bold">सभासद लिस्ट</h1>
        </div>
        
        {/* Date Range Filter */}
        <div className="mb-6">
          <label className="mr-4">Start Date:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="border p-2 rounded-md" 
          />
          <label className="ml-4 mr-4">End Date:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="border p-2 rounded-md" 
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b">Reg No.</th>
                <th className="py-2 px-4 border-b">Owner Name</th>
                <th className="py-2 px-4 border-b">Dairy Name</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Owner Details</th>
                <th className="py-2 px-4 border-b">Milk Info</th> {/* New column for Milk Info button */}
              </tr>
            </thead>
            <tbody>
              {owner.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-2 px-4 border-b text-center">
                    No user created yet
                  </td>
                </tr>
              ) : (
                owner.map((ownerList, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 border-b pl-12">{ownerList.registerNo}</td>
                    <td className="py-2 border-b pl-12">{ownerList.ownerName}</td>
                    <td className="py-2 border-b pl-12">{ownerList.dairyName}</td>
                    <td className="py-2 border-b pl-12">{ownerList.phone}</td>
                    <td className="py-2 border-b pl-12">{ownerList.email}</td>
                    <td className="py-2 border-b pl-12">
                      <Link href={`/home/AllDairies/${ownerList._id}`}>
                        <button className='bg-blue-400 hover:bg-blue-700 text-white rounded-md p-2 flex items-center'>
                          <span>User Details</span>
                        </button>
                      </Link>
                    </td>
                    <td className="py-2 border-b">
                      {/* Milk Info Button */}
                      <button
                        className="bg-green-400 hover:bg-green-700 text-white rounded-md p-2"
                        onClick={() => handleMilkInfo(ownerList._id)} // Pass the ownerId
                      >
                        Milk Info
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Display Milk Info if available */}
        {milkInfo && (
          <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold">Milk Info for Owner</h2>
            <p>Total Milk: {milkInfo.totalMilk} L</p>
            <p>Average Fat: {milkInfo.avgFat}%</p>
            <p>Average SNF: {milkInfo.avgSNF}%</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
