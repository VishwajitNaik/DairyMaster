import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SigninForm = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    phone: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      setLoading(true);
      const response = await axios.post("/api/user/userLogin", user); // Ensure this path matches your backend route
      console.log("Login response:", response.data); // Check the entire response object

      if (response.data.error) {
        console.error("Login Error:", response.data.error);
      } else if (response.data.token) {
        console.log("Login successful, redirecting...");
        localStorage.setItem('token', response.data.token); // Store the token in localStorage

        // Check if the token is stored correctly
        const storedToken = localStorage.getItem('token');
        console.log("Stored token:", storedToken);

        const userId = response.data.user._id; // Get the user ID from the response
        router.push(`/home/milkRecords/getMilksUserSide/${userId}`);
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.phone.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <form className="flex flex-col space-y-4" onSubmit={onLogin}>
      <h2 className="text-2xl font-bold">User Sign In</h2>
      <input 
        className="p-2 text-black border border-gray-300 rounded"
        type="text" 
        placeholder="Phone Number"
        value={user.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
      />
      <input 
        className="p-2 text-black border border-gray-300 rounded"
        type="password" 
        placeholder="Password" 
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button 
        className={`bg-green-500 text-white p-2 rounded ${buttonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
        type="submit" 
        disabled={buttonDisabled || loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default SigninForm;