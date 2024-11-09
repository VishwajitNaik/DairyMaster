'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image'

const AddUserOrder = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOptionOrder, setSelectedOptionOrder] = useState('');
  const [rakkam, setRakkam] = useState('');
  const [users, setUsers] = useState([]);
  const inputRefs = useRef([]);
  const [kapat, setKapat] = useState([]);

  useEffect(() => {
    async function getKapatOptions() {
      try {
        const res = await axios.get('/api/kapat/getKapat');
        setKapat(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.log("Failed to fetch kapat options:", error.message);
      }
    }
    getKapatOptions();
  }, []);

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
      username: selectedUser?.name,
      milktype: selectedUser?.milk,
      kharediData: selectedOptionOrder,
      rakkam: parseFloat(rakkam),
      date: currentDate
    };

    console.log('Payload:', payload);

    try {
      const res = await axios.post('/api/orders/addOrders', payload);
      console.log(res.data.message);
      setSelectedOption('');
      setSelectedUser(null);
      setSelectedOptionOrder('');
      setRakkam('');
      inputRefs.current.forEach(ref => {
        if (ref) ref.value = '';
      });

    } catch (error) {
      console.error("Error storing order information:", error.message);
    }
  };

  return (
    <div className="relative bg-cover bg-center">
    <div className='bg-blue-100 p-6 rounded-lg mt-20 shadow-lg w-full max-w-2xl mx-auto'>
    <div className="relative">
      <Image
        src="/assets/feed-bag.webp" 
        alt="खरेदी Icon"
        width={144}  // Approximate width in pixels for w-36
        height={144} // Approximate height in pixels for h-36
        className="absolute rounded-full"
        style={{ top: "-80px", left: "25rem" }}
      />
      <h1 className="text-2xl font-semibold text-black mb-4 flex items-center">
        उत्पादक खरेदी
        <Image src="/assets/feed-bag.webp" alt="खरेदी Icon" width={48} height={48} className="inline-block ml-2" />
        <Image src="/assets/feed-bag.webp" alt="खरेदी Icon" width={48} height={48} className="inline-block ml-2" />
        <Image src="/assets/feed-bag.webp" alt="खरेदी Icon" width={48} height={48} className="inline-block ml-2" />
      </h1>
    </div>

      <form onSubmit={handleSubmit} className='bg-gray-400 p-4 rounded-lg'>
        <div className='flex flex-col md:flex-row md:space-x-4 mb-4'>
          <div className='flex flex-col mb-4 md:mb-0'>
            <label htmlFor="date" className='text-white font-medium'>दिनांक:</label>
            <input
              type="date"
              id="date"
              className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]} // Restrict future dates
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
              className="p-2 w-52 rounded-md border border-gray-500 bg-gray-600 text-white"
              value={selectedOption}
              onChange={handleUserChange}
            >
              <option value="">Choose...</option>
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
              className="p-2 w-20 rounded-md border border-gray-500 bg-gray-600 text-white"
              value={selectedUser?.milk || ''}
              disabled
            >
              <option value="">Choose...</option>
              {users.map((user) => (
                <option key={user.registerNo} value={user.milk}>
                  {user.milk}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='mb-4'>
          <label htmlFor="order-select" className='text-white font-medium'>खरेदी डाटा:</label>
          <select
            id="order-select"
            value={selectedOptionOrder}
            onChange={handleChange}
            className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white"
          >
            <option value="">Choose an option...</option>
            {kapat.map((k) => (
              <option key={k._id} value={k.kapatName}>
                {k.kapatName}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor="amount" className='text-white font-medium'>रक्कम:</label>
          <input
            type="text"
            id="amount"
            className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white"
            value={rakkam}
            onChange={(e) => setRakkam(e.target.value)}
            required
          />
        </div>
        <button type="submit" className='w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md'>
          Submit
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddUserOrder;
