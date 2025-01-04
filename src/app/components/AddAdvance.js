'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

const AddAdvance = () => {
  const { id } = useParams();
  const [advance, setAdvance] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOptionOrder, setSelectedOptionOrder] = useState('');
  const [rakkam, setRakkam] = useState('');
  const [users, setUsers] = useState([]);
  const inputRefs = useRef([]);
  const [orderNo, setOrderNo] = useState('');

  useEffect(() => {
    async function getOwnerUsers() {
      try {
        const res = await axios.get('/api/user/getUsers');
        setUsers(res.data.data.users); 
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
      }
    }
    getOwnerUsers();
  }, []);

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // yyyy-mm-dd format
    setCurrentDate(formattedDate);
  }, []);

  const handleUserChange = async (event) => {
    const selectedRegisterNo = event.target.value;
    setSelectedOption(selectedRegisterNo);

    const user = users.find(user => user.registerNo === parseInt(selectedRegisterNo, 10));
    setSelectedUser(user);
  };

  const handleRegisterNoBlur = async (event) => {
    const registerNo = event.target.value;
    const user = users.find(user => user.registerNo === parseInt(registerNo, 10));
    setSelectedUser(user);
    setSelectedOption(registerNo);
  };

  const handleRegisterNoFocus = () => {
    setSelectedOption('');
    setSelectedUser(null);
    setOrderNo('');

    inputRefs.current.forEach(ref => {
      if (ref) ref.value = '';
    });
  };

  const handleChange = (event) => {
    setSelectedOptionOrder(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      registerNo: selectedOption,
      orderNo: orderNo,
      username: selectedUser?.name,
      milktype: selectedUser?.milk,
      rakkam: parseFloat(rakkam),
      date: currentDate
    };

    console.log('Payload:', payload);

    try {
      const res = await axios.post('/api/advance/addAdvance', payload);
      console.log(res.data.message);
      setSelectedOption('');
      setSelectedUser(null);
      setSelectedOptionOrder('');
      setRakkam('');
      setOrderNo('');

      alert('Advance Saved Successfully');
    } catch (error) {
      console.error("Error storing order information:", error.message);
    }
  };


  return (
    <div className="relative bg-cover bg-center mt-5">
  <div className='bg-gray-800 p-6 mt-20 rounded-lg shadow-md w-full max-w-2xl mx-auto'
    style={{
      backgroundImage: 'url(/assets/mony.jpg)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
    }}>
    <div className="relative">
      <Image
        src="/assets/indnots1.png" 
        alt="खरेदी Icon"
        width={240}
        height={240}
        className="absolute rounded-full w-1/2 sm:w-60" 
        style={{ top: "-60px", left: "112%", transform: "translateX(-50%)" }} 
      />
      <h1 className="text-2xl font-semibold text-black mb-4 flex justify-center items-center">
        अडवांस जमा 
      </h1>
    </div>
    <form onSubmit={handleSubmit} className='bg-gray-700 p-4 rounded-lg'>
      <div className='flex flex-col md:flex-row md:space-x-4 mb-4'>
        <div className='flex flex-col mb-4 md:mb-0'>
          <label htmlFor="date" className='text-white font-medium'>दिनांक:</label>
          <input
            type="date"
            id="date"
            className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className='flex flex-col'>
          <label htmlFor="order-no" className='text-white font-medium'>Order No:</label>
          <input
            type="text"
            id="order-no"
            className="w-24 p-2 rounded-md border border-gray-500 bg-gray-600 text-white"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
          />
        </div>
      </div>
      <div className='flex flex-col md:flex-row md:space-x-4 mb-4'>
        <div className='flex flex-col mb-4 md:mb-0'>
          <label htmlFor="code" className='text-white font-medium'>U. code:</label>
          <input
            type="text"
            id="code"
            className='w-24 p-2 rounded-md border border-gray-500 bg-gray-600 text-white'
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            onBlur={handleRegisterNoBlur}
            onFocus={handleRegisterNoFocus}
            required
          />
        </div>
        <div className='flex flex-col mb-4 md:mb-0'>
          <label htmlFor="user-select" className='text-white font-medium'>User:</label>
          <select
            id="user-select"
            className="p-2 w-full md:w-52 rounded-md border border-gray-500 bg-gray-600 text-white"
            value={selectedOption}
            onChange={handleUserChange}
          >
            <option value="">उत्पादकाचे नाव</option>
            {users.map((user) => (
              <option key={user.registerNo} value={user.registerNo}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className='flex flex-col'>
          <label htmlFor="milk-select" className='text-white font-medium'>Milk Type:</label>
          <select
            id="milk-select"
            className="p-2 w-full md:w-20 rounded-md border border-gray-500 bg-gray-600 text-white"
            value={selectedUser?.milk || ''}
            disabled
          >
            <option value="">दूध प्रकार</option>
            {users.map((user) => (
              <option key={user.registerNo} value={user.milk}>
                {user.milk}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className="text-white font-medium block mb-2">रक्कम:</label>
        <input
          type="text"
          id="amount"
          className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full"
          value={rakkam}
          onChange={(e) => setRakkam(e.target.value)}
          required
        />
      </div>
      <div className='flex justify-center items-center'>
        <button type="submit" className=' w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md'>
          Submit
        </button>
      </div>
    </form>
  </div>
</div>

  )
}

export default AddAdvance