'use client';
import React, { useState } from 'react';
import axios from 'axios';

const BillSummary = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  const handleFetchBills = async () => {
    setLoading(true);
    setError(''); // Reset error state
    try {
      const response = await axios.post('/api/billkapat/bills', { startDate, endDate });
      setBillData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch bill data:", error.message);
      setError('Failed to fetch bill data');
    } finally {
      setLoading(false);
    }
  };

  const handleOwners = async () =>{
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/owner/')
    } catch (error) {
      
    }
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto'>
        <h1 className='text-2xl font-semibold text-black mb-4'>Bill Summary</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleFetchBills(); }} className='bg-gray-100 p-4 rounded-lg shadow-md'>
          <div className='flex flex-col md:flex-row md:space-x-4 mb-4'>
            <div className='flex flex-col mb-4 md:mb-0'>
              <label htmlFor="startDate" className='text-black font-medium'>Start Date:</label>
              <input
                type="date"
                id="startDate"
                className="p-2 rounded-md border border-gray-300 bg-white text-black"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className='flex flex-col mb-4 md:mb-0'>
              <label htmlFor="endDate" className='text-black font-medium'>End Date:</label>
              <input
                type="date"
                id="endDate"
                className="p-2 rounded-md border border-gray-300 bg-white text-black"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className='w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md'
            disabled={loading}
          >
            {loading ? "Fetching..." : "Generate Bills"}
          </button>
        </form>

        {error && <div className='mt-4 text-red-500'>{error}</div>}
      </div>

      {billData.length > 0 && (
        <div className='mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto'>
          <h2 className='text-xl font-semibold text-black mb-4'>Bill Details</h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-300 border border-separate'>
              <thead>
                <tr className='bg-gray-200 border border-separate'>
                  <th className='p-3 text-left text-black font-semibold'>User</th>
                  <th className='p-3 text-left text-black font-semibold'>Total Liters</th>
                  <th className='p-3 text-left text-black font-semibold'>Total Rakkam</th>
                  <th className='p-3 text-left text-black font-semibold'>Total Kapat Rate</th>
                  <th className='p-3 text-left text-black font-semibold'>Total Bill Kapat</th>
                  <th className='p-3 text-left text-black font-semibold'>Net Payment</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-300'>
                {billData.map((item, index) => (
                  <tr key={index} className='hover:bg-gray-100'>
                    <td className='p-3 text-black'>{item.user}</td>
                    <td className='p-3 text-black'>{item.totalLiters}</td>
                    <td className='p-3 text-black'>{item.totalRakkam}</td>
                    <td className='p-3 text-black'>{item.totalKapatRateMultiplybyTotalLiter}</td>
                    <td className='p-3 text-black'>{item.totalBillKapat}</td>
                    <td className='p-3 text-black'>{item.netPayment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='mt-4 text-center'>
            <button 
              onClick={handlePrint} 
              className='py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md'
            >
              Print Summary
            </button>
          </div>
        </div>
      )}

      {billData.length === 0 && !loading && !error && (
        <div className='mt-4 text-black text-center'>No bills found for the selected date range.</div>
      )}
    </>
  );
};

export default BillSummary;
