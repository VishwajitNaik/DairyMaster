'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const SthirkapatList = () => {
  const [sthirkapatRecords, setSthirkapatRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalKapatRate, setTotalKapatRate] = useState(0);
  const [editRecord, setEditRecord] = useState(null); // To store the record being edited
  const [formData, setFormData] = useState({ // Form data for update
    KapatType: '',
    kapatCode: '',
    kapatName: '',
    kapatRate: 0,
  });

  useEffect(() => {
    const fetchSthirkapatRecords = async () => {
      try {
        const response = await axios.get('/api/kapat/getKapat');
        setSthirkapatRecords(response.data.data);
        setTotalKapatRate(response.data.totalKapatRate);
        setLoading(false);
      } catch (error) {
        setError('Error fetching Sthirkapat records');
        setLoading(false);
      }
    };

    fetchSthirkapatRecords();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/kapat/deleteKapat/${id}`); // Adjust the endpoint as necessary
      setSthirkapatRecords(sthirkapatRecords.filter(record => record._id !== id)); // Remove the deleted record from state
    } catch (error) {
      setError('Error deleting record');
    }
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setFormData({
      KapatType: record.KapatType,
      kapatCode: record.kapatCode,
      kapatName: record.kapatName,
      kapatRate: record.kapatRate,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/kapat/updateKapat/${editRecord._id}`, formData); // Adjust the endpoint as necessary
      setSthirkapatRecords(sthirkapatRecords.map(record => 
        record._id === editRecord._id ? response.data.data : record
      )); // Update the state with the updated record
      setEditRecord(null); // Reset edit mode
    } catch (error) {
      setError('Error updating record');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="gradient-bg flex flex-col">
    <div className='bg-gray-500 max-w-lg w-1/2 h-[80vh] mx-auto p-6 backdrop-blur-md rounded-lg shadow-md shadow-black overflow-x-auto overflow-y-auto m-2'>
        <style jsx>{`
  .max-w-lg::-webkit-scrollbar {
    height: 8px; /* Adjust the height of the scrollbar */
  }
  .max-w-lg::-webkit-scrollbar-track {
    background: transparent; /* Optional: Change track background */
  }
  .max-w-lg::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom right, #4a90e2, #9013fe); /* Set the scrollbar color to black */
    border-radius: 10px; /* Optional: Add rounded corners */
  }
`}</style>
      <h1 className='text-2xl font-semibold text-white mb-4'>कपातीचा तपशील </h1>
      {sthirkapatRecords.length === 0 ? (
        <p className='text-white'>कोणतेही कपात मिळालेली नाही.</p>
      ) : (
        <>
          <ul className='bg-blue-300 p-4 rounded-lg shadow-md shadow-black'>
            {sthirkapatRecords.map(record => (
              <li key={record._id} className='mb-4 p-4 bg-gray-600 rounded-md'>
                <p className='text-white'> <span className='font-semibold'>दिनांक - </span> {new Date(record.date).toLocaleDateString()}</p>
                <p className='text-white'><span className='font-semibold'> कपात प्रकार - </span> {record.KapatType}</p>
                <p className='text-white'><span className='font-semibold'> कपात कोड - </span> {record.kapatCode}</p>
                <p className='text-white'><span className='font-semibold'> कपातीचे नाव - </span> {record.kapatName}</p>
                {record.kapatRate && <p className='text-white'><span className='font-semibold'> कपात रक्कम - </span> {record.kapatRate}</p>}
                <div className='mt-2'>
                  <button onClick={() => handleEdit(record)} className='w-1/4 py-2 mr-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'>
                    अपडेट 
                  </button>
                  <button onClick={() => handleDelete(record._id)} className='w-1/4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'>
                    डिलिट
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className='mt-4 p-4 bg-gray-700 rounded-lg'>
            <p className='text-xl font-semibold text-white'> <span className='font-semibold'>एकूण स्थिर कपात -</span> {totalKapatRate}</p>
          </div>
        </>
      )}

      {editRecord && (
        <form onSubmit={handleUpdate} className='mt-6 bg-gray-700 p-4 rounded-lg'>
          <h2 className='text-xl text-white mb-4'>कपातीचा अपडेट</h2>
          <div>
            <label className='block text-white'>कपातीचा प्रकार</label>
            <input
              type="text"
              name="KapatType"
              value={formData.KapatType}
              onChange={handleInputChange}
              className='text-black pl-4 h-12 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm'
              required
            />
          </div>
          <div>
            <label className='block text-white'>कपातीचा कोड</label>
            <input
              type="text"
              name="kapatCode"
              value={formData.kapatCode}
              onChange={handleInputChange}
              className='text-black h-12 mr-4 pl-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm'
              required
            />
          </div>
          <div>
            <label className='block text-white'>कपातीचे नाव </label>
            <input
              type="text"
              name="kapatName"
              value={formData.kapatName}
              onChange={handleInputChange}
              className='text-black h-12 mr-4 pl-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm'
              required
            />
          </div>
          <div>
            <label className='block text-white'>कपात रक्कम </label>
            <input
              type="number"
              name="kapatRate"
              value={formData.kapatRate}
              onChange={handleInputChange}
              className='text-black h-12 mr-4 pl-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full mb-4 bg-gray-200 rounded-md shadow-sm'
            />
          </div>
          <button
            type="submit"
            className='w-1/4 py-2 mr-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'
          >
            अपडेट  
          </button>
          <button
            type="button"
            onClick={() => setEditRecord(null)}
            className='w-1/4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'
          >

            रद्द
          </button>
        </form>
      )}
    </div>
    </div>
  );
};

export default SthirkapatList;
