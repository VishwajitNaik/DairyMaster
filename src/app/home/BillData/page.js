'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Loading from '@/app/components/Loading/Loading';
import { ToastContainer, toast as Toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BillSummary = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [billsGenerated, setBillsGenerated] = useState(false); // New state to track bill generation

  const handleFetchBills = async () => {
    setLoading(true);
    setError('');
    setBillsGenerated(true); // Mark bills as generated
    try {
      const response = await axios.post('/api/billkapat/bills', { startDate, endDate });
      setBillData(response.data.data);
    } catch (error) {
      Toast.error("या तारखे मधील बिल सेव केले आहे ");
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
      alert(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // Show alert on frontend
    } else {
        Toast.error("सर्वर डाउन आहे कृपया थोड्या वेळाने पुन्हा प्रयत्न करा");
    }
    } finally {
      setLoading(false);
    }
  };

  const totalLiters = billData.reduce((acc, item) => acc + parseFloat(item.totalLiters || 0), 0).toFixed(1);
  const totalBuffLiter = billData.filter(item => item.totalBuffLiter).reduce((acc, item) => acc + parseFloat(item.totalBuffLiter || 0), 0).toFixed(1);
  const totalCowLiter = billData.filter(item => item.totalCowLiter).reduce((acc, item) => acc + parseFloat(item.totalCowLiter || 0), 0).toFixed(1);
  const totalRakkam = billData.reduce((acc, item) => acc + parseFloat(item.totalRakkam || 0), 0).toFixed(1);
  const totalBuffRakkam = billData.filter(item => item.totalBuffRakkam).reduce((acc, item) => acc + parseFloat(item.totalBuffRakkam || 0), 0).toFixed(1);
  const totalCowRakkam = billData.filter(item => item.totalCowRakkam).reduce((acc, item) => acc + parseFloat(item.totalCowRakkam || 0), 0).toFixed(1);
  const totalKapatRate = billData.reduce((acc, item) => acc + parseFloat(item.totalKapatRateMultiplybyTotalLiter || 0), 0).toFixed(1);
  const totalBuffBillKapat = billData.reduce((acc, item) => acc + parseFloat(item.totalBuffBillKapat || 0), 0).toFixed(1);
  const totalCowBillKapat = billData.reduce((acc, item) => acc + parseFloat(item.totalCowBillKapat || 0), 0).toFixed(1);
  const totalBillKapat = billData.reduce((acc, item) => acc + parseFloat(item.totalBillKapat || 0), 0).toFixed(1);
  const totalNetPayment = billData.reduce((acc, item) => acc + parseFloat(item.netPayment || 0), 0).toFixed(1);

  if (loading)
    return (
      <div className="text-center mt-20">
        <Loading />
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <>
<style>
  {`
    @media print {
      @page {
        size: A4 landscape;
        margin: 10mm;
      }

      .gradient-bg {
        transform: scale(0.95);
        transform-origin: top left;
        padding: 0;
      }

      table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
      }

      th, td {
        border: 1px solid #000;
        padding: 15px !important;
        text-align: center;
        font-size: 16px !important;
        height: 40px !important;
        word-wrap: break-word;
      }

      .p-3, .py-2, .px-4 {
        padding: 5px !important;
      }

      .gradient-bg button, 
      .gradient-bg form {
        display: none;
      }

      body {
        font-size: 16px;
        color: #000;
      }

      /* Ensure summary report starts on a new page */
      .summary-report {
        margin-top: -20px;
        page-break-before: always; /* For older browsers */
        break-before: page; /* Modern browsers */
      }
    }
  `}
</style>

<div className="gradient-bg flex flex-col min-h-screen">
  {!billsGenerated ? (
    <div className='bg-gray-300 p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto mt-20 '>
      <h1 className='text-2xl font-semibold text-blue-900 shadow-md text-shadow-lg mb-4'>बिल तयार करणे </h1>
      <form onSubmit={(e) => { e.preventDefault(); handleFetchBills(); }} className='bg-gray-100 p-4 rounded-lg shadow-md'>
        <div className='flex flex-col md:flex-row md:space-x-4 mb-4'>
          <div className='flex flex-col mb-4 md:mb-0'>
            <label htmlFor="startDate" className='text-black font-semibold'>पासून</label>
            <input
              type="date"
              id="startDate"
              className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className='flex flex-col mb-4 md:mb-0'>
            <label htmlFor="endDate" className='text-black font-semibold'>पर्यंत</label>
            <input
              type="date"
              id="endDate"
              className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className='flex justify-center'>
          <button
            type="submit"
            className='w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'
            disabled={loading}
          >
            {loading ? "Fetching..." : "Generate Bills"}
          </button>
        </div>
      </form>

      {error && <div className='mt-4 text-red-500'>{error}</div>}
    </div>
  ) : (
    <div className='mt-6 bg-gray-300 p-6 rounded-lg w-full max-w-6xl mx-auto shadow-black shadow-md mb-4'>
      <h2 className='text-xl font-semibold text-black mb-4 mt-6 shadow-md w-fit p-2 rounded-md'>बिल तपशील </h2>
      <div className='flex gap-12 flax-row'>
        <h2 className='text-xl font-semibold text-black mb-4 border border-gray-400 p-2'>पासून  {new Date(startDate).toLocaleDateString('en-GB')}</h2>
        <h2 className='text-xl font-semibold text-black mb-4 border border-gray-400 p-2'>पर्यंत  {new Date(endDate).toLocaleDateString('en-GB')}</h2>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-full border border-gray-300 shadow-md shadow-black'>
          <thead>
            <tr className='bg-gray-400'>
              <th className='p-3 text-black font-semibold border text-center border-gray-700'>रजि नं. </th>
              <th className='p-3 text-black font-semibold border text-center border-gray-700'>उत्पादकाचे नाव </th>
              <th className='p-3 text-black font-semibold border text-center border-gray-700'>एकूण लिटर </th>
              <th className='p-3 text-black font-semibold border text-center border-gray-700'>एकूण रक्कम </th>
              <th className='p-3 text-black font-semibold border text-center border-gray-700'>एकूण कपात </th>
              <th className='p-3 text-black font-semibold border text-center border-gray-700'>बील कपात </th>
              <th className='p-3 text-black font-semibold border text-center border-gray-700'>निव्वळ अदा </th>
              <th className='p-3 text-black font-semibold border text-center border-gray-700'>सही</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-300'>
            {billData.filter((item) => parseFloat(item.totalLiters) > 0)
              .map((item, index) => (
                <tr key={index} className='hover:bg-gray-100'>
                  <td className='p-3 text-center  border border-gray-500 text-black'>{item.registerNo}</td>
                  <td className='p-3 text-center  border-gray-500 text-black border '>{item.user}</td>
                  <td className='p-3 text-center  border-gray-500 text-black border '>{Math.floor(item.totalLiters)}</td>
                  <td className='p-3 text-center  border-gray-500 text-black border '>{item.totalRakkam}</td>
                  <td className='p-3 text-center  border-gray-500 text-black border '>{Math.floor(item.totalKapatRateMultiplybyTotalLiter)}</td>
                  <td className='p-3 text-center  border-gray-500 text-black border '>{item.totalBillKapat}</td>
                  <td className='p-3 text-center  border-gray-500 text-black border '>{item.netPayment}</td>
                  <td className='p-3 text-center  border-gray-500 text-black border '>{item.sahi}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4'>
        <button
          onClick={handlePrint}
          className='w-full md:w-36 py-2 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105 mr-4'>
          प्रिंट बिल  
        </button>
        <button
          onClick={handleSaveBills}
          className='w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'>
          बिल  जतन करा 
        </button>
        {/* Add the summary-report class here */}
        <div className='mt-24 bg-gray-100 p-4 rounded-lg summary-report'>
          <h3 className='text-lg font-semibold text-black bg-green-300 p-2 shadow-md w-fit rounded-md'>समरी रीपोर्ट</h3>
          <div className='mt-2'>
            {/* Buffalo Table */}
            <div className='flex flex-row justify-between space-x-4'>
              {/* Buffalo Table */}
              <div className='w-1/2 bg-blue-100'>
                <h2 className='text-blue-600 text-lg font-bold m-4 shadow-lg sm:p-2 w-fit'>म्हैस तपशील</h2>
                <table className='min-w-full table-auto border-collapse border border-gray-200'>
                  <thead>
                    <tr>
                      <th className='text-black px-4 py-2 text-left font-semibold'>प्रकार </th>
                      <th className='text-black px-4 py-2 text-left font-semibold'>रक्कम </th>
                    </tr>
                  </thead>
                  <tbody className='border border-gray-500'>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'><strong>लिटर </strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'>{totalBuffLiter}</td>
                    </tr>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500'><strong>रक्कम </strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500'>{totalBuffRakkam}</td>
                    </tr>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'><strong>बिल कपात </strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'>{totalBuffBillKapat}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cow Table */}
              <div className='w-1/2 bg-blue-100'>
                <h2 className='text-blue-600 text-lg font-bold m-4 shadow-lg sm:p-2 w-fit'>गाय तपशील </h2>
                <table className='min-w-full table-auto border-collapse border border-gray-200'>
                  <thead>
                    <tr>
                      <th className='text-black px-4 py-2 text-left font-semibold'>प्रकार </th>
                      <th className='text-black px-4 py-2 text-left font-semibold'>रक्कम </th>
                    </tr>
                  </thead>
                  <tbody className='border border-gray-500'>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'><strong>लिटर </strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'>{totalCowLiter}</td>
                    </tr>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500'><strong>रक्कम </strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500'>{totalCowRakkam}</td>
                    </tr>
                    <tr>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'><strong>बिल कपात </strong></td>
                      <td className='text-black px-4 py-2 border border-gray-500 bg-gray-300'>{totalCowBillKapat}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Final Total Table */}
            <h2 className='text-lg font-bold mt-4 text-black bg-green-300 p-2 shadow-md w-fit rounded-md'>टोटल </h2>
            <table className='min-w-full table-auto border-collapse border border-gray-200 mt-2'>
              <thead>
                <tr>
                  <th className='border border-gray-500 bg-gray-300 text-black px-4 py-2 font-semibold text-center'>प्रकार </th>
                  <th className='border border-gray-500 bg-gray-300 text-black px-4 py-2 font-semibold text-center'>रक्कम </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'><strong>एकूण लिटर </strong></td>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'>{totalLiters}</td>
                </tr>
                <tr>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'><strong>एकूण रक्कम </strong></td>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'>{totalRakkam}</td>
                </tr>
                <tr>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'><strong>एकूण कपात </strong></td>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'>{totalKapatRate}</td>
                </tr>
                <tr>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'><strong>एकूण बिल कपात </strong></td>
                  <td className='text-black px-4 py-2 border border-gray-500 text-center'>{totalBillKapat}</td>
                </tr>
                <tr>
                  <td className='bg-gray-200 text-black px-4 py-2 border border-gray-500 text-center'><strong>निव्वळ रक्कम </strong></td>
                  <td className='bg-gray-200 text-black px-4 py-2 border border-gray-500 text-center'>{totalNetPayment}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )}
</div>
    </>
  );
};

export default BillSummary;


