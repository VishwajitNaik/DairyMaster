'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const AddSthirkapatForm = ({ onSubmit }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [kapatType, setKapatType] = useState('');
  const [kapatCode, setKapatCode] = useState('');
  const [kapatName, setKapatName] = useState('');
  const [kapatRate, setKapatRate] = useState('');

  const handleKapatTypeChange = (event) => {
    setKapatType(event.target.value);
    if (event.target.value === 'Sthir Kapat') {
      setKapatRate(''); // Reset kapatRate if switching to Sthir Kapat
    } else {
      setKapatRate(''); // Clear kapatRate if switching to Kapat
    }
  };

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    setCurrentDate(formattedDate);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      date: currentDate,
      KapatType: kapatType,
      kapatCode,
      kapatName,
      kapatRate: kapatType === 'Sthir Kapat' ? kapatRate : null, // Ensure kapatRate is only included for Sthir Kapat
    };

    console.log("payload", payload);
    try {
      const res = await axios.post("/api/kapat/addkapat", payload);
      console.log(res.data.message);
      // Clear form information after successful submission
      setCurrentDate(new Date().toISOString().split('T')[0]);
      setKapatType('');
      setKapatCode('');
      setKapatName('');
      setKapatRate('');
    } catch (error) {
      console.error("Error storing kapat information:", error.message);
    }
  };

  return (
    <div className="gradient-bg flex flex-col items-center justify-center min-h-screen">
    <div className=' p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto shadow-black'>
      <h1 className='text-2xl font-semibold text-white mb-4'>कपातीची नावे भरा </h1>
      <form onSubmit={handleSubmit} className='bg-gray-500 p-4 rounded-lg'>
        <div className='mb-4'>
          <label htmlFor='date' className='text-white font-semibold'>दिनांक </label>
          <input
            type='date'
            id='date'
            className='text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md'
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='kapat-type' className='text-white font-semibold'>कपातीचा प्रकार </label>
          <select
            id='kapat-type'
            className='text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md'
            value={kapatType}
            onChange={handleKapatTypeChange}
            required
          >
            <option value=''>Choose...</option>
            <option value='Kapat'>कपात </option>
            <option value='Sthir Kapat'>स्थिर कपात </option>
          </select>
        </div>

        <div className='mb-4'>
          <label htmlFor='kapat-code' className='text-white font-semibold'>कपात कोड</label>
          <input
            type='number'
            id='kapat-code'
            className='text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md'
            value={kapatCode}
            onChange={(e) => setKapatCode(e.target.value)}
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='kapat-name' className='text-white font-semibold'>कपातीचे नाव </label>
          <input
            type='text'
            id='kapat-name'
            className='text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md'
            value={kapatName}
            onChange={(e) => setKapatName(e.target.value)}
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='kapat-rate' className='text-white font-semibold'>कपात रक्कम  </label>
          <input
            type='text'
            id='kapat-rate'
            className='text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md'
            value={kapatRate}
            onChange={(e) => setKapatRate(e.target.value)}
            disabled={kapatType !== 'Sthir Kapat'}
            required={kapatType === 'Sthir Kapat'}
            onInput={(e) => {
              // Allow only numbers and a single decimal point
              const value = e.target.value;
              e.target.value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
            }}
          />
        </div>
        <div className='flex justify-center'>
        <button type='submit' className=' w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'>
          Submit
        </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddSthirkapatForm;
