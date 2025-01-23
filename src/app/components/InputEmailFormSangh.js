"use client"
import React, { useState } from 'react';
import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendMailSangh } from './Models/SanghMailModel';

const EmailForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debugging: Log the entered email
    console.log("Submitted email:", email);

    if (!email) {
        Toast.error("Please enter your email address.");
        console.error("Error: Email is empty.");
        return;
    }

    try {
        // Debugging: Log before calling sendMailSangh
        console.log("Calling sendMailSangh with email:", email);

        // Attempt to call sendMailSangh
        const response = await sendMailSangh({ email });

        // Debugging: Log the response from sendMailSangh
        console.log("sendMailSangh response:", response);
    } catch (error) {
        // Debugging: Log any error that occurs
        console.error("Error in handleSubmit:", error.message, error);
        Toast.error("An error occurred while sending the email.");
    }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      <form onSubmit={handleSubmit} className="bg-blue-100 p-6 rounded shadow-md w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EmailForm;
