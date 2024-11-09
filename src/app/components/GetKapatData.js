'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KapatList = () => {
  const [kapatList, setKapatList] = useState([]);
  const [totalkapat, setTotalKapat] = useState(0);
  const [netpayment, setNetPayment] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch kapat data and calculate total kapat and net payment
  const fetchKapatRates = async () => {
    try {
      const res = await axios.get('/api/kapat/getKapat');
      const data = res.data.data;

      // Set total kapat and net payment
      const totalKapat = data.reduce((acc, item) => acc + (item.kapatRate || 0), 0);
      const netPayment = data.reduce((acc, item) => acc + (item.netPayment || 0), 0);

      setTotalKapat(totalKapat);
      setNetPayment(netPayment);
      setKapatList(data.filter(item => item.KapatType === 'Sthir Kapat'));
    } catch (error) {
      console.error('Failed to fetch kapat options:', error.message);
      setError('Failed to fetch kapat options');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKapatRates();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto'>
      <h1 className='text-2xl font-semibold text-white mb-4'>Kapat List</h1>
      <p className='text-lg text-white mb-4'>Total Kapat: {totalkapat}</p>
      <p className='text-lg text-white mb-4'>Net Payment: {netpayment}</p>
      <ul className='space-y-4'>
        {kapatList.map((kapat) => (
          <li key={kapat._id} className='bg-gray-700 p-4 rounded-lg'>
            <h2 className='text-xl font-semibold text-white'>{kapat.kapatName}</h2>
            <p className='text-gray-300'>Details: {kapat.details}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KapatList;
