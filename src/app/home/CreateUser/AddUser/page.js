"use client"
import { ToastContainer, toast as Toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Ensure CSS is imported

const SignupForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ownerList, setOwnerList] = useState([]);
  const [sabhasad, setSabhasad] = useState({
    registerNo: '',
    name: '',
    selectDairy: '',
    milk: '',
    phone: '',
    bankName: '',
    accountNo: '',
    aadharNo: '',
    password: '',
  });

  const [buttonDisabled, setButtonDisabled] = useState(true); // to handle button state

  const onSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/sabhasad/signUp", sabhasad);
      console.log("SignUp Success", res.data);
      router.push("/home/CreateUser/LoginUser");
    } catch (error) {
      console.error("SignUp Error", error);
      Toast.error("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(sabhasad).every(field => field.length > 0);
    setButtonDisabled(!allFieldsFilled);
  }, [sabhasad]);

  useEffect(() => {
    async function fetchOwnerDetails() {
      try {
        console.log("Fetching Sangh details...");
        const res = await axios.get("/api/owner/getOwnerUserside");
        console.log("Response: ", res.data.data);
        setOwnerList(res.data.data);
      } catch (error) {
        console.log("Failed to fetch sangh details:", error.message);
      }
    }
    fetchOwnerDetails();
  }, []);

  return (
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
        <form className="text-black flex flex-wrap -mx-2" onSubmit={onSignUp}>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">उत्पादक नं.</label>
            <input
              className="border border-gray-300 rounded w-full"
              type="number"
              placeholder="रजिस्टर No"
              value={sabhasad.registerNo}
              onChange={(e) => setSabhasad({ ...sabhasad, registerNo: e.target.value })}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">उत्पादकाचे नाव</label>
            <input
              type="text"
              placeholder="उत्पादकाचे नाव"
              className="border border-gray-300 rounded w-full"
              value={sabhasad.name}
              onChange={(e) => setSabhasad({ ...sabhasad, name: e.target.value })}
            />
          </div>
          <div className="w-full md:w-1/2 px-4 mb-4">
            <label className="text-black block mb-2">डेरीचे नाव</label>
            <select
              className="border text-black border-gray-300 rounded w-full p-2"
              value={sabhasad.selectDairy}
              onChange={(e) => setSabhasad({ ...sabhasad, selectDairy: e.target.value })}
            >
              <option value="">Select संघाचे नाव</option>
              {ownerList.map((owner, index) => (
                <option key={index} value={owner.ownerName}>{owner.ownerName}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">दूध प्रकार</label>
            <select
              className="border text-black border-gray-300 rounded w-full"
              value={sabhasad.milk}
              onChange={(e) => setSabhasad({ ...sabhasad, milk: e.target.value })}
            >
              <option value="">Type...</option>
              <option value="गाय">गाय</option>
              <option value="म्हैस">म्हैस</option>
            </select>
          </div>
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
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">बँकेचे नाव</label>
            <input
              type="text"
              placeholder="Bank Name"
              className="border border-gray-300 rounded w-full"
              value={sabhasad.bankName}
              onChange={(e) => setSabhasad({ ...sabhasad, bankName: e.target.value })}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">बँक पासबूक नं.</label>
            <input
              type="number"
              placeholder="Bank Account Number"
              className="border border-gray-300 rounded w-full"
              value={sabhasad.accountNo}
              onChange={(e) => setSabhasad({ ...sabhasad, accountNo: e.target.value })}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">आधार नंबर</label>
            <input
              type="number"
              className="border border-gray-300 rounded w-full"
              value={sabhasad.aadharNo}
              onChange={(e) => setSabhasad({ ...sabhasad, aadharNo: e.target.value })}
            />
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
              disabled={loading || buttonDisabled}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
          <ToastContainer />
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
