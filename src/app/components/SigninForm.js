import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Modal from '../components/Models/Modal'; 
import Link from 'next/link';

const SigninForm = () => {
  const router = useRouter();
  const [owner, setOwner] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isRequestPasswordOpen, setIsRequestPasswordOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      setLoading(true);
      const response = await axios.post("/api/owner/login", owner);
      if (response.data.success) {
        router.push("/app/home");
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
    <div>
      <form className="flex flex-col space-y-4" onSubmit={onLogin}>
        <h2 className="text-2xl font-bold">Sign In</h2>
        <input 
          className="p-2 text-black border border-gray-300 rounded"
          type="email" 
          placeholder="Email"
          value={owner.email}
          onChange={(e) => setOwner({ ...owner, email: e.target.value })}
        />
        <input 
          className="p-2 text-black border border-gray-300 rounded"
          type="password" 
          placeholder="Password" 
          value={owner.password}
          onChange={(e) => setOwner({ ...owner, password: e.target.value })}
        />
        <button 
          className={`bg-green-500 text-white p-2 rounded ${buttonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
          type="submit" 
          disabled={buttonDisabled || loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <Link href="/home/reset" className='text-black'>
        पासवर्ड विसरला असेल तर <span className='text-blue-500'> पासवर्ड बदला </span>
        </Link>
      </form>

      <ToastContainer />
    </div>
  );
};

export default SigninForm;
