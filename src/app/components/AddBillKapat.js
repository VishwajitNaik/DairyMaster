'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const AddBillKapat = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOptionOrder, setSelectedOptionOrder] = useState('');
  const [rakkam, setRakkam] = useState('');
  const [users, setUsers] = useState([]);
  const inputRefs = useRef([]);
  const [userDetails, setUserDetails] = useState(null);
  const [totalLiters, setTotalLiters] = useState(0);
  const [totalRakkam, setTotalRakkam] = useState(0);
  const [netPayment, setNetPayment] = useState(0);
  const [literKapat, setLiterKapat] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [milkRecords, setMilkRecords] = useState([]);
  const [kapat, setKapat] = useState([]);

  // Fetch Kapat options
  useEffect(() => {
    async function getKapatOptions() {
      try {
        const res = await axios.get('/api/kapat/getKapat');
        const sthirKapat = res.data.data.filter(item => item.KapatType === 'Kapat');
        setKapat(sthirKapat);
      } catch (error) {
        console.log("Failed to fetch kapat options:", error.message);
      }
    }
    getKapatOptions();
  }, [totalLiters, totalRakkam]);

  // Fetch users
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

  // Set current date
  useEffect(() => {
    const date = new Date().toISOString().split('T')[0];
    setCurrentDate(date);
  }, []);

  // Handle user selection change
  const handleUserChange = (event) => {
    const selectedRegisterNo = event.target.value;
    setSelectedOption(selectedRegisterNo);
    const user = users.find(user => user.registerNo === parseInt(selectedRegisterNo, 10));
    setSelectedUser(user);
    if (user) {
      fetchUserDetails(user._id); // Fetch user details on selection
    }
  };

  const handleRegisterNoBlur = (event) => {
    const registerNo = event.target.value;
    const user = users.find(user => user.registerNo === parseInt(registerNo, 10));
    setSelectedUser(user);
    setSelectedOption(registerNo);
    if (user) {
      fetchUserDetails(user._id); // Fetch user details on selection
    }
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

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      date: currentDate,
      username: selectedUser?.name,
      registerNo: selectedOption,
      milktype: selectedUser?.milk,
      orderData: selectedOptionOrder,
      rate: parseFloat(rakkam),
    };

    try {
      const res = await axios.post('/api/billkapat/addBillkapat', payload);
      console.log('Response:', res.data);
      setSelectedOption('');
      setSelectedUser(null);
      setRakkam('');
      setMilkRecords([]); // Clear milk records if needed
      setUserDetails(null); // Reset user details
    } catch (error) {
      console.error('Failed to add bill kapat:', error.message);
    }
  };

  // Fetch milk records based on selected user
  const fetchMilkRecords = async () => {
    if (!selectedUser?._id || !startDate || !endDate) {
      alert('Please select a user and date range');
      return;
    }

    try {
      const response = await axios.get(`/api/milk/getMilkRecords`, {
        params: {
          userId: selectedUser._id,
          startDate,
          endDate,
        },
      });
      setMilkRecords(response.data.data);
    } catch (error) {
      console.error("Error fetching milk records:", error.message);
    }
  };

  const totalMilkRakkam = milkRecords.reduce((total, record) => total + (record.rakkam || 0), 0).toFixed(2);

  // Fetch orders for the selected user
  useEffect(() => {
    if (selectedOption) {
      const fetchUserOrders = async () => {
        try {
          const response = await axios.get(`/api/orders/getOrders/${selectedOption}`);
          if (response.data.error) {
            throw new Error(response.data.error);
          }
          const fetchedOrders = response.data.data;
          setOrders(fetchedOrders);

          // Calculate the total amount from the fetched orders
          const total = fetchedOrders.reduce((sum, order) => sum + (order.rakkam || 0), 0);
          setTotalAmount(total); // Update the totalAmount state
        } catch (error) {
          console.error(error.message);
        }
      };

      fetchUserOrders();
    } else {
      setOrders([]); // Clear orders if no user is selected
      setTotalAmount(0); // Reset total amount if no user is selected
    }
  }, [selectedOption]); // Re-run when selectedUserId changes

  // Fetch user details based on selected user
  const fetchUserDetails = async (userId) => {
    if (!userId || !startDate || !endDate) {
      alert("Please select a user and date range");
      return;
    }

    try {
      const response = await axios.post(`/api/orders/afterKapatOrders/${userId}`, {
        startDate,
        endDate,
      });
      setUserDetails(response.data);
      setNetPayment(response.data.netPayment); // Set net payment here
    } catch (error) {
      console.error("Failed to fetch user details:", error.message);
    }
  };

  return (
    <div className='bg-gray-800 p-6 rounded-lg mt-20 shadow-md w-full max-w-2xl mx-auto shadow-black'
    style={{
      backgroundImage: 'url(/assets/mony.jpg)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
    }}
>
 <div className="relative">
 <Image
  src="/assets/monycut.png" 
  alt="खरेदी Icon"
  width={144}
  height={144}
  className="absolute rounded-full hidden sm:block"
  style={{ top: "-80px", left: "100%", transform: "translateX(-50%)" }}
/>


   <h1 className="text-2xl font-semibold text-black mb-4 flex items-center justify-center">
     खरेदी कपात
   </h1>
 </div>

 <form onSubmit={handleSubmit} className='bg-gray-700 p-4 rounded-lg shadow-md shadow-gray-900'>
   <div className='flex flex-col md:flex-row md:space-x-4 mb-4'>
     <div className='flex flex-col md:flex-row items-start'>
       <label htmlFor="startDate" className="text-white mr-4">Start Date:</label>
       <input
         type="date"
         id="startDate" 
         value={startDate}
         onChange={(e) => setStartDate(e.target.value)}
         className="text-black rounded-md p-2 shadow-sm shadow-white mb-4 md:mb-0"
       />
       <label htmlFor="endDate" className="text-white mr-4 ml-4">End Date:</label>
       <input
         type="date"
         id="endDate"
         value={endDate}
         onChange={(e) => setEndDate(e.target.value)}
         className="text-black rounded-md p-2 shadow-sm shadow-white"
       />
     </div>
   </div>

   {/* User selection and milk type display */}
   <div className='flex flex-col md:flex-row md:space-x-4 mb-4'>
   <input
  type="text"
  id="code"
  className="w-full sm:w-24 md:w-20 h-10 p-2 rounded-md border border-gray-500 bg-gray-600 text-white sm:mb-4 mb-2"
  value={selectedOption}
  onChange={(e) => setSelectedOption(e.target.value)}
  onBlur={handleRegisterNoBlur}
  onFocus={handleRegisterNoFocus}
  required
/>

     <select
       id="user-select"
       value={selectedOption}
       onChange={handleUserChange}
       className='w-full sm:w-64 md:w-96 h-10 p-2 rounded-md border border-gray-500 bg-gray-600 text-white sm:mb-4 mb-2'
     >
       <option value="">Select User</option>
       {users.map(user => (
         <option key={user._id} value={user.registerNo}>
           {user.name}
         </option>
       ))}
     </select>
     <button
       type="button"
       onClick={fetchMilkRecords}
       className='w-full sm:w-24 py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md '
     >
       एकूण बिल
     </button>
   </div>

   <div className="bg-gray-600 p-4 mb-4 rounded-md shadow-inner flex flex-row justify-between space-x-6 text-white">
     <div className="flex items-center space-x-2">
       <span className="font-bold">बील</span>
       <span className="px-2 py-1 bg-gray-800 border border-gray-400 rounded-md text-lg">
         {totalMilkRakkam}
       </span>
     </div>
     {userDetails && (
       <div className="flex items-center space-x-2">
         <span className="font-bold">बाकी</span>
         <span className="px-2 py-1 bg-gray-800 border border-gray-400 rounded-md text-lg">
           {netPayment}
         </span>
       </div>
     )}
   </div>

   <div className='flex flex-col md:flex-row md:space-x-4 mb-4'>
     <select
       id="order-select"
       value={selectedOptionOrder}
       onChange={handleChange}
       className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white w-full sm:w-64 md:w-96 sm:mb-4 mb-2"
     >
       <option value="">Choose an option...</option>
       {kapat.map((k) => (
         <option key={k._id} value={k.kapatName}>
           {k.kapatName}
         </option>
       ))}
     </select>
     <input
       type="number"
       placeholder="Enter Rate"
       value={rakkam}
       onChange={(e) => setRakkam(e.target.value)}
       className='w-full sm:w-24 md:w-20 p-2 rounded-md border border-gray-500 bg-gray-600 text-white'
     />
   </div>

   <div className='flex justify-center items-center'>
     <button type="submit" className='w-full sm:w-36 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md'>
       Submit
     </button>
   </div>
 </form>
</div>

  );
};

export default AddBillKapat;
