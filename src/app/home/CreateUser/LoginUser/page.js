"use client";
import { ToastContainer, toast as Toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Ensure CSS is imported

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ownerList, setOwnerList] = useState([]);
  
  const [sabhasad, setSabhasad] = useState({
    selectDairy: '',
    phone: '',
    password: '',
  });

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      setLoading(true);
      const response = await axios.post("/api/sabhasad/login", sabhasad); // Updated route to match sabhasad
  
      console.log("Login response:", response.data); // Check the entire response object
  
      if (response.data.error) {
        console.error("Login Error:", response.data.error);
        Toast.error(response.data.error || "Login failed. Please check your credentials.");
      } else if (response.data.token) {
        console.log("Login successful, redirecting...");
        localStorage.setItem('token', response.data.token); // Store the token in localStorage
  
        // Check if the token is stored correctly
        const storedToken = localStorage.getItem('token');
        console.log("Stored token:", storedToken);
  
        const userId = response.data.user._id; // Get the user ID from the response
        router.push(`/home/milkRecords/getMilksUserSide`);
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.error || error.message);
      Toast.error("Server is not responding. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    async function fetchOwnerDetails() {
      try {
        console.log("Fetching Sangh details..."); // Debugging log
        const res = await axios.get("/api/owner/getOwnerUserside");
        console.log("Response: ", res.data.data); // Debugging log
        setOwnerList(res.data.data);
      } catch (error) {
        console.log("Failed to fetch sangh details:", error.message);
        Toast.error("Failed to fetch dairy details.");
      }
    }
    fetchOwnerDetails();
  }, []);

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white p-4 w-[40%] h-[70%] rounded shadow-lg">
          <button
            className="absolute top-2 right-2 text-gray-600"
            onClick={() => router.back()}
          >
            ✖️
          </button>
          <h2 className="text-2xl text-black font-bold mb-4">उत्पादक भरणे</h2>
          <form className="text-black flex flex-wrap -mx-2" onSubmit={onLogin}>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="text-black">फोन नंबर</label>
              <input
                type="number"
                placeholder="Phone Number"
                className="border border-gray-300 rounded w-full"
                value={sabhasad.phone}
                onChange={(e) => setSabhasad({ ...sabhasad, phone: e.target.value })}
              />
            </div>
            <div className="w-full md:w-1/2 px-4 mb-4">
              <label className="text-black block mb-2">डेरीचे नाव</label>
              <select
                className="border text-black border-gray-300 rounded w-full p-2"
                value={sabhasad.selectDairy}
                onChange={(e) => setSabhasad({ ...sabhasad, selectDairy: e.target.value })}
              >
                <option value="">Select डेरीचे नाव</option>
                {ownerList.map((owner, index) => (
                  <option key={index} value={owner.ownerName}>{owner.ownerName}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="text-black">पासवर्ड</label>
              <input
                type="password"
                placeholder="Password"
                className="p-2 border border-gray-300 rounded w-full"
                value={sabhasad.password}
                onChange={(e) => setSabhasad({ ...sabhasad, password: e.target.value })}
              />
            </div>
            <div className="w-full px-2">
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded w-full"
                disabled={loading}  // Only disable when loading
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default LoginForm;
