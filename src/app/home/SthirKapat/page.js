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
    <div className='bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto'>
      <h1 className='text-2xl font-semibold text-white mb-4'>Add Sthir Kapat</h1>
      <form onSubmit={handleSubmit} className='bg-gray-700 p-4 rounded-lg'>
        <div className='mb-4'>
          <label htmlFor='date' className='text-white font-medium'>Date:</label>
          <input
            type='date'
            id='date'
            className='p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full'
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='kapat-type' className='text-white font-medium'>Kapat Type:</label>
          <select
            id='kapat-type'
            className='p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full'
            value={kapatType}
            onChange={handleKapatTypeChange}
            required
          >
            <option value=''>Choose...</option>
            <option value='Kapat'>Kapat</option>
            <option value='Sthir Kapat'>Sthir Kapat</option>
          </select>
        </div>

        <div className='mb-4'>
          <label htmlFor='kapat-code' className='text-white font-medium'>Kapat Code:</label>
          <input
            type='number'
            id='kapat-code'
            className='p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full'
            value={kapatCode}
            onChange={(e) => setKapatCode(e.target.value)}
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='kapat-name' className='text-white font-medium'>Kapat Name:</label>
          <input
            type='text'
            id='kapat-name'
            className='p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full'
            value={kapatName}
            onChange={(e) => setKapatName(e.target.value)}
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='kapat-rate' className='text-white font-medium'>Kapat Rate:</label>
          <input
            type='number'
            id='kapat-rate'
            className='p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full'
            value={kapatRate}
            onChange={(e) => setKapatRate(e.target.value)}
            disabled={kapatType !== 'Sthir Kapat'}
            required={kapatType === 'Sthir Kapat'}
          />
        </div>

        <button type='submit' className='w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md'>
          Submit
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddSthirkapatForm;
