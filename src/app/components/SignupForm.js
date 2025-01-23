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

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
        setOwner({ ...owner, phone: value });
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
    <div className="max-w-lg h-[60vh] mx-auto p-6 bg-transparent backdrop-blur-md rounded-lg shadow-md overflow-x-auto overflow-y-auto m-2">
    <style jsx>{`
  .max-w-lg::-webkit-scrollbar {
    height: 8px; /* Adjust the height of the scrollbar */
  }
  .max-w-lg::-webkit-scrollbar-track {
    background: transparent; /* Optional: Change track background */
  }
  .max-w-lg::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom right, #4a90e2, #9013fe); /* Set the scrollbar color to black */
    border-radius: 10px; /* Optional: Add rounded corners */
  }
`}</style>
      <h2 className="text-black text-2xl font-bold text-center mb-6">Sign Up</h2>
      <form className="text-black flex flex-wrap -mx-4" onSubmit={onSignup}>
      <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">राजिस्टर नं. </label>
          <input 
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            type="text" 
            placeholder="Register No"
            value={owner.registerNo}
            onChange={(e) => setOwner({ ...owner, registerNo: e.target.value })}
          />
        </div>
        {/* Column 1 */}
        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">ओनरचे नाव </label> 
          <input 
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            type="text" 
            placeholder="Username"
            value={owner.ownerName}
            onChange={(e) => setOwner({ ...owner, ownerName: e.target.value })}
          />

        </div>
        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">संघाचे नाव</label>
          <select 
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
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
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            value={owner.dairyName}
            onChange={(e) => setOwner({ ...owner, dairyName: e.target.value })}
          />
        </div>
        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">फोन नंबर</label>
          <input 
            type="text" 
            placeholder="Phone Number" 
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            value={owner.phone}
            onChange={handlePhoneChange}
          />
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">ईमेल</label>
          <input 
            type="email" 
            placeholder="abc@gmail.com" 
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            value={owner.email}
            onChange={(e) => setOwner({ ...owner, email: e.target.value })}
          />
        </div>

        <div className="w-full md:w-1/2 px-4 mb-4">
          <label className="text-black block mb-2">पासवर्ड</label>
          <input 
            type="password" 
            placeholder="Password" 
            className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
            value={owner.password}
            onChange={(e) => setOwner({ ...owner, password: e.target.value })}
          />
        </div>

        <div className="w-full px-4 mb-4">
          <button 
            type="submit" 
            className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${buttonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
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
