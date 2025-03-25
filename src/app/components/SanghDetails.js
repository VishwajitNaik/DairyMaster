'use client';
import axios from 'axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Page = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [owner, setOwner] = useState([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);
  const [milkInfo, setMilkInfo] = useState(null);
  const [vikriMilkInfo, setVikriMilkInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function getOwners() {
      try {
        const res = await axios.get('/api/sangh/getOwners');
        setOwner(res.data.data);
      } catch (error) {
        console.error('Failed to fetch owners:', error.message);
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
      setMilkInfo(res.data.data);
      setSelectedOwnerId(ownerId);
    } catch (error) {
      setError('Failed to fetch milk info');
    } finally {
      setLoading(false);
    }
  };

  const handleVikriMilkInfo = async (ownerId) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/sangh/getVikriMilk/${ownerId}`, {
        params: { startDate, endDate },
      });
      setVikriMilkInfo(res.data.data);
      setSelectedOwnerId(ownerId);
    } catch (error) {
      setError('Failed to fetch Vikri milk info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen p-4">
    <div className="container text-black mx-auto mt-6">
      <h1 className="text-2xl md:text-4xl font-bold shadow-md shadow-gray-700 p-4 text-center mb-4">ओनर लिस्ट</h1>
      
      <div className="mb-6 flex flex-col md:flex-row items-center">
        <p className='text-xl font-bold text-white mr-4'>Milk Info Date</p>
        <label className="text-xl font-semibold">Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 text-xl border rounded-md mx-2" />
        <label className="text-xl font-semibold">End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 text-xl border rounded-md mx-2" />
      </div>
  
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b">रजि. नं. </th>
            <th className="py-2 px-4 border-b">ओनरचे नाव</th>
            <th className="py-2 px-4 border-b">डेअरीचे नाव</th>
            <th className="py-2 px-4 border-b">मोबाईल नं. </th>
            <th className="py-2 px-4 border-b"> विक्री तपशील</th>
            <th className="py-2 px-4 border-b">दूध तपशील</th>
          </tr>
        </thead>
        <tbody>
          {owner.map((ownerList) => (
            <React.Fragment key={ownerList._id}>
              <tr className="hover:bg-gray-100">
                <td className="py-2 border-b px-4">{ownerList.registerNo}</td>
                <td className="py-2 border-b px-4">{ownerList.ownerName}</td>
                <td className="py-2 border-b px-4">{ownerList.dairyName}</td>
                <td className="py-2 border-b px-4">{ownerList.phone}</td>
                <td className="py-2 border-b px-4 text-center">
                  <button className=" hover:bg-blue-500 text-black p-2 border-b-2 border-blue-700 rounded-md" onClick={() => handleVikriMilkInfo(ownerList._id)}>
                    विक्री दूध
                  </button>
                </td>
                <td className="py-2 border-b px-4 text-center">
                  <button className="text-black hover:bg-green-500 border-b-2 border-green-700 p-2 rounded-md" onClick={() => handleMilkInfo(ownerList._id)}>
                    दूध तपशील
                  </button>
                </td>

                <td className="py-2 border-b px-2 md:px-4 text-left">
                          <Link href={`/home/AllDairies/${ownerList._id}`}>
                            <button className="bg-blue-400 hover:bg-blue-700 text-white rounded-md p-2 flex items-center justify-center">
                              <span>ओनरची माहिती</span>
                            </button>
                          </Link>
                        </td>
              </tr>
              {selectedOwnerId === ownerList._id && milkInfo && (
                <tr>
  <td colSpan="6" className="bg-blue-200 p-4 border-b">
    <h2 className="text-lg font-bold">एकूण दूध तपशील</h2>

    {/* Buffalo Milk Table */}
    <h3 className="text-md font-semibold mt-4 ">म्हैस दूध</h3>
    <table className="min-w-full bg-white border border-gray-200 mt-2">
      <thead>
        <tr className="bg-gray-300">
          <th className="py-2 px-4 border-b">एकूण लिटर</th>
          <th className="py-2 px-4 border-b">फॅट </th>
          <th className="py-2 px-4 border-b">SNF</th>
          <th className="py-2 px-4 border-b">रक्कम</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-4 border-b text-center">{milkInfo.totalBuffLiters} L</td>
          <td className="py-2 px-4 border-b text-center">{milkInfo.avgBuffFat}</td>
          <td className="py-2 px-4 border-b text-center">{milkInfo.avgBuffSNF}</td>
          <td className="py-2 px-4 border-b text-center">{milkInfo.buffRakkam}</td>
        </tr>
      </tbody>
    </table>

    {/* Cow Milk Table */}
    <h3 className="text-md font-semibold mt-4">गाय दूध</h3>
    <table className="min-w-full bg-white border border-gray-200 mt-2">
      <thead>
        <tr className="bg-gray-300">
          <th className="py-2 px-4 border-b">लिटर </th>
          <th className="py-2 px-4 border-b">फॅट </th>
          <th className="py-2 px-4 border-b">SNF</th>
          <th className="py-2 px-4 border-b">रक्कम </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-4 border-b text-center">{milkInfo.totalcowLiters} L</td>
          <td className="py-2 px-4 border-b text-center">{milkInfo.avgCowFat}</td>
          <td className="py-2 px-4 border-b text-center">{milkInfo.avgCowSNF}</td>
          <td className="py-2 px-4 border-b text-center">{milkInfo.cowRakkam}</td>
        </tr>
      </tbody>
    </table>

    {/* Total Milk Table */}
    <h3 className="text-md font-semibold mt-4">समरी</h3>
    <table className="min-w-full bg-white border border-gray-200 mt-2">
      <thead>
        <tr className="bg-gray-300">
          <th className="py-2 px-4 border-b">एकूण दूध</th>
          <th className="py-2 px-4 border-b">एकूण रक्कम</th>
          <th className="py-2 px-4 border-b">निव्वळ दूध </th>
          <th className="py-2 px-4 border-b">निव्वळ रक्कम </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-4 border-b text-center">{milkInfo.totalLiters} L</td>
          <td className="py-2 px-4 border-b text-center">{milkInfo.totalRakkam}</td>
          <td className="py-2 px-4 border-b text-center">
            {Math.abs(vikriMilkInfo?.totalLiters - milkInfo.totalLiters).toFixed(2)} L
          </td>
          <td className="py-2 px-4 border-b text-center">
            {Math.abs(vikriMilkInfo?.totalRakkam - milkInfo.totalRakkam).toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>

              )}
              {selectedOwnerId === ownerList._id && vikriMilkInfo && (
                <tr>
  <td colSpan="6" className="bg-gray-200 p-4 border-b">
    <h2 className="text-lg font-bold text-red-700">विक्री दूध तपशील</h2>
    <table className="min-w-full mt-2 border border-gray-300">
      <thead>
        <tr className="bg-gray-300"> 
          <th className="py-2 px-4 border-b text-center">एकूण दूध </th>
          <th className="py-2 px-4 border-b text-center">एकूण रक्कम </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-4 border-b text-center">{vikriMilkInfo?.totalLiters || 0} <span className='text-blue-800 font-semibold'>L</span></td>
          <td className="py-2 px-4 border-b text-center">{vikriMilkInfo?.totalRakkam || 0}</td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>

              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default Page;
