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
    <div className='bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto'>
      <h1 className='text-2xl font-semibold text-white mb-4'>Sthir Kapat Records</h1>
      {sthirkapatRecords.length === 0 ? (
        <p className='text-white'>No records found</p>
      ) : (
        <>
          <ul className='bg-gray-700 p-4 rounded-lg'>
            {sthirkapatRecords.map(record => (
              <li key={record._id} className='mb-4 p-4 bg-gray-600 rounded-md'>
                <p className='text-white'>Date: {new Date(record.date).toLocaleDateString()}</p>
                <p className='text-white'>Kapat Type: {record.KapatType}</p>
                <p className='text-white'>Kapat Code: {record.kapatCode}</p>
                <p className='text-white'>Kapat Name: {record.kapatName}</p>
                {record.kapatRate && <p className='text-white'>Kapat Rate: {record.kapatRate}</p>}
                <div className='mt-2'>
                  <button onClick={() => handleEdit(record)} className='bg-blue-500 text-white p-1 rounded mr-2'>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(record._id)} className='bg-red-500 text-white p-1 rounded'>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className='mt-4 p-4 bg-gray-700 rounded-lg'>
            <p className='text-xl font-semibold text-white'>Total Kapat Rate: {totalKapatRate}</p>
          </div>
        </>
      )}

      {editRecord && (
        <form onSubmit={handleUpdate} className='mt-6 bg-gray-700 p-4 rounded-lg'>
          <h2 className='text-xl text-white mb-4'>Edit Kapat Record</h2>
          <div>
            <label className='block text-white'>Kapat Type:</label>
            <input
              type="text"
              name="KapatType"
              value={formData.KapatType}
              onChange={handleInputChange}
              className='text-black block w-full p-2 mt-1 mb-4 rounded-md'
              required
            />
          </div>
          <div>
            <label className='block text-white'>Kapat Code:</label>
            <input
              type="text"
              name="kapatCode"
              value={formData.kapatCode}
              onChange={handleInputChange}
              className='text-black block w-full p-2 mt-1 mb-4 rounded-md'
              required
            />
          </div>
          <div>
            <label className='block text-white'>Kapat Name:</label>
            <input
              type="text"
              name="kapatName"
              value={formData.kapatName}
              onChange={handleInputChange}
              className='text-black block w-full p-2 mt-1 mb-4 rounded-md'
              required
            />
          </div>
          <div>
            <label className='block text-white'>Kapat Rate:</label>
            <input
              type="number"
              name="kapatRate"
              value={formData.kapatRate}
              onChange={handleInputChange}
              className='text-black block w-full p-2 mt-1 mb-4 rounded-md'
            />
          </div>
          <button
            type="submit"
            className='bg-green-500 text-white p-2 rounded-md'
          >
            Update Record
          </button>
          <button
            type="button"
            onClick={() => setEditRecord(null)}
            className='bg-gray-500 text-white p-2 rounded-md ml-2'
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default SthirkapatList;
