import { ToastContainer, toast as Toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; // Ensure CSS is imported

const SignupForm = () => {
  const router = useRouter();
  const [owner, setOwner] = useState({
    registerNo: "",
    ownerName: "",
    dairyName: "",
    sangh: "", 
    phone: "", 
    email: "", 
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true); // Start with true until all fields are filled
  const [loading, setLoading] = useState(false);
  const [sanghList, setSanghList] = useState([]);

  const onSignup = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post("/api/owner/signup", owner);
      Toast.success("Signup successful! Redirecting...");
      console.log("SignUp Success", res.data);
      router.push("/home/Signin");
    } catch (error) {
      console.error("SignUp Error", error);
      Toast.error("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(owner).every(field => field.length > 0);
    setButtonDisabled(!allFieldsFilled);
  }, [owner]);

  useEffect(() => {
    async function fetchSanghDetails() {
      try {
        console.log("Fetching sangh details...");
        const res = await axios.get("/api/sangh/getSangh");
        console.log("Response:", res.data.data);
        setSanghList(res.data.data); // Set the fetched data
      } catch (error) {
        console.log("Failed to fetch sangh details:", error.message);
      }
    }
    fetchSanghDetails();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      <form className="text-black flex flex-wrap -mx-4" onSubmit={onSignup}>
      <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">Register No.</label>
          <input 
            className="border border-gray-300 rounded w-full p-2"
            type="text" 
            placeholder="Username"
            value={owner.registerNo}
            onChange={(e) => setOwner({ ...owner, registerNo: e.target.value })}
          />
        </div>
        {/* Column 1 */}
        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">Owner Name</label>
          <input 
            className="border border-gray-300 rounded w-full p-2"
            type="text" 
            placeholder="Username"
            value={owner.ownerName}
            onChange={(e) => setOwner({ ...owner, ownerName: e.target.value })}
          />
        </div>
        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">संघाचे नाव</label>
          <select 
            className="border text-black border-gray-300 rounded w-full p-2"
            value={owner.sangh}
            onChange={(e) => setOwner({ ...owner, sangh: e.target.value })}
          >
            <option value="">Select संघाचे नाव</option>
            {sanghList.map((sangh, index) => (
              <option key={index} value={sangh.SanghName}>{sangh.SanghName}</option>
            ))}
          </select>
        </div>
        
        {/* Column 2 */}
        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">डेअरीचे नाव</label>
          <input 
            type="text" 
            placeholder="डेअरीचे नाव" 
            className="border border-gray-300 rounded w-full p-2"
            value={owner.dairyName}
            onChange={(e) => setOwner({ ...owner, dairyName: e.target.value })}
          />
        </div>
        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">फोन नंबर</label>
          <input 
            type="text" 
            placeholder="Phone Number" 
            className="border border-gray-300 rounded w-full p-2"
            value={owner.phone}
            onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
          />
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">ईमेल</label>
          <input 
            type="email" 
            placeholder="abc@gmail.com" 
            className="border border-gray-300 rounded w-full p-2"
            value={owner.email}
            onChange={(e) => setOwner({ ...owner, email: e.target.value })}
          />
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">पासवर्ड</label>
          <input 
            type="password" 
            placeholder="Password" 
            className="border border-gray-300 rounded w-full p-2"
            value={owner.password}
            onChange={(e) => setOwner({ ...owner, password: e.target.value })}
          />
        </div>

        <div className="w-full px-4 mb-4">
          <button 
            type="submit" 
            className={`w-full bg-blue-500 text-white p-2 rounded ${buttonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={buttonDisabled || loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignupForm;
