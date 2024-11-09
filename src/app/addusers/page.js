"use client"
import React, { useState } from 'react';
import Modal from '../components/Models/Modal';
import SignupForm from '../components/SignupForm';
import SigninForm from '../components/SigninForm';

const Home = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSigninOpen, setIsSigninOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <h1 className="text-3xl font-bold">Welcome to TeamUpSolutions</h1>
      <button
        className="bg-blue-500 text-white p-4 rounded-lg"
        onClick={() => setIsSignupOpen(true)}
      >
        Sign Up
      </button>
      <button
        className="bg-green-500 text-white p-4 rounded-lg"
        onClick={() => setIsSigninOpen(true)}
      >
        Sign In
      </button>

      <Modal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)}>
        <SignupForm />
      </Modal>

      <Modal isOpen={isSigninOpen} onClose={() => setIsSigninOpen(false)}>
        <SigninForm />
      </Modal>
    </div>
  );
};

export default Home;
