"use client"
import React, { useState } from 'react';
import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mailAction } from './Models/MailModel';

const EmailForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email);
    await mailAction({ email })
    if (!email) {
      Toast.error("Please enter your email address.");
      return;
    }

    // try {
    //   setLoading(true);
    //   // Assuming you have an API endpoint to handle email reset requests
    //   const response = await fetch('/api/auth/reset-password', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email }),
    //   });

    //   if (response.ok) {
    //     Toast.success("Password reset link sent to your email.");
    //   } else {
    //     Toast.error("Failed to send reset link. Please try again.");
    //   }
    // } catch (error) {
    //   Toast.error("Server error. Please try again later.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Input Email To reset
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black"
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
