"use client"
import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Modal from '../../components/Models/Modal'; 
import Link from 'next/link';

const SigninForm = () => {
  const router = useRouter();
  const [owner, setOwner] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      setLoading(true);
      const response = await axios.post("/api/owner/login", owner);
      if (response.data.success) {
        router.push("/home");
      } else {
        console.error("Login Error", response.data.error);
        Toast.error("Server is not responding. Please check your internet connection.");
      }
    } catch (error) {
      Toast.error("Server is not responding. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (owner.email.length > 0 && owner.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [owner]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-md">
        <form className="flex flex-col space-y-6" onSubmit={onLogin}>
          <h2 className="text-3xl font-bold text-center text-gray-700">Sign In</h2>
          <input 
            className="p-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            type="email" 
            placeholder="Email"
            value={owner.email}
            onChange={(e) => setOwner({ ...owner, email: e.target.value })}
          />
          <input 
            className="p-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            type="password" 
            placeholder="Password" 
            value={owner.password}
            onChange={(e) => setOwner({ ...owner, password: e.target.value })}
          />
          <button 
            className={`bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all duration-300 ${buttonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            type="submit" 
            disabled={buttonDisabled || loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <Link href="/home/reset" className="text-center text-blue-500 hover:underline">
            पासवर्ड विसरला असेल तर <span className="font-semibold"> पासवर्ड बदला </span>
          </Link>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SigninForm;
