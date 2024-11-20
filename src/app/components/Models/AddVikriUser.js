"use client";
import { useState } from 'react';

const PopUp = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-4 w-[40%] h-[50%] rounded shadow-lg ">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          ✖️
        </button>
        <h2 className="text-2xl text-black font-bold mb-4">विक्रेता भरणे</h2>
        <form className="text-black flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black "> विक्रेता नं . </label>
            <input 
              className="border border-gray-300 rounded w-full"
              type="number" 
              placeholder="Username"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">विक्रेताचे  नाव </label>
            <input 
              type="text" 
              placeholder="डेअरीचे नाव" 
              className="border border-gray-300 rounded w-full"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">दूध प्रकार</label>
            <select 
              className="border text-black border-gray-300 rounded w-full"
            >
              <option value="संघ 1">गाय </option>
              <option value="संघ 2">म्हैस </option>
            </select>
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">फोन नंबर</label>
            <input 
              type="number" 
              placeholder="Phone Number" 
              className="border border-gray-300 rounded w-full"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">ईमेल</label>
            <input 
              type="email" 
              placeholder="abc@gmail.com" 
              className="border border-gray-300 rounded w-full"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">पासवर्ड</label>
            <input 
              type="password" 
              placeholder="Password" 
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="w-full px-2">
            <button 
              type="submit" 
              className="bg-green-500 text-white p-2 rounded w-full"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUp;
