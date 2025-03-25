"use client";
import { ToastContainer, toast as Toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const VikriMilk = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [vikriUsers, setVikriUsers] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedMilk, setSelectedMilk] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const inputRefs = useRef([]);
  const [vikriRates, setVikriRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buffRate, setBuffRate] = useState(0);
  const [cowRate, setCowRate] = useState(0);

  useEffect(() => {
    fetchVikriRates();
    fetchVikriUsers();
  }, []);

  const fetchVikriRates = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/user/getVikriRate");
      setVikriRates(response.data.data);
      setBuffRate(response.data.data[0].VikriRateBuff);
      console.log("Buffelow rate", response.data.data[0].VikriRateBuff);
      
      setCowRate(response.data.data[0].VikriRateCow);
      console.log("Cow Rate", response.data.data[0].VikriRateCow);
      
    } catch (error) {
      console.error("Error fetching VikriRates:", error);
      setError(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchVikriUsers = async () => {
    try {
      const response = await axios.get("/api/user/GetVikriUser");
      setVikriUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch vikri users:", error);
      Toast.error("Failed to fetch vikri users");
    }
  };
  const handleMilkChange = (event) => {
    setSelectedMilk(event.target.value);
  };
  

  const handleRegisterNoBlur = (event) => {
    const registerNo = event.target.value;

    // Find the user with the matching register number
    const user = vikriUsers.find(
      (user) => user.registerNo === parseInt(registerNo, 10)
    );

    if (user) {
      setSelectedUser(user);
      setSelectedOption(registerNo); // Set the selected register number
      setSelectedMilk(user.milk); // Set the milk type based on the user
    } else {
      setSelectedUser(null);
      setSelectedOption("");
      setSelectedMilk("");
      Toast.error("Invalid Register Number. Please try again.");
    }
  };

  const handleUserChange = (event) => {
    const selectedRegisterNo = event.target.value;
    setSelectedOption(selectedRegisterNo);

    // Find the user with the matching register number
    const user = vikriUsers.find(
      (user) => user.registerNo === parseInt(selectedRegisterNo, 10)
    );

    if (user) {
      setSelectedUser(user);
      setSelectedMilk(user.milk); // Set the milk type based on the user
    } else {
      setSelectedUser(null);
      setSelectedMilk("");
    }
  };

    useEffect(() => {
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0]; // yyyy-mm-dd format
      const formattedTime = date.getHours() < 12 ? "morning" : "evening";
  
      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    }, []);

    const calculateRates = () => {
      const liter = parseFloat(inputRefs.current[1]?.value || "0");
    
      if (isNaN(liter)) {
        Toast.error("Please enter a valid number for Liter.");
        return;
      }
    
      let rate = 0;
    
      // Fix rate calculation based on selected milk type
      if (selectedMilk === "गाय") {
        rate = cowRate; // Fixed rate for cow milk
      } else if (selectedMilk === "म्हैस") {
        rate = buffRate; // Fixed rate for buffalo milk
      }
    
      // Set only the rate directly
      inputRefs.current[2].value = rate.toFixed(2);
    
      // Calculate total (rakkam) based on fixed rate
      inputRefs.current[3].value = (rate * liter).toFixed(2);
    };  
  

    const handleSubmit = async () => {
      if (!selectedUser || !selectedMilk) {
        Toast.error("Please select a valid user and milk type.");
        return;
      }
    
      const liter = parseFloat(inputRefs.current[1]?.value || "0");
      const dar = parseFloat(inputRefs.current[2]?.value || "0");
      const rakkam = parseFloat(inputRefs.current[3]?.value || "0");
    
      if (isNaN(liter) || isNaN(dar) || isNaN(rakkam)) {
        Toast.error("Please enter valid numbers for Liter, Dar, and Rakkam.");
        return;
      }
    
      const payload = {
        registerNo: selectedOption, // Register number of selected user
        session: currentTime, // Session value (morning/evening)
        milk: selectedMilk, // Milk type (गाय/म्हैस)
        liter,
        dar,
        rakkam,
        date: currentDate, // Format date as 'YYYY-MM-DD'
      };
    
      console.log("Payload:", payload);
      

      try {
        const res = await axios.post("/api/user/addVikriMilk", payload);
    
        if (res.status === 200) {
          Toast.success("Vikri Milk record added successfully");
          // Optionally clear input fields after success
          inputRefs.current.forEach(ref => (ref.value = ""));
        }
      } catch (error) {
        console.error("Error adding Vikri Milk record:", error);
        if (error.response) {
          // Backend returned an error response
          Toast.error(error.response.data.error || "Failed to add record");
        } else {
          Toast.error("Network error. Please try again later.");
        }
      }
    };
    

  const clearForm = () => {
    setSelectedOption("");
    setSelectedMilk("");
    setSelectedUser(null);
    inputRefs.current.forEach((ref) => {
      if (ref) ref.value = "";
    });
  };

  const handleKeyPress = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission on Enter key press
  
      if (index === 0) {
        // After entering register number, focus on liter input
        inputRefs.current[1]?.focus();
      } else if (index === 1) {
        // After entering liter, calculate rates and focus on save button
        calculateRates();
        inputRefs.current[1]?.focus(); // Focus on save button
      } else if (index === 4) {
        // If save button is focused, trigger the submit function
        handleSubmit();
      }
    }
  };
  

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (

      <div className="bg-gray-100 p-6 rounded-xl shadow-xl w-full max-w-3xl">
        {/* Date and Time */}
        <div className="flex gap-4 mb-6">
          <input
            type="date"
            className="text-black p-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-1/4 bg-gray-200 rounded-md"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]} // Restrict future dates
          />
          <select
            value={currentTime}
            onChange={(e) => setCurrentTime(e.target.value)}
            className="text-black p-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-1/4 bg-gray-200 rounded-md"
          >
            <option value="morning">सकाळ</option>
            <option value="evening">संध्याकाळ</option>
          </select>
        </div>

        {/* User and Milk Type */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            ref={(el) => (inputRefs.current[0] = el)}
            placeholder="रजि. नं."
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            onBlur={handleRegisterNoBlur}
            onKeyDown={(e) => handleKeyPress(e, 1)}
            className="text-black h-12 text-2xl font-mono p-4 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-20 bg-gray-200 rounded-md"
          />
          <select
            value={selectedOption}
            onChange={handleUserChange} // Add this
            className="text-black h-12 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-1/2 bg-gray-200 rounded-md shadow-sm"
          >
            <option value="">उत्पादकाचे नाव</option>
            {vikriUsers.map((user) => (
              <option key={user.registerNo} value={user.registerNo}>
                {user.name}
              </option>
            ))}
          </select>
          <select
              value={selectedMilk}
              onChange={handleMilkChange}
              className="h-12 text-black mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-20 bg-gray-200 rounded-md shadow-sm"
            >
              <option value="">दूध प्रकार</option>
              {[...new Set(vikriUsers.map((user) => user.milk))].map(
                (milkType) => (
                  <option key={milkType} value={milkType}>
                    {milkType}
                  </option>
                )
              )}
            </select>

        </div>

        {/* Inputs */}
        <div className="flex gap-4 mb-6">
          <input
            ref={(el) => (inputRefs.current[1] = el)}
            type="text"
            placeholder="लिटर"
            onKeyDown={(e) => handleKeyPress(e, 1)}
            className="text-black h-12 text-2xl font-mono p-4 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-24 bg-gray-200 rounded-md"
          />
          <input
            ref={(el) => (inputRefs.current[2] = el)}
            type="text"
            placeholder="दर"
            onKeyDown={(e) => handleKeyPress(e, 2)}
            className="text-black h-12 text-2xl font-mono p-4 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-24 bg-gray-200 rounded-md"
            readOnly
          />
          <input
            ref={(el) => (inputRefs.current[3] = el)}
            type="text"
            placeholder="रक्कम"
            className="text-black h-12 text-2xl font-mono p-4 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-24 bg-gray-200 rounded-md"
            readOnly
          />
          <button onClick={calculateRates} className="bg-blue-500 text-white p-2 rounded-md w-1/3">
            दर व रक्कम काढा
          </button>
          <button
            ref={(el) => (inputRefs.current[4] = el)}
            onClick={handleSubmit}
            className="bg-green-500 text-white p-2 rounded-md w-1/3"
          >
            सेव करा
          </button>
        </div>
      </div>
  );
};

export default VikriMilk;