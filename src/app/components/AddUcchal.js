'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUcchal = () => {
    const { id } = useParams();
    const [ucchal, setUcchal] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [rakkam, setRakkam] = useState('');
    const [users, setUsers] = useState([]);
    const inputRefs = useRef([]);
    const registerNoRef = useRef(null);

    // ✅ Fetch Users
  useEffect(() => {
    async function getOwnerUsers() {
      try {
        const res = await axios.get('/api/user/getUserList');
        setUsers(res.data.data); 
        console.log("user List",res.data.data);
        
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
        toast.error("सर्वर डाउन आहे ");
      }
    }
    getOwnerUsers();
  }, []);

    // ✅ Set Current Date
    useEffect(() => {
        const date = new Date().toISOString().split('T')[0];
        setCurrentDate(date);
    }, []);

    // ✅ Handle User Selection by Register No
    const handleUserChange = (event) => {
        const selectedRegisterNo = event.target.value;
        setSelectedOption(selectedRegisterNo);

        const user = users.find(user => user.registerNo === parseInt(selectedRegisterNo, 10));
        setSelectedUser(user);
    };

    // ✅ Handle Blur on Register No Input
    const handleRegisterNoBlur = (event) => {
        const registerNo = event.target.value;
        const user = users.find(user => user.registerNo === parseInt(registerNo, 10));
        if (user) {
            setSelectedUser(user);
            setSelectedOption(registerNo);
        } else {
            toast.error("Invalid Register Number");
            setSelectedOption('');
            setSelectedUser(null);
        }
    };

    // ✅ Handle Focus on Register No Input
    const handleRegisterNoFocus = () => {
        setSelectedOption('');
        setSelectedUser(null);
        setRakkam('');
        inputRefs.current.forEach(ref => {
            if (ref) ref.value = '';
        });
    };

    // ✅ Handle Rakkam Change
    const handleRakkamChange = (event) => {
        setRakkam(event.target.value);
    };

    // ✅ Handle Form Submit
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!selectedUser) {
            toast.error('Please select a valid user');
            return;
        }
    
        const payload = {
            registerNo: selectedOption,
            username: selectedUser?.name,
            date: currentDate,
            rakkam: parseFloat(rakkam), // Ensure proper number type
        };
    
        try {
            const res = await axios.post('/api/user/ucchal/add', payload);
            toast.success(res.data.message);
            setSelectedOption('');
            setSelectedUser(null);
            setRakkam('');
            inputRefs.current.forEach(ref => {
                if (ref) ref.value = '';
            });
        } catch (error) {
            console.error('Error storing ucchal information:', error.message);
            toast.error(error.response?.data?.error || 'Failed to store ucchal information');
        }
    };
    

    return (
        <div className="relative bg-cover bg-center">
        <ToastContainer />
        <div className="bg-blue-100 p-6 rounded-lg mt-20 shadow-lg w-full max-w-2xl mx-auto">
          <div className="relative">
            <h1 className="text-xl md:text-2xl font-semibold text-black mb-4 flex flex-wrap items-center justify-center md:justify-start">
              उच्चल
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
                type="number"
                inputMode="numeric"
                  id="code"
                  ref={registerNoRef}  // Add this line
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
            </div>
      
            <div className="flex flex-row">
    
              <input
                type="number"
                inputMode="numeric"
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

export default AddUcchal;
