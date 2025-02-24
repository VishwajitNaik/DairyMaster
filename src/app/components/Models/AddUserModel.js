"use client";
import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to include the CSS
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

const PopUp = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [kapat, setKapat] = useState([])
  const [selectedKapat, setSelectedKapat] = useState([]); // For tracking selected Sthir Kapat options


  useEffect(() => {
    async function getKapatOptions() {
      try {
        const res = await axios.get('/api/kapat/getKapat');
        const sthirKapat = res.data.data.filter(item => item.KapatType === 'Sthir Kapat');
       setKapat(sthirKapat)
      } catch (error) {
        console.log("Failed to fetch kapat options:", error.message);
      }
    }
    getKapatOptions();
  },[]);

  const [user, setUser] = useState({
    registerNo: '',
    name: '',
    milk: '',
    phone: '',
    bankName: '',
    accountNo: '',
    aadharNo: '',
    ifscCode: '',
    status: '',
    password: '',
  });

  const handleAddUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Add selectedKapat to the payload
      const payload = {
        ...user,
        selectedKapat, // Include the selected Kapat options
      };
  
      const res = await axios.post('/api/user/createUser', payload);
      console.log("User created successfully:", res.data.data);
  
      // Reset the form fields
      setUser({
        registerNo: '',
        name: '',
        milk: '',
        phone: '',
        bankName: '',
        accountNo: '',
        aadharNo: '',
        ifscCode: '',
        status: '',
        password: '',
      });
      setSelectedKapat([]); // Reset selected Kapat options
      Toast.success("User created successfully!");
    } catch (error) {
      console.log("Add User Failed:", error.message);
      Toast.error("नवीन सभासद तयार करताना ओनर लॉगिन आहे का तपासा");
    } finally {
      setLoading(false);
    }
  };

  
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
        setUser({ ...user, phone: value });
    }
};

const handleAadharChange = (e) => {
  let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
  if (value.length <= 12) {
      value = value.replace(/(\d{4})(\d{1,4})?(\d{1,4})?/, (match, p1, p2, p3) =>
          [p1, p2, p3].filter(Boolean).join(" ")
      );
      setUser({ ...user, aadharNo: value });
  }
};

  

  const toggleKapatSelection = (kapatId) => {
    if (selectedKapat.includes(kapatId)) {
      setSelectedKapat(selectedKapat.filter((id) => id !== kapatId));
    } else {
      setSelectedKapat([...selectedKapat, kapatId]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center p-4 justify-center z-50 rounded-lg">
    {/* Overlay */}
    <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
  
    {/* Modal Content */}
    <div className="relative bg-blue-200 max-w-lg h-[80vh] mx-auto p-6 rounded-lg shadow-md overflow-x-auto overflow-y-auto m-2">
    <style jsx>{`
            .max-w-lg::-webkit-scrollbar {
              height: 8px; /* Adjust the height of the scrollbar */
              width: 6px
            }
            .max-w-lg::-webkit-scrollbar-track {
              background: white; /* Optional: Change track background */
            }
            .max-w-lg::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom right, #4a90e2, #9013fe); /* Set the scrollbar color to black */
              border-radius: 10px; /* Optional: Add rounded corners */
              width: 8px; /* Adjust the width of the scrollbar */
            }
          `}</style>
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 text-gray-600 hover:bg-red-500 hover:text-white hover:shadow-lg transition-all duration-200 p-2 rounded-md"
        onClick={onClose}
        aria-label="Close Modal"
      >
        ✖️
      </button>
  
      {/* Title */}
      <h2 className="text-2xl text-black font-bold mb-4 flex justify-center text-center">उत्पादक भरणे</h2>
  
      {/* Form */}
      <form className="text-black flex flex-wrap -mx-2" onSubmit={handleAddUser}>
        {/* Register Number */}
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="registerNo" className="text-black">उत्पादक नं.</label>
          <input
            id="registerNo"
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            type="number"
            placeholder="रजिस्टर No"
            value={user.registerNo}
            onChange={(e) => setUser({ ...user, registerNo: e.target.value })}
            required
          />
        </div>
  
        {/* Name */}
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="name" className="text-black">उत्पादकाचे नाव</label>
          <input
            id="name"
            type="text"
            placeholder="उत्पादकाचे नाव"
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>
  
        {/* Milk Type */}
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="milkType" className="text-black">दूध प्रकार</label>
          <select
            id="milkType"
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            value={user.milk}
            onChange={(e) => setUser({ ...user, milk: e.target.value })}
            required
          >
            <option value="">Type...</option>
            <option value="गाय ">गाय</option>
            <option value="म्हैस ">म्हैस</option>
          </select>
        </div>
  
        {/* Phone Number */}
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="phone" className="text-black">फोन नंबर</label>
          <input
            id="phone"
            type="number"
            placeholder="Phone Number"
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            value={user.phone}
            onChange={handlePhoneChange}
            required
          />
        </div>
  
        {/* Bank Name */}
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="bankName" className="text-black">बँकेचे नाव</label>
          <input
            id="bankName"
            type="text"
            placeholder="Bank Name"
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            value={user.bankName}
            onChange={(e) => setUser({ ...user, bankName: e.target.value })}
          />
        </div>
  
        {/* Bank Account Number */}
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="accountNo" className="text-black">बँक पासबूक नं.</label>
          <input
            id="accountNo"
            type="number"
            placeholder="Bank Account Number"
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            value={user.accountNo}
            onChange={(e) => setUser({ ...user, accountNo: e.target.value })}
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="ifscCode" className="text-black">IFSC कोड</label>
          <input
            id="ifscCode"
            placeholder="IFSC Code"
            type="text" // Ensure the input type is 'text' to avoid parsing issues
            value={user.ifscCode}
            onChange={(e) => setUser({ ...user, ifscCode: e.target.value })}
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
          />

        </div>
  
        {/* Aadhar Number */}
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="aadharNo" className="text-black">आधार नंबर</label>
          <input
            type="text" // Ensure the input type is 'text' to avoid parsing issues
            value={user.aadharNo}
            onChange={handleAadharChange}
            maxLength={14} // Allow 12 digits + 2 spaces
            placeholder="XXXX XXXX XXXX"
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
          />

        </div>

        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="Status" className="text-black">स्टेटस</label>
          <select
            id="Status"
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            value={user.status}
            onChange={(e) => setUser({ ...user, status: e.target.value })}
            required
          >
            <option value="">Type...</option>
            <option value="active">चालू</option>
            <option value="inactive">बंद</option>
          </select>
        </div>
  
        {/* Password */}
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="password" className="text-black">पासवर्ड</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>

        
  
        {/* Kapat Options */}
        <div className="w-full px-2 mb-4">
          <h3 className="text-xl text-black font-semibold mb-2">स्थिर कपाट पर्याय</h3>
          <div className="flex flex-wrap gap-4">
            {kapat.map((item) => (
              <div key={item._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`kapat-${item._id}`}
                  checked={selectedKapat.includes(item._id)}
                  onChange={() => toggleKapatSelection(item._id)}
                  className="mr-2"
                />
                <label htmlFor={`kapat-${item._id}`} className="text-black">
                  {item.kapatName} - {item.kapatRate}
                </label>
              </div>
            ))}
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="w-full px-2">
          <div className="flex justify-center items-center mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded w-36"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
  
        {/* Toast Notifications */}
        <ToastContainer />
      </form>
    </div>
  </div>
  
  );
};

export default PopUp;
