'use client';
import React, { useState } from 'react';
import axios from 'axios';

const BillSummary = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [billsGenerated, setBillsGenerated] = useState(false);  // New state to track bill generation
  const itemsPerPage = 8;

  const handleFetchBills = async () => {
    setLoading(true);
    setError('');
    setBillsGenerated(true); // Mark bills as generated
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

  const handlePrint = () => {
    window.print();
  };

  const handleSaveBills = async () => {
    if (billData.length === 0) {
      setError("No bills to save.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/billkapat/store', { bills: billData, startDate, endDate });
      console.log('Bills saved successfully:', response.data);
      alert('Bills saved successfully!');
    } catch (error) {
      console.error("Failed to save bill data:", error.message);
      setError('Failed to save bill data');
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastBill = currentPage * itemsPerPage;
  const indexOfFirstBill = indexOfLastBill - itemsPerPage;
  const currentBills = billData.slice(indexOfFirstBill, indexOfLastBill);

  const totalPages = Math.ceil(billData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalLiters = billData.reduce((acc, item) => acc + parseFloat(item.totalLiters || 0), 0).toFixed(1);
  const totalRakkam = billData.reduce((acc, item) => acc + parseFloat(item.totalRakkam || 0), 0).toFixed(1);
  const totalKapatRate = billData.reduce((acc, item) => acc + parseFloat(item.totalKapatRateMultiplybyTotalLiter || 0), 0).toFixed(1);
  const totalBillKapat = billData.reduce((acc, item) => acc + parseFloat(item.totalBillKapat || 0), 0).toFixed(1);
  const totalNetPayment = billData.reduce((acc, item) => acc + parseFloat(item.netPayment || 0), 0).toFixed(1);
  
  

  return (
    <>
      <div className="gradient-bg flex flex-col min-h-screen">
        {!billsGenerated ? (
          <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto'>
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
        ) : (
          <div className='mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-6xl mx-auto'>

            <h2 className='text-xl font-semibold text-black mb-4 mt-6'>Bill Details</h2>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-full border border-gray-300'>
                <thead>
                  <tr className='bg-gray-200'>
                    <th className='p-3 text-left text-black font-semibold border border-gray-300' colSpan={7}>
                      {`Date Range: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`}
                    </th>
                  </tr>
                  <tr className='bg-gray-200'>
                    <th className='p-3 text-left text-black font-semibold border border-gray-300'>Register No</th>
                    <th className='p-3 text-left text-black font-semibold border border-gray-300'>User</th>
                    <th className='p-3 text-left text-black font-semibold border border-gray-300'>Total Liters</th>
                    <th className='p-3 text-left text-black font-semibold border border-gray-300'>Total Rakkam</th>
                    <th className='p-3 text-left text-black font-semibold border border-gray-300'>Total Kapat Rate</th>
                    <th className='p-3 text-left text-black font-semibold border border-gray-300'>Total Bill Kapat</th>
                    <th className='p-3 text-left text-black font-semibold border border-gray-300'>Net Payment</th>
                    <th className='p-3 text-left text-black font-semibold border border-gray-300 w-24'>सही</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-300'>
                  {currentBills.map((item, index) => (
                    <tr key={index} className='hover:bg-gray-100'>
                      <td className='p-3 text-black border border-gray-300'>{item.registerNo}</td>
                      <td className='p-3 text-black border border-gray-300'>{item.user}</td>
                      <td className='p-3 text-black border border-gray-300'>{item.totalLiters}</td>
                      <td className='p-3 text-black border border-gray-300'>{item.totalRakkam}</td>
                      <td className='p-3 text-black border border-gray-300'>{item.totalKapatRateMultiplybyTotalLiter.toFixed(1)}</td>
                      <td className='p-3 text-black border border-gray-300'>{item.totalBillKapat}</td>
                      <td className='p-3 text-black border border-gray-300'>{item.netPayment}</td>
                      <td className='p-3 text-black border border-gray-300 w-24'></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='flex justify-between items-center mt-4'>
              <button 
                onClick={handlePrevPage} 
                className='px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-md'
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button 
                onClick={handleNextPage} 
                className='px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-md'
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button 
                onClick={handleSaveBills}
                className='py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md'
              >
                Save Bills
              </button>
            </div>
                        {/* Final Summary Report */}
                        <div className='mt-24 bg-gray-100 p-4 rounded-lg'>
                          <h3 className='text-lg font-semibold text-black'>Final Summary Report</h3>
                          <div className='mt-2'>
                            <table className='min-w-full table-auto'>
                              <thead>
                                <tr>
                                  <th className='text-black px-4 py-2 text-left font-semibold'>Description</th>
                                  <th className='text-black px-4 py-2 text-left font-semibold'>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className='text-black px-4 py-2'><strong>Total Liters:</strong></td>
                                  <td className='text-black px-4 py-2'>{totalLiters}</td>
                                </tr>
                                <tr>
                                  <td className='text-black px-4 py-2'><strong>Total Rakkam:</strong></td>
                                  <td className='text-black px-4 py-2'>{totalRakkam}</td>
                                </tr>
                                <tr>
                                  <td className='text-black px-4 py-2'><strong>Total Kapat Rate:</strong></td>
                                  <td className='text-black px-4 py-2'>{totalKapatRate}</td>
                                </tr>
                                <tr>
                                  <td className='text-black px-4 py-2'><strong>Total Bill Kapat:</strong></td>
                                  <td className='text-black px-4 py-2'>{totalBillKapat}</td>
                                </tr>
                                <tr>
                                  <td className='text-black px-4 py-2'><strong>Total Net Payment:</strong></td>
                                  <td className='text-black px-4 py-2'>{totalNetPayment}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>


            <button 
              onClick={handlePrint} 
              className='py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md mt-4'
            >
              Print Summary
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BillSummary;
