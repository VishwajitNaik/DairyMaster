"use client";
import React, { useState } from 'react';
import axios from 'axios';

const AddTagType = () => {
  const [tagTypeName, setTagTypeName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setMessage('');

      // Replace '/api/your-endpoint' with the actual route path
      const response = await axios.post('/api/Docter/addTagType', {
        TagTypeName: tagTypeName,
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        setTagTypeName('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Tag Type</h1>

      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tagTypeName" className="block mb-2 font-semibold">
            Tag Type Name:
          </label>
          <input
            type="text"
            id="tagTypeName"
            value={tagTypeName}
            onChange={(e) => setTagTypeName(e.target.value)}
            className="border text-black border-gray-300 rounded px-4 py-2 w-full"
            placeholder="Enter Tag Type Name"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Tag Type
        </button>
      </form>
    </div>
  );
};

export default AddTagType;
