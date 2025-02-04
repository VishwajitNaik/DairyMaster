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
        const kapat = res.data.data.filter(item => item.KapatType === 'Kapat');
        setKapat(kapat);
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
        const res = await axios.get('/api/user/getUserList');
        setUsers(res.data.data); 
        
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
    <div className="bg-blue-100 p-6 rounded-lg mt-20 shadow-lg w-full max-w-2xl mx-auto">
      <div className="relative">
        <Image
          src="/assets/feed-bag.png"
          alt="खरेदी Icon"
          width={144}
          height={144}
          className="absolute hidden md:block"
          style={{ top: "-110px", left: "37rem" }}
        />
        <h1 className="text-xl md:text-2xl font-semibold text-black mb-4 flex flex-wrap items-center justify-center md:justify-start">
          उत्पादक खरेदी
          <Image
            src="/assets/feed-bag.png"
            alt="खरेदी Icon"
            width={36}
            height={36}
            className="inline-block ml-2"
          />
          <Image
            src="/assets/feed-bag.png"
            alt="खरेदी Icon"
            width={36}
            height={36}
            className="inline-block ml-2"
          />
          <Image
            src="/assets/feed-bag.png"
            alt="खरेदी Icon"
            width={36}
            height={36}
            className="inline-block ml-2"
          />
        </h1>
      </div>
  
      <form
        onSubmit={handleSubmit}
        className="bg-gray-400 p-4 rounded-lg"
      >
        <div className="flex flex-wrap md:space-x-4 mb-4">
          <div className="flex flex-col mb-4 w-full md:w-1/3">
            <input
              type="date" 
              id="date"
              className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
  
        <div className="flex flex-wrap md:space-x-4 mb-4">
          <div className="flex flex-col mb-4 w-full md:w-1/6">
            <input
              type="text"
              id="code"
              placeholder="रजि. नं."
              className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-16 bg-gray-200 rounded-md"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              onBlur={handleRegisterNoBlur}
              onFocus={handleRegisterNoFocus}
              onInput={(e) => {
                // Allow only numbers and a single decimal point
                const value = e.target.value;
                e.target.value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
              }}
              required
            />
          </div>
          <div className="flex flex-col mb-4 w-full md:w-1/2">
            <select
              id="user-select"
              className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none  bg-gray-200 rounded-md"
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
          <div className="flex flex-col w-full md:w-1/6">
            <select
              id="milk-select"
              className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none bg-gray-200 rounded-md"
              value={selectedUser?.milk || ""}
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
  
        <div className="flex flex-row">
          <select
            id="order-select"
            value={selectedOptionOrder}
            onChange={handleChange}
            className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none  bg-gray-200 rounded-md"
          >
            <option value="">खरेदी डाटा</option>
            {kapat.map((k) => (
              <option key={k._id} value={k.kapatName}>
                {k.kapatName}
              </option>
            ))}
          </select>

          <input
            type="text"
            id="amount"
            placeholder="रक्कम"
            className="text-black h-fit text-xl mb-4 font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-36  bg-gray-200 rounded-md"
            value={rakkam}
            onChange={(e) => setRakkam(e.target.value)}
            onInput={(e) => {
              // Allow only numbers and a single decimal point
              const value = e.target.value;
              e.target.value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
            }}
            required
          />
        </div>
  
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default AddUserOrder;
