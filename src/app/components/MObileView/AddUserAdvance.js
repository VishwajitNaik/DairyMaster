'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

const AddUserAdvance = () => {

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
    <div className="bg-blue-300 sm:bg-gray-500 w-4/5 sm:w-7/12 mx-auto h-auto py-1 px-1 rounded-lg mt-4">
          <h1 className="text-2xl font-semibold text-black mb-4 flex justify-center items-center">
        अडवांस जमा
                      <Image
                        src="/assets/indnots1.png"
                        alt="खरेदी Icon"
                        width={36}
                        height={36}
                        className="inline-block"
                      />
                      <Image
                        src="/assets/indnots1.png"
                        alt="खरेदी Icon"
                        width={36}
                        height={36}
                        className="inline-block"
                      />
                      <Image
                        src="/assets/indnots1.png"
                        alt="खरेदी Icon"
                        width={36}
                        height={36}
                        className="inline-block"
                      /> 
      </h1>
            <form
        onSubmit={handleSubmit}
        className="bg-gray-400 p-2 rounded-lg"
      >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Date and Time Selection */}
        <div className="flex items-center">
          <input
            type="date"
            id="date"
            value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            className="border rounded-md p-1 text-gray-700 text-sm w-1/3 sm:w-auto"
          />
        </div>
      </div>

      {/* User and Milk Type Selection */}
      <div className="flex items-center gap-2 mt-3 flex-nowrap overflow-x-auto">
        <input
          type="text"
          id="code"
          className="border rounded-md p-1 text-gray-700 text-sm w-1/6"
          placeholder="Register No"
          value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              onBlur={handleRegisterNoBlur}
              onFocus={handleRegisterNoFocus}
              required
        />
        <select
          id="user-select"
          className="border rounded-md p-1 text-gray-700 text-sm"
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
        <select
          id="milk-select"
          className="border rounded-md p-1 text-gray-700 text-sm w-1/5"
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

      {/* Kapat and Rakkam Selection */}
      <div className="flex items-center gap-2 mt-3 flex-nowrap overflow-x-auto">
        <input
          type="text"
          id="amount"
          className="border rounded-md p-1 text-gray-700 text-sm w-1/3"
          placeholder="Rakkam"
          value={rakkam}
          onChange={(e) => setRakkam(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-center items-center mt-4">
          <button
            type="submit"
            className="bg-red-400 border rounded-md p-1 text-gray-700 text-sm w-1/5"
          >
            Submit
          </button>
        </div>
        </form>
    </div>
  )
}

export default AddUserAdvance
