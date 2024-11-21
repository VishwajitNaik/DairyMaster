"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AddUserOrder from "../../components/AddUserOrder.js";
import Addadvance from "../../components/AddAdvance.js";
import AddBillKapat from "../../components/AddBillKapat.js";
import SessionMilk from "../../components/SessionMilk.js";
import AllUserMilks from "../../components/GetUserMilk.js";
import TenDayBill from "../../components/TendayMilk.js";
import KapatNetpay from "../../components/KapatNetpay.js";
import HeroBanner from "@/app/components/HeroBanner.js";
import { getDataFromToken } from '@/helpers/getDataFromToken'; // Ensure this is set up correctly to decode the token.
import LatestMilkRecords from '@/app/components/LatestMilkRecords.js';
import Image from "next/image.js";

export default function AvakDudhNond({ params }) {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedMilk, setselectedMilk] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [milk, setMilk] = useState("");
  const inputRefs = useRef([]);
  const input1Ref = useRef(null);
  const [milkRecords, setMilkRecords] = useState([]);
  const [cowMilkRecords, setCowMilkRecords] = useState([]);
  const [totalLiter, setTotalLiter] = useState(0);
  const [avgFat, setAvgFat] = useState(0);
  const [avgSnf, setAvgSnf] = useState(0);
  const [avgRate, setAvgRate] = useState(0);
  const [totalRakkam, setTotalRakkam] = useState(0);
  const [totalLiterCow, setTotalLiterCow] = useState(0);
  const [avgFatCow, setAvgFatCow] = useState(0);
  const [avgSnfCow, setAvgSnfCow] = useState(0);
  const [avgRateCow, setAvgRateCow] = useState(0);
  const [totalRakkamCow, setTotalRakkamCow] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [owners, getOwners] = useState([]);
  const [ownerName, setOwnerName] = useState('');
  const [rates, setRates] = useState({});
  const [buffaloConstants, setBuffaloConstants] = useState({});
  const [cowConstants, setCowConstants] = useState({});
  //
  const [selectedUserId, setSelectedUserId] = useState(''); // Selected user ID
  const [lastRecord, setLastRecord] = useState(null); // Latest milk record
  const [fat, setFat] = useState(''); // State for fat input
  const [snf, setSnf] = useState(''); // State for SNF input
  const [autoFill, setAutoFill] = useState(false); // State for radio button


//
  const [susers, setSUsers] = useState([]); // Initialize users as an empty array
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    // Fetch available users who don't have milk records for the current date and session
    const noMilkUsers = async () => {
      try {
        const response = await axios.get("/api/SessionList"); // Updated API route
        if (Array.isArray(response.data.data)) {
          setSUsers(response.data.data); // Ensure response is an array before setting
        } else {
          console.error("Unexpected response format:", response.data);
          setSUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setSUsers([]); // Fallback to an empty array in case of error
      } finally {
        setIsLoading(false); // Loading complete
      }
    };

    noMilkUsers();
  }, []);

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

//
  useEffect(() => {
    const fetchOwnerName = async () => {
      try {
        const response = await fetch('/api/owner/OwnerName'); // Call your API route
        const data = await response.json();

        if (response.ok) {
          setOwnerName(data.ownerName); // Set owner name in state
        } else {
          console.error(data.error); // Log error if any
        }
      } catch (error) {
        console.error("Error fetching owner name:", error);
      }
    };

    fetchOwnerName();
  }, []);

  useEffect(() => {
    async function fetchTodayMilkRecords() {
      try {
        const response = await axios.get("/api/milk/getSessionMilk");

        if (response.data && Array.isArray(response.data.milkRecords)) {
          const buffaloRecords = response.data.milkRecords.filter(
            (record) => record.milk === "म्हैस "
          );
          const cowRecords = response.data.milkRecords.filter(
            (record) => record.milk === "गाय "
          );

          setMilkRecords(buffaloRecords);
          setCowMilkRecords(cowRecords);

          if (buffaloRecords.length > 0) {
            const totalLiter = buffaloRecords.reduce(
              (sum, record) => sum + record.liter,
              0
            );
            const avgFat =
              buffaloRecords.reduce((sum, record) => sum + record.fat, 0) /
              buffaloRecords.length;
            const avgSnf =
              buffaloRecords.reduce((sum, record) => sum + record.snf, 0) /
              buffaloRecords.length;
            const avgRate =
              buffaloRecords.reduce((sum, record) => sum + record.dar, 0) /
              buffaloRecords.length;
            const totalRakkam = buffaloRecords.reduce(
              (sum, record) => sum + record.rakkam,
              0
            );

            setTotalLiter(totalLiter.toFixed(2));
            setAvgFat(avgFat.toFixed(2));
            setAvgSnf(avgSnf.toFixed(2));
            setAvgRate(avgRate.toFixed(2));
            setTotalRakkam(totalRakkam.toFixed(2));
          }

          if (cowRecords.length > 0) {
            const totalLiterCow = cowRecords.reduce(
              (sum, record) => sum + record.liter,
              0
            );
            const avgFatCow =
              cowRecords.reduce((sum, record) => sum + record.fat, 0) /
              cowRecords.length;
            const avgSnfCow =
              cowRecords.reduce((sum, record) => sum + record.snf, 0) /
              cowRecords.length;
            const avgRateCow =
              cowRecords.reduce((sum, record) => sum + record.dar, 0) /
              cowRecords.length;
            const totalRakkamCow = cowRecords.reduce(
              (sum, record) => sum + record.rakkam,
              0
            );

            setTotalLiterCow(totalLiterCow.toFixed(2));
            setAvgFatCow(avgFatCow.toFixed(2));
            setAvgSnfCow(avgSnfCow.toFixed(2));
            setAvgRateCow(avgRateCow.toFixed(2));
            setTotalRakkamCow(totalRakkamCow.toFixed(2));
          }
        } else {
          setError("Unexpected response format.");
        }
      } catch (err) {
        setError("Failed to fetch today's milk records.");
        console.error("Error fetching today's milk records:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTodayMilkRecords();
  }, []);

  useEffect(() => {
    async function getOwnerUsers() {
      try {
        const res = await axios.get("/api/user/getUsers");
        setUsers(res.data.data.users);
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
      }
    }
    getOwnerUsers();
  }, []);

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0]; // yyyy-mm-dd format
    const formattedTime = date.getHours() < 12 ? "morning" : "evening";

    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
  }, []);


    // Handle user selection by register number
    const handleUserChange = (event) => {
      const selectedRegisterNo = event.target.value;
      setSelectedOption(selectedRegisterNo);
  
      const user = users.find((user) => user.registerNo === parseInt(selectedRegisterNo, 10));
      setSelectedUser(user); // Update selected user based on register number
      setLastRecord(null); // Reset last record to trigger fetch
      setError(null); // Reset error state
      if (!autoFill) {
        setFat(''); // Reset fat only if auto-fill is not selected
        setSnf(''); // Reset SNF only if auto-fill is not selected
      }
    };

  const handleMilkChange = (event) => {
    const selectedMilkType = event.target.value;
    setselectedMilk(selectedMilkType);

    const user = users.find((user) => user.milk === selectedMilkType);
    setselectedMilk(user);
  };

  const handleRegisterNoBlur = (event) => {
    const registerNo = event.target.value;
    const user = users.find(
      (user) => user.registerNo === parseInt(registerNo, 10)
    );

    if (user) {
      setSelectedUser(user);
      setSelectedOption(registerNo);
      setselectedMilk(user.milk); // Automatically select the milk type based on the user
    } else {
      setSelectedUser(null);
      setSelectedOption("");
      setselectedMilk(""); // Clear milk type if user not found
    }
  };

  const handleRegisterNoFocus = () => {
    setSelectedOption("");
    setSelectedUser(null);
    setselectedMilk("");

    inputRefs.current.forEach((ref) => {
      if (ref) ref.value = "";
    });
  };

  const handleKeyPress = (event, index) => {
    if (event.key === "Enter") {
      if (index < inputRefs.current.length - 1) {
        // Move focus to the next input field
        inputRefs.current[index + 1].focus();
      } else {
        // If this is the last input field, calculate rates or submit
        calculateRates();
        handleSubmit();
        setTimeout(() => {
          clearForm();
        }, 1000);
      }
    }
  };

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get('/api/milkrate/getRates');
        // Assuming the response.data.data is an array
        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
          // Set the first element of the array as rates
          setRates(response.data.data[0]); // Take the first rate object
        } else {
          console.log("No rates found.");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rates:", error.message);
        setError("Error fetching rates");
        setLoading(false);
      }
    };
  
    fetchRates();
  }, []);
  
  useEffect(() => {
    if (rates && Object.keys(rates).length > 0) {
      // Set buffalo and cow constants whenever rates are updated
      setBuffaloConstants({
        HF: rates.HighFatB,
        R1: rates.HighRateB,
        LF: rates.LowFatB,
        R2: rates.LowRateB,
        SNF_RANGES: [
          { start: 8.7, end: 9.0, rate: 0.3 },
          { start: 9.0, end: 9.1, rate: 0.1 },
          { start: 9.1, end: 10.0, rate: 0.05 },
        ],
      });

      setCowConstants({
        HF: rates.HighFatC,
        R1: rates.HighRateC,
        LF: rates.LowFatC,
        R2: rates.LowRateC,
        SNF_RANGES: [
          { start: 8.2, end: 8.5, rate: 0.3 },
          { start: 8.5, end: 8.6, rate: 0.1 },
          { start: 8.6, end: 9.0, rate: 0.05 },
        ],
      });
    } else {
      console.log("Rates not yet loaded or empty.");
    }
  }, [rates]);

  const calculateValues = (X, constants) => {
    const { HF, R1, LF, R2 } = constants;
    const R = (R1 - R2) / (HF - LF); // Calculate R
    const FR = R1 - (HF - X) * R; // Calculate FR
    return FR; // Return the calculated fat rate
  };

  const calculateTotalRate = (X, Y) => {
    // Determine whether it's buffalo or cow milk
    const constants = X >= 5.5 ? buffaloConstants : cowConstants;

    const FR = calculateValues(X, constants); // Calculate the fat rate based on selected constants
    let TFR = FR; // Initialize total rate to Fat Rate (FR)

    // Loop through the SNF ranges to calculate the total rate
    constants.SNF_RANGES.forEach((range) => {
      if (Y >= range.start && Y <= range.end) {
        const SNFRate = 10 * (Y - range.start) * range.rate; // Calculate SNF rate for the range
        TFR += SNFRate; // Add SNF rate to total rate
      } else if (Y > range.end) {
        const SNFRate = 10 * (range.end - range.start) * range.rate; // Calculate full SNF rate for the range
        TFR += SNFRate; // Add SNF rate to total rate
      }
    });

    return TFR; // Return the calculated total rate
  };

  const calculateRates = () => {
    const fatInput = parseFloat(inputRefs.current[2]?.value || "0");
    const snfInput = parseFloat(inputRefs.current[3]?.value || "0");
    const liter = parseFloat(inputRefs.current[1]?.value || "0");

    if (isNaN(fatInput) || isNaN(snfInput) || isNaN(liter)) {
      alert("Please enter valid numbers for Fat, SNF, and Liter");
      return;
    }

    const rate = calculateTotalRate(fatInput, snfInput);
    const amount = liter * rate;

    inputRefs.current[4].value = rate.toFixed(2); // Set calculated rate
    inputRefs.current[5].value = amount.toFixed(2); // Set calculated amount
  };

  const clearForm = () => {
    setselectedMilk("");
    setSelectedUser("");
    setSelectedOption(""); // Reset the user selection
    setFat(""); // Reset the fat input
    setSnf(""); // Reset the SNF input
    setCurrentDate(new Date().toISOString().split("T")[0]); // Reset the date to today
    inputRefs.current.forEach((input) => {
      if (input) {
        input.value = ""; // Clear all input fields
      }
    });
  };


  const handleSubmit = async () => {
    try {

      if (!selectedMilk) {
        alert("Please select a milk type before submitting");
        return;
      }

      const liter = parseFloat(inputRefs.current[1]?.value || "0");
      const fat = parseFloat(inputRefs.current[2]?.value || "0");
      const snf = parseFloat(inputRefs.current[3]?.value || "0");
      const dar = parseFloat(inputRefs.current[4]?.value || "0");
      const rakkam = parseFloat(inputRefs.current[5]?.value || "0");

      if (
        isNaN(liter) ||
        isNaN(fat) ||
        isNaN(snf) ||
        isNaN(dar) ||
        isNaN(rakkam)
      ) {
        alert("Please enter valid numbers before submitting");
        return;
      }

      const payload = {
        registerNo: selectedOption, // User register number
        session: currentTime, // Session (morning/evening)
        milk: selectedMilk, // Use selectedMilk for the milk type
        liter, // Amount in liters
        fat, // Fat percentage
        snf, // SNF percentage
        dar, // Rate per liter
        rakkam, // Total amount (rakkam)
        date: currentDate, // Date of the milk entry
      };
      const res = await axios.post("/api/milk/createMilk", payload);

      if (res.data.alert) {
        alert(res.data.alert); // Display the alert message if record exists
      } else {
        console.log(res.data.message);
      }

      // clear form information after successful submission
      

      setTimeout(() => {
        clearForm();
        input1Ref.current.focus();
      }, 1000);
    } catch (error) {
      console.error("Error storing milk information:", error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const liter = parseFloat(inputRefs.current[1]?.value || "0");
      const fat = parseFloat(inputRefs.current[2]?.value || "0");
      const snf = parseFloat(inputRefs.current[3]?.value || "0");
      const dar = parseFloat(inputRefs.current[4]?.value || "0");
      const rakkam = parseFloat(inputRefs.current[5]?.value || "0");

      if (
        isNaN(liter) ||
        isNaN(fat) ||
        isNaN(snf) ||
        isNaN(dar) ||
        isNaN(rakkam)
      ) {
        alert("Please enter valid numbers before updating");
        return;
      }

      const res = await axios.post("/api/milk/updateMilk", {
        registerNo: selectedOption,
        session: currentTime,
        liter,
        fat,
        snf,
        dar,
        rakkam,
        date: currentDate,
      });

      if (res.data.message === "Milk record updated") {
        alert("Milk record updated successfully");
      } else {
        alert("Milk record not found");
      }

      setTimeout(() => {
        clearForm();
      }, 1000);
    } catch (error) {
      console.error("Error updating milk information:", error.message);
    }
  };

  // Fetch latest milk record for the selected user
  useEffect(() => {
    const fetchLatestMilkRecord = async () => {
      if (!selectedUser) return; // Don't fetch if no user is selected

      try {
        const res = await axios.get(`/api/milk/latest?userId=${selectedUser._id}`);
        if (!res.data.error) {
          setLastRecord(res.data.data); // Set last record
          setError(null); // Reset error state
          if (autoFill) {
            // If autoFill is true, set fat and snf from last record
            setFat(res.data.data.fat);
            setSnf(res.data.data.snf);
          }
        } else {
          throw new Error(res.data.error);
        }
      } catch (error) {
        setError(error.message); // Handle error
      }
    };

    fetchLatestMilkRecord();
  }, [selectedUser, autoFill]); // Dependency on autoFill and selectedUser

  // Handle radio button change
  const handleAutoFillChange = (event) => {
    const isChecked = event.target.checked; // Get checked state
    setAutoFill(isChecked); // Update auto-fill state
    if (isChecked && lastRecord) {
      setFat(lastRecord.fat); // Set fat from last record
      setSnf(lastRecord.snf); // Set SNF from last record
    }
  };

  // Handle manual input changes
  const handleFatChange = (event) => setFat(event.target.value);
  const handleSnfChange = (event) => setSnf(event.target.value);



  return (
    <>
    <div className="relative min-h-screen">
    <HeroBanner />
    <div className="absolute top-12 left-0 right-0 flex justify-center items-center">
        <div
          className="bg-gray-400 bg-opacity-50 rounded-md flex flex-col"
          style={{ height: "500px", width: "1000px" }}
        >
          <div
            className="bg-gray-500 bg-opacity-50 rounded-md p-4 flex items-center"
            style={{ height: "50px", width: "100%" }}
          >
            <h1 className="text-xl mr-12">मुख्यविभाग</h1>
            <h1 className="text-2xl text-white font-semibold relative z-10">
          <span className="z-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {ownerName || 'Guest'}
          </span>
          <span className="absolute inset-0 text-white opacity-20 blur-sm">
            {ownerName || 'Guest'}
          </span>
        </h1>
          </div>
          <div className="flex flex-row">
            <div
              className="bg-gray-500"
              style={{ height: "450px", width: "700px" }}
            >
              <div className="flex flex-col">
                <div className="w-auto h-12 flex flex-row p-2">
                  <h1 className="text-xl">दिनांक</h1>
                  <input
                    type="date"
                    className="ml-2 p-1 rounded-md shadow-md text-black"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]} // Restrict future dates
                  />
                  <select
                    className="ml-2 p-1 rounded-md shadow-md text-black"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                  >
                    <option value="morning">सकाळ </option>
                    <option value="evening">संध्याकाळ </option>
                  </select>
                  <div>
                  <label className="ml-2 bg-blue-800 p-2 text-white rounded-md">
                    <input
                      className="mr-2"
                      type="radio"
                      checked={autoFill}
                      onChange={handleAutoFillChange}
                    />
                    मागील 
                  </label>
                </div>
                </div>
                <div className=" w-auto h-12 flex flex-row p-2">
                  <label htmlFor="code" className="mr-4 ml-12">
                    यू. कोड 
                  </label>
                  <input
                    type="text"
                    id="code"
                    className="w-12 mr-4 text-black rounded-md shadow-lg"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    onBlur={handleRegisterNoBlur}
                    onFocus={handleRegisterNoFocus}
                    ref={input1Ref}
                    onKeyPress={(e) => handleKeyPress(e, 0)}
                  />
                  <select
                    className=" mr-4 block text-black w-96 rounded-md shadow-lg"
                    id="dropdown"
                    value={selectedOption}
                    onChange={handleUserChange}
                    onKeyPress={(e) => handleKeyPress(e, 1)}
                  >
                    <option value="">Choose...</option>
                    {users.map((user) => (
                      <option key={user.registerNo} value={user.registerNo}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="block text-black w-12 rounded-md shadow-lg"
                    id="dropdown"
                    value={selectedMilk}
                    onChange={(e) => {
                      console.log("Milk type selected:", e.target.value); // Log to confirm selection
                      setselectedMilk(e.target.value); // Ensure this updates correctly
                    }}
                    onKeyPress={(e) => handleKeyPress(e, 2)}
                  >
                    <option value="">Milk Type</option>
                    {users.map((user) => (
                      <option key={user.registerNo} value={user.milk}>
                        {user.milk}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-auto h-12 flex flex-row">
                  <section
                    className="flex flex-row mt-5 ml-12 bg-slate-500"
                    style={{ height: "80px", width: "600px" }}
                  >
                    <input
                      type="text"
                      className="h-8 w-20 m-4 text-black block shadow-md rounded-md"
                      placeholder="लिटर"
                      ref={(ref) => (inputRefs.current[1] = ref)}
                      onKeyPress={(e) => handleKeyPress(e, 1)}
                    />
                    <input
                      type="text"
                      className="h-8 w-20 m-4 text-black block shadow-md rounded-md"
                      placeholder="फॅट"
                      onChange={handleFatChange}
                      value={fat}
                      ref={(ref) => (inputRefs.current[2] = ref)}
                      onKeyPress={(e) => handleKeyPress(e, 2)}
                    />
                    <input
                      type="text"
                      className="h-8 w-20 m-4 text-black block shadow-md rounded-md"
                      placeholder="SNF"
                      onChange={handleSnfChange}
                      value={snf}
                      ref={(ref) => (inputRefs.current[3] = ref)}
                      onKeyPress={(e) => handleKeyPress(e, 5)}
                    />
                    <input
                      type="text"
                      className="h-8 w-20 m-4 text-black block shadow-md rounded-md"
                      placeholder="दर"
                      ref={(ref) => (inputRefs.current[4] = ref)}
                      readOnly
                    />
                    <input
                      type="text"
                      className="h-8 w-20 m-4 text-black block shadow-md rounded-md"
                      placeholder="रक्कम"
                      ref={(ref) => (inputRefs.current[5] = ref)}
                      onKeyPress={(e) => handleKeyPress(e, 0)}
                      readOnly
                    />
                  </section>
                </div>
              </div>
            </div>
            <div
              className="bg-gray-500"
              style={{ height: "450px", width: "300px" }}
            >
              <button
                onClick={calculateRates}
                className="h-8 w-48 mt-4 ml-12 rounded-lg bg-blue-500 text-white"
              >
                दर व रक्कम काढा
              </button>
              <button
                onClick={handleSubmit}
                className="h-8 w-48 mt-4 ml-12 rounded-lg bg-green-500 text-white"
              >
                Save
              </button>
              <button
                onClick={handleUpdate}
                className="h-8 w-48 mt-4 ml-12 rounded-lg bg-green-500 text-white"
              >
                Update
              </button>
              <div
                className="relative mt-8 flex flex-row space-y-4"
                style={{ marginLeft: "-650px" }}
              >
                <div className="relative mt-6 flex flex-col space-y-4">
                  <h1>गाय दूध</h1>
                  {/* Main Hover Button */}
                  <div className="group relative">
                    <button className="px-2 py-1 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 w-full">
                      View Milk Statistics
                    </button>
                    <div className="hidden group-hover:block absolute top-0 left-full ml-4 w-64 p-4 bg-gray-100 rounded-lg shadow-lg">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="text-left">Statistic</th>
                            <th className="text-right">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-black font-bold">Total Liter</td>
                            <td className="text-blue-600 font-bold">{totalLiterCow}</td>
                          </tr>
                          <tr>
                            <td className="text-black font-bold">Avg Fat</td>
                            <td className="text-blue-600 font-bold">{avgFatCow}</td>
                          </tr>
                          <tr>
                            <td className="text-black font-bold">Avg SNF</td>
                            <td className="text-blue-600 font-bold">{avgSnfCow}</td>
                          </tr>
                          <tr>
                            <td className="text-black font-bold">Avg Rate</td>
                            <td className="text-blue-600 font-bold">{avgRateCow}</td>
                          </tr>
                          <tr>
                            <td className="text-black font-bold">Total Rakkam</td>
                            <td className="text-blue-600 font-bold">{totalRakkamCow}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                <div className="relative mt-6 flex flex-col space-y-4 ml-36">
                  <h1>म्हैस दूध</h1>
                  {/* Main Hover Button for Buffalo Milk */}
                  <div className="group relative">
                    <button className="px-2 py-1 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 w-full">
                      View Milk Statistics
                    </button>
                    <div className="hidden group-hover:block absolute top-0 right-full mr-4 w-64 p-4 bg-gray-100 rounded-lg shadow-lg">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="text-left">Statistic</th>
                            <th className="text-right">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-black font-bold">
                              Total Liter
                            </td>
                            <td className="text-blue-600 font-bold">
                              {totalLiter}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-black font-bold">Avg Fat</td>
                            <td className="text-blue-600 font-bold">
                              {avgFat}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-black font-bold">Avg SNF</td>
                            <td className="text-blue-600 font-bold">
                              {avgSnf}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-black font-bold">Avg Rate</td>
                            <td className="text-blue-600 font-bold">
                              {avgRate}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-black font-bold">
                              Total Rakkam
                            </td>
                            <td className="text-blue-600 font-bold">
                              {totalRakkam}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div>
              <div className="flex flex-row space-x-6">
              <div className="relative mt-6 flex flex-col space-y-4 ml-36">
                    <Image
                      src="/assets/cen2.jpg"
                      alt="Image"
                      className="rounded-lg"
                      width={100}
                      height={300}
                    />
                  </div>
                  <h1>00</h1>

                  <div className="relative mt-6 flex flex-col space-y-4 ml-36">
                    <Image
                      src="/assets/cen2.jpg"
                      alt="Image"
                      className="rounded-lg"
                      width={100}
                      height={300}
                    />
                  </div>
                  <h1>00</h1>
              </div>
                    <h1 className="text-2xl text-black font-semibold"> काटा झेरो </h1>
                </div>
              </div>
              <div>
              {/* Button to open the modal */}
              <button
                onClick={toggleModal}
                className=" py-2 px-4 bg-blue-500 text-white rounded-lg shadow-lg"
              >
                Show Users
              </button>

              {/* Modal for displaying user table */}
              {isModalOpen && (
                  <div className="text-black fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-10">
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 relative max-h-[600px] overflow-y-auto">
                      <h2 className="text-xl text-black font-semibold mb-4">Users Without Milk Records</h2>
                      {/* Cross button */}
                      <button
                        onClick={toggleModal}
                        className="text-black absolute top-2 right-2 hover:text-black text-2xl font-bold"
                      >
                        &times;
                      </button>

                      <table className="table-auto w-full border-collapse text-black">
                        <thead>
                          <tr className="bg-gray-400">
                            <th className="border-b px-4 py-2 text-left text-black">Register No</th>
                            <th className="border-b px-4 py-2 text-left text-black">Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {susers.map((user) => (
                            <tr key={user._id}>
                              <td className="border-b px-4 py-2 text-black">{user.registerNo}</td>
                              <td className="border-b px-4 py-2 text-black">{user.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

            </div>
            </div>
            
          </div>
        </div> 
      </div>
      
</div>
   <div className="gradient-bg flex flex-col items-center justify-center min-h-screen">
      {/* Make sure the gradient is applied to the full height */}
      <AddUserOrder />
      <Addadvance />
      <AddBillKapat />
      <SessionMilk />
      <KapatNetpay />
    </div>
    </>
  );
}
