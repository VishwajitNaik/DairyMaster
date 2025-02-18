'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
   const registerNoRef = useRef(null); // Create a ref for registerNo input field

  // Fetch Kapat options
  useEffect(() => {
    async function getKapatOptions() {
      try {
        const res = await axios.get('/api/kapat/getKapat');
        const sthirKapat = res.data.data.filter(item => item.KapatType === 'Kapat');
        setKapat(sthirKapat);
      } catch (error) {
        console.log("Failed to fetch kapat options:", error.message);
        toast.error("Failed to fetch kapat options.");
      }
    }
    getKapatOptions();
  }, [totalLiters, totalRakkam]);

  // Fetch users
  useEffect(() => {
    async function getOwnerUsers() {
      try {
        const res = await axios.get('/api/user/getUserList');
        setUsers(res.data.data);
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
        toast.error("Failed to fetch users.");
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
      date: startDate,
      username: selectedUser?.name,
      registerNo: selectedOption,
      milktype: selectedUser?.milk,
      orderData: selectedOptionOrder,
      rate: parseFloat(rakkam),
    };
    try {
      const res = await axios.post('/api/billkapat/addBillkapat', payload);
      toast.success("कपात विवरण सफलतापूर्वक केले..!", { position: "top-right" });
      
      console.log('Response:', res.data);
      setSelectedOption('');
      setSelectedUser(null);
      setRakkam('');
      setMilkRecords([]); // Clear milk records if needed
      setUserDetails(null); // Reset user details

      inputRefs.current.forEach(ref => {
        if (ref) ref.value = '';
      });

            // Set focus back to Register No input field
            if (registerNoRef.current) {
              registerNoRef.current.focus();
            }
      
  
    } catch (error) {
      console.error('Failed to add bill kapat:', error.message);
      toast.error("कपात विवरण सफल नाही..!", { position: "top-right" });
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
      toast.error("Error fetching milk records.");
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
          toast.error("Failed to fetch user orders.");
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
    if (!userId) {
      alert("Please select a user");
      return;
    }
  
    try {
      const response = await axios.post(`/api/orders/afterKapatOrders/${userId}`);
      setUserDetails(response.data);
      setNetPayment(response.data.netPayment);
    } catch (error) {
      console.error("Failed to fetch user details:", error.message);
      toast.error("Failed to fetch user details.");
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
<ToastContainer />
 <div className="relative">
 <Image
  src="/assets/monycut.png" 
  alt="खरेदी Icon"
  width={144}
  height={144}
  className="absolute rounded-full hidden sm:block"
  style={{ top: "-80px", left: "100%", transform: "translateX(-50%)" }}
/>


   <h1 className="text-2xl font-semibold text-black mb-4">
     खरेदी कपात
   </h1>
 </div>

 <form onSubmit={handleSubmit} className='bg-gray-700 p-4 rounded-lg shadow-md shadow-gray-900'>
   <div className='flex flex-col md:flex-row md:space-x-4 mb-4'>
     <div className='flex flex-col md:flex-row items-start'>
       <input
         type="date"
         id="startDate" 
         value={startDate}
         onChange={(e) => setStartDate(e.target.value)}
         className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
       />
       <input
         type="date"
         id="endDate"
         value={endDate}
         onChange={(e) => setEndDate(e.target.value)}
         className="text-black p-2 text-xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md shadow-sm"
       />
     </div>
   </div>

   {/* User selection and milk type display */}
   <div className='flex flex-col md:flex-row md:space-x-4 mb-4'>
   <input
  type="text"
  id="code"
  ref={registerNoRef}  // Add this line
  placeholder="रजि. नं."
  className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-24 bg-gray-200 rounded-md"
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

     <select
       id="user-select"
       value={selectedOption}
       onChange={handleUserChange}
       className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-64 bg-gray-200 rounded-md"
       >
       <option value="">उत्पादकाचे नाव </option>
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

   <div className="text-black h-fit text-xl font-mono p-2 mr-4 mb-4 border-b-2 border-blue-500 outline-none bg-gray-200 rounded-md flex flex-row justify-between space-x-6">
     <div className="flex items-center space-x-2">
       <span className="font-bold">बील</span>
       <span className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 w-36 bg-gray-500 rounded-md">
         {totalMilkRakkam}
       </span>
     </div>
     {userDetails && (
       <div className="flex items-center space-x-2">
         <span className="font-bold">बाकी</span>
         <span className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 w-36 bg-gray-500 rounded-md">
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
       className="text-black h-fit text-xl font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-48 bg-gray-200 rounded-md"
     >
       <option value="">खरेदी डाटा </option>
       {kapat.map((k) => (
         <option key={k._id} value={k.kapatName}>
           {k.kapatName}
         </option>
       ))}
     </select>
     <input
       type="text"
       placeholder="रक्कम "
       value={rakkam}
       onChange={(e) => setRakkam(e.target.value)}
       onInput={(e) => {
        // Allow only numbers and a single decimal point
        const value = e.target.value;
        e.target.value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
      }}
       className='text-black h-fit text-xl mb-4 font-mono p-2 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-36  bg-gray-200 rounded-md'
     />
   </div>

   <div className='flex justify-center items-center'>
     <button type="submit" className='w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105'>
       Submit
     </button>
   </div>
 </form>
</div>

  );
};

export default AddBillKapat;
