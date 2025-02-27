'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const SthirkapatList = () => {
  const [sthirkapatRecords, setSthirkapatRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalKapatRate, setTotalKapatRate] = useState(0);
  const [editRecord, setEditRecord] = useState(null);
  const [formData, setFormData] = useState({
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
      await axios.delete(`/api/kapat/deleteKapat/${id}`);
      setSthirkapatRecords(sthirkapatRecords.filter(record => record._id !== id));
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
      const response = await axios.put(`/api/kapat/updateKapat/${editRecord._id}`, formData);
      setSthirkapatRecords(sthirkapatRecords.map(record => 
        record._id === editRecord._id ? response.data.data : record
      ));
      setEditRecord(null);
    } catch (error) {
      setError('Error updating record');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="gradient-bg flex flex-col items-center p-4 w-full">
      <div className='bg-gray-500 w-full md:w-3/4 lg:w-1/2 h-[80vh] mx-auto p-4 backdrop-blur-md rounded-lg shadow-md shadow-black overflow-y-auto'>
        <style jsx>{`
          .max-w-lg::-webkit-scrollbar {
            height: 8px;
          }
          .max-w-lg::-webkit-scrollbar-track {
            background: transparent;
          }
          .max-w-lg::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom right, #4a90e2, #9013fe);
            border-radius: 10px;
          }
        `}</style>

        <h1 className='text-2xl font-semibold text-white mb-4 text-center'>कपातीचा तपशील</h1>
        {sthirkapatRecords.length === 0 ? (
          <p className='text-white text-center'>कोणतेही कपात मिळालेली नाही.</p>
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
                  <div className='mt-2 flex gap-4'>
                    <button onClick={() => handleEdit(record)} className='w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'>
                      अपडेट 
                    </button>
                    <button onClick={() => handleDelete(record._id)} className='w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'>
                      डिलिट
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className='mt-4 p-4 bg-gray-700 rounded-lg text-center'>
              <p className='text-xl font-semibold text-white'> <span className='font-semibold'>एकूण स्थिर कपात -</span> {totalKapatRate}</p>
            </div>
          </>
        )}

        {editRecord && (
          <form onSubmit={handleUpdate} className='mt-6 bg-gray-700 p-4 rounded-lg w-full'>
            <h2 className='text-xl text-white mb-4 text-center'>कपातीचा अपडेट</h2>
            <div>
              <label className='block text-white'>कपातीचा प्रकार</label>
              <input
                type="text"
                name="KapatType"
                value={formData.KapatType}
                onChange={handleInputChange}
                className='text-black pl-4 h-12 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm'
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
                className='text-black h-12 pl-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm'
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
                className='text-black h-12 pl-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm'
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
                className='text-black h-12 pl-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full mb-4 bg-gray-200 rounded-md shadow-sm'
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className='w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'>
                अपडेट  
              </button>
              <button type="button" onClick={() => setEditRecord(null)} className='w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'>
                रद्द
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SthirkapatList;
