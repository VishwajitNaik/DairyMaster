"use client";
import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useState } from 'react';

const PopUp = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [vikriUsers, setVikriUsers] = useState({
    registerNo: '',
    name: '',
    milk: '',
    phone: '',
    email: '',
    password: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVikriUsers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleAddVikriUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/user/sthanikVikri', vikriUsers);
      console.log(res.data.data);
      
      // Clear form fields but do not close the popup
      setVikriUsers({
        registerNo: '',
        name: '',
        milk: '',
        phone: '',
        email: '',
        password: '',
      });
  
      // Show success toast notification
      Toast.success("Vikri User added successfully!");
    } catch (error) {
      console.error(error);
      Toast.error("Error adding Vikri User!");
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-6 w-[40%] h-[60%] rounded shadow-lg">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>✖️</button>
        <h2 className="text-2xl text-black font-bold mb-4">विक्रेता भरणे</h2>

        <form className="text-black flex flex-wrap -mx-2" onSubmit={handleAddVikriUser}>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black"> विक्रेता नं . </label>
            <input 
              className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
              type="number" 
              name="registerNo"
              value={vikriUsers.registerNo}
              onChange={handleChange}
              placeholder="Enter Register No"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">विक्रेताचे नाव</label>
            <input 
              type="text" 
              name="name"
              value={vikriUsers.name}
              onChange={handleChange}
              placeholder="Enter Name" 
              className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">दूध प्रकार</label>
            <select 
              className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
              name="milk"
              value={vikriUsers.milk}
              onChange={handleChange}
              required
            >
              <option value="">Select Milk Type</option>
              <option value="गाय">गाय</option>
              <option value="म्हैस">म्हैस</option>
            </select>
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">फोन नंबर</label>
            <input 
              type="number"
              name="phone"
              value={vikriUsers.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">ईमेल</label>
            <input 
              type="email" 
              name="email"
              value={vikriUsers.email}
              onChange={handleChange}
              placeholder="abc@gmail.com"
              className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">पासवर्ड</label>
            <input 
              type="password" 
              name="password"
              value={vikriUsers.password}
              onChange={handleChange}
              placeholder="Password"
              className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
              required
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

        {/* Toast Container for Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default PopUp;
