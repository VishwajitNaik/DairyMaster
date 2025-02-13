"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AddUserOrder from "../../components/AddUserOrder.js";
import Addadvance from "../../components/AddAdvance.js";
import AddBillKapat from "../../components/AddBillKapat.js";
import AllUserMilks from "../../components/GetUserMilk.js";
import TenDayBill from "../../components/TendayMilk.js";
import KapatNetpay from "../../components/KapatNetpay.js";
import HeroBanner from "@/app/components/HeroBannerHome.js";
import { getDataFromToken } from "@/helpers/getDataFromToken"; // Ensure this is set up correctly to decode the token.
import LatestMilkRecords from "@/app/components/LatestMilkRecords.js";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Image from "next/image.js";
import { ToastContainer, toast as Toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link.js";

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
  const [ownerName, setOwnerName] = useState("");
  const [rates, setRates] = useState({});
  const [buffaloConstants, setBuffaloConstants] = useState({});
  const [cowConstants, setCowConstants] = useState({});
  //
  const [selectedUserId, setSelectedUserId] = useState(""); // Selected user ID
  const [lastRecord, setLastRecord] = useState(null); // Latest milk record
  const [fat, setFat] = useState(""); // State for fat input
  const [snf, setSnf] = useState(""); // State for SNF input
  const [autoFill, setAutoFill] = useState(false); // State for radio button

  //
  const [susers, setSUsers] = useState([]); // Initialize users as an empty array
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const [activeComponent, setActiveComponent] = useState(null);
  const [defaultSNF, setDefaultSNF] = useState(null);
  const [useDefault, setUseDefault] = useState(false); // State for checkbox

  
  const fetchDefaultSNF = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/milk/GetDefaultSNF");
      setDefaultSNF(response.data.data);
    } catch (error) {
      setError("Failed to fetch default SNF");
    } finally {
      setLoading(false);
    }
  };

  // Fetch default SNF on component mount
  useEffect(() => {
    fetchDefaultSNF();
  }, []);

  const renderComponent = () => {
      switch (activeComponent) {
          case "AddUserOrder":
              return <AddUserOrder />;
          case "Addadvance":
              return <Addadvance />;
          case "AddBillKapat":
              return <AddBillKapat />;
          default:
              return <p className="text-gray-500 text-center mt-4">वरीलपैकी एका बटनवर क्लिक करा.</p>;
      }
  };




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
        const response = await fetch("/api/owner/OwnerName"); // Call your API route
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
        const res = await axios.get("/api/user/getUserList");
        setUsers(res.data.data);
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

    const user = users.find(
      (user) => user.registerNo === parseInt(selectedRegisterNo, 10)
    );
    setSelectedUser(user); // Update selected user based on register number
    setLastRecord(null); // Reset last record to trigger fetch
    setError(null); // Reset error state
    if (!autoFill) {
      setFat(""); // Reset fat only if auto-fill is not selected
      setSnf(""); // Reset SNF only if auto-fill is not selected
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
        const response = await axios.get("/api/milkrate/getRates");
        // Assuming the response.data.data is an array
        if (
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
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

  const calculateValuesCow = (X, cowConstants) => {
    const { HF, R1, LF, R2 } = cowConstants;
    const R = (R1 - R2) / (HF - LF); // Calculate R
    console.log("R", R);
    let FR = 0;
    if(X < HF){
       FR = (R1 - (HF - X) * R); // 30.90
    } else {
       FR = (R1 - (HF - HF) * R); // 30.90
    }
     // Calculate FR
    return FR; // Return the calculated fat rate
  };

  const calculateValuesBuff = (X, BuffaloConstants) => {
    const { HF, R1, LF, R2 } = BuffaloConstants;
    const R = (R1 - R2) / (HF - LF); // Calculate R
    console.log("R", R);
    let FR = 0;
    if(X < HF){
       FR = (R1 - (HF - X) * R); // 30.90
    } else {
       FR = (R1 - (HF - HF) * R); // 30.90
    }
     // Calculate FR
    return FR; // Return the calculated fat rate
  };



  const calculateTotalRateCow = (X, Y) => {
 
    const FR = calculateValuesCow(X, cowConstants); // Calculate the fat rate based on selected constants
    let TFR = FR; // Initialize total rate to Fat Rate (FR)

    // Loop through the SNF ranges to calculate the total rate
    cowConstants.SNF_RANGES.forEach((range) => {
      if (Y >= range.start && Y <= range.end) {
        const SNFRate = 10 * (Y - range.start) * range.rate; // Calculate SNF rate for the range
        TFR += SNFRate; // Add SNF rate to total rate
        
      } else if (Y > range.end) {
        const SNFRate = 10 * (range.end - range.start) * range.rate; // Calculate full SNF rate for the range        
        TFR += SNFRate; // Add SNF rate to total rate
        console.log("TFR",TFR);
        
      }
    });

    return TFR; // Return the calculated total rate
  };

  const calculateTotalRateBuff = (X, Y) => {
 
    const FR = calculateValuesBuff(X, buffaloConstants); // Calculate the fat rate based on selected constants
    let TFR = FR; // Initialize total rate to Fat Rate (FR)

    // Loop through the SNF ranges to calculate the total rate
    buffaloConstants.SNF_RANGES.forEach((range) => {
      if (Y >= range.start && Y <= range.end) {
        const SNFRate = 10 * (Y - range.start) * range.rate; // Calculate SNF rate for the range
        TFR += SNFRate; // Add SNF rate to total rate
        
      } else if (Y > range.end) {
        const SNFRate = 10 * (range.end - range.start) * range.rate; // Calculate full SNF rate for the range        
        TFR += SNFRate; // Add SNF rate to total rate
        console.log("TFR",TFR);
        
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

    console.log("fat",fatInput);
    

    let rate = 0; // Default to 0 to avoid undefined errors

    // let HFHSRate = HF

    if (selectedMilk === "गाय ") {
      rate = parseFloat(calculateTotalRateCow(fatInput, snfInput)) || 0;
    } else {
      rate = parseFloat(calculateTotalRateBuff(fatInput, snfInput)) || 0;
    }

   

    const amount = liter * rate;

    inputRefs.current[4].value = rate.toFixed(2); // Set calculated rate
    inputRefs.current[5].value = amount.toFixed(2); // Set calculated amount
};


const clearForm = (shouldClear = true, hasPreviousData = false) => {
  if (!shouldClear) return; // Prevent clearing if shouldClear is false

  // ✅ Don't clear fields if previous data exists
  if (!hasPreviousData) {
    inputRefs.current.forEach((input, index) => {
      if (input && index >= 1) {
        input.value = ""; // Clear only the relevant fields
      }
    });

    setFat(""); // Reset fat input
    if (useDefault === true) {
      setSnf(defaultSNF.snf); // Set SNF to default if useDefault is true
    } else {
      setSnf(""); // Otherwise, clear SNF input
    }
  }
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

    if (isNaN(liter) || isNaN(fat) || isNaN(snf) || isNaN(dar) || isNaN(rakkam)) {
      alert("Please enter valid numbers before submitting");
      return;
    }

    const payload = {
      registerNo: selectedOption,
      session: currentTime,
      milk: selectedMilk,
      liter,
      fat,
      snf,
      dar,
      rakkam,
      date: currentDate,
    };

    const res = await axios.post("/api/milk/createMilk", payload);
    Toast.success(res.data.message);

    if (res.data.alert) {
      // ✅ If milk record exists, update input fields and prevent clearing
      Toast.success(res.data.alert);
      if (res.data.data) {
        const milkRecord = res.data.data;
        inputRefs.current[1].value = milkRecord.liter;
        inputRefs.current[2].value = milkRecord.fat;
        inputRefs.current[3].value = milkRecord.snf;
        inputRefs.current[4].value = milkRecord.dar;
        inputRefs.current[5].value = milkRecord.rakkam;
      }
    } else {
      // ✅ Only clear form if no previous record exists
      setTimeout(() => {
        clearForm(true, res.data.alert); // Pass hasPreviousData flag
        input1Ref.current.focus();
      }, 1000);
    }
  } catch (error) {
    Toast.error("Error storing milk information:", error.message);
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
        const res = await axios.get(
          `/api/milk/latest?userId=${selectedUser._id}`
        );
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
    const isChecked = event.target.checked;
    setAutoFill(isChecked);

    // If "Previous" checkbox is checked, clear the "Fix SNF" checkbox
    if (isChecked) {
      setUseDefault(false);
    }

    if (isChecked && lastRecord) {
      setFat(lastRecord.fat); // Autofill fat from last record
      setSnf(lastRecord.snf); // Autofill SNF from last record
    } else {
      setFat(""); // Clear fat field if checkbox is unchecked
      setSnf(""); // Clear SNF field if checkbox is unchecked
    }
  };

  // Handle "Fix SNF" checkbox change
  const handleCheckboxChange = () => {
    const isChecked = !useDefault;
    setUseDefault(isChecked);

    // If "Fix SNF" checkbox is checked, clear the "Previous" checkbox
    if (isChecked) {
      setAutoFill(false);
    }

    if (isChecked && defaultSNF) {
      setSnf(defaultSNF.snf); // Autofill SNF input with default value
    } else {
      setSnf(""); // Clear SNF input if checkbox is unchecked
    }
  };

  // Handle manual input changes
  const handleFatChange = (event) => setFat(event.target.value);
  const handleSnfChange = (event) => setSnf(event.target.value);

  const handlePageRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="banner relative min-h-screen -mb-12">
      <video autoPlay loop muted className="opacity-50">
        <source src="/assets/milk.mp4" type="video/mp4" /> 
      </video>
        <div className="absolute top-12 left-0 right-0 flex justify-center items-center">
          <div
            className="bg-gray-400 bg-opacity-50 rounded-md flex flex-col"
            style={{ height: "500px", width: "1000px" }}
          >
            <div
              className="bg-gray-500 bg-opacity-50 rounded-md p-4 flex items-center"
              style={{ height: "50px", width: "100%" }}
            >
              <h1 className="text-xl mr-12 -mt-8">
                <Image
                  src="/milkhub-192.png"
                  alt="Background Image"
                  width={100}
                  height={10}
                />
              </h1>
              <h1 className="text-2xl font-semibold relative z-0 text-gray-800 overflow-hidden">
              <span className="relative z-10 inline-block text-white bg-clip-text text-transparent animate-slide">
                {ownerName || "Guest"}
              </span>
              <span className="absolute inset-0 text-gray-300 opacity-30 blur-sm animate-slide">
                {ownerName || "Guest"}
              </span>
            </h1>
            <button
              className="text-white py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300 border-b-2 hover:border-b-2 hover:border-blue-500 border-gray-300"
              onClick={handlePageRefresh}
            >
              <i className="fas fa-sync-alt"></i> {/* Font Awesome Refresh Icon */}
            </button>
            </div>
            <div className="flex flex-row">
              <div
                className=" bg-opacity-50"
                style={{ height: "450px", width: "700px" }}
              >
                <div className="flex flex-col">
                  <div className="w-auto h-14 flex flex-row p-2">
                    <input
                      type="date"
                      className="text-black p-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-1/4 bg-gray-200 rounded-md"
                      value={currentDate}
                      onChange={(e) => setCurrentDate(e.target.value)}
                      max={new Date().toISOString().split("T")[0]} // Restrict future dates
                    />
                    <select
                      className="text-black p-2 ml-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-1/5 bg-gray-200 rounded-md"
                      value={currentTime}
                      onChange={(e) => setCurrentTime(e.target.value)}
                    >
                      <option value="morning">सकाळ </option>
                      <option value="evening">संध्याकाळ </option>
                    </select>
                    <div className="ml-4 rounded-lg flex flex-row">
                    <label className="flex items-center cursor-pointer space-x-2">
                      <span className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={autoFill}
                          onChange={handleAutoFillChange}
                        />
                        <div className="w-10 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-800 transition-all"></div>
                        <div className="w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-4 transition-all absolute top-1 left-1"></div>
                      </span>
                      <span className="text-white bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform ease-in-out">
                        मागील
                      </span>
                    </label>

                    {/* "Fix SNF" checkbox */}
                    <label className="flex ml-4 items-center cursor-pointer space-x-2">
                      <span className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={useDefault}
                          onChange={handleCheckboxChange}
                        />
                        <div className="w-10 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-800 transition-all"></div>
                        <div className="w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-4 transition-all absolute top-1 left-1"></div>
                      </span>
                      <span className="text-white bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform ease-in-out">
                        फिक्स
                      </span>
                    </label>
                    </div>
                  </div>
                  <div className=" w-auto h-12 flex flex-row p-2">
                    <label htmlFor="code" className="mr-4 ml-12"></label>
                    <input
                      type="text"
                      id="code"
                      placeholder="रजि. नं."
                      className="text-black h-12 text-2xl font-mono p-4 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-20 bg-gray-200 rounded-md"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      onBlur={handleRegisterNoBlur}
                      onFocus={handleRegisterNoFocus}
                      ref={input1Ref}
                      onKeyPress={(e) => handleKeyPress(e, 0)}
                      onInput={(e) => {
                        // Remove any non-numeric characters
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
                    />
                    <select
                      className=" text-black h-12 mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-1/2 bg-gray-200 rounded-md shadow-sm"
                      id="dropdown"
                      value={selectedOption}
                      onChange={handleUserChange}
                      onKeyPress={(e) => handleKeyPress(e, 1)}
                    >
                      <option value="">उत्पादकाचे नाव</option>
                      {users.map((user) => (
                        <option key={user.registerNo} value={user.registerNo}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="h-12 text-black mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-20 bg-gray-200 rounded-md shadow-sm"
                      id="dropdown"
                      value={selectedMilk}
                      onChange={(e) => {
                        console.log("Milk type selected:", e.target.value); // Log to confirm selection
                        setselectedMilk(e.target.value); // Ensure this updates correctly
                      }}
                      onKeyPress={(e) => handleKeyPress(e, 2)}
                    >
                      <option value="">दूध प्रकार </option>
                      {users.map((user) => (
                        <option key={user.registerNo} value={user.milk}>
                          {user.milk}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-auto h-12 flex flex-row">
                    <section
                      className="flex flex-row mt-5 ml-12 bg-slate-500 p-4"
                      style={{ height: "80px", width: "600px" }}
                    >
                    <input
                      type="text"
                      className="text-black p-4 text-2xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-24 bg-gray-200 rounded-md shadow-sm"
                      placeholder="लिटर"
                      ref={(ref) => (inputRefs.current[1] = ref)}
                      onKeyPress={(e) => handleKeyPress(e, 1)}
                      onInput={(e) => {
                        // Allow only numbers and a single decimal point
                        const value = e.target.value;
                        e.target.value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                      }}
                    />
                      <input
                        type="text"
                        className="text-black p-4 text-2xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-24 bg-gray-200 rounded-md shadow-sm"
                        placeholder="फॅट"
                        onChange={handleFatChange}
                        value={fat}
                        ref={(ref) => (inputRefs.current[2] = ref)}
                        onKeyPress={(e) => handleKeyPress(e, 2)}
                        onInput={(e) => {
                          // Allow only numbers and a single decimal point
                          const value = e.target.value;
                          e.target.value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                        }}
                      />
                      <input
                        type="text"
                        className="text-black p-4 text-2xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-24 bg-gray-200 rounded-md shadow-sm"
                        placeholder="SNF"
                        onChange={handleSnfChange}
                        value={snf}
                        ref={(ref) => (inputRefs.current[3] = ref)}
                        onKeyPress={(e) => handleKeyPress(e, 5)}
                        onInput={(e) => {
                          // Allow only numbers and a single decimal point
                          const value = e.target.value;
                          e.target.value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                        }}
                      />
                      <input
                        type="text"
                        className="text-black p-4 text-2xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-24 bg-gray-200 rounded-md shadow-sm"
                        placeholder="दर"
                        ref={(ref) => (inputRefs.current[4] = ref)}
                        readOnly
                      />
                      <input
                        type="text"
                        className="text-black p-4 text-2xl font-mono mr-4 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-24 bg-gray-200 rounded-md shadow-sm"
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
                className="bg-opacity-50"
                style={{ height: "450px", width: "300px" }}
              >
                <div className="flex flex-col">
                  <button
                    onClick={calculateRates}
                    className="w-full md:w-36 py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md hover:translate-x-3 shadow-black transition-all duration-300 ease-in-out"
                  >
                    दर व रक्कम काढा
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="w-full md:w-36 py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md hover:translate-x-3 shadow-black transition-all duration-300 ease-in-out"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="w-full md:w-36 py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md hover:translate-x-3 shadow-black transition-all duration-300 ease-in-out"
                  >
                    अपडेट 
                  </button>
                </div>
                <div
                  className="relative mt-8 flex flex-row space-y-4"
                  style={{ marginLeft: "-650px" }}
                >
                  <div className="relative mt-6 flex flex-col space-y-4">
                    {/* Main Hover Button */}
                    <div className="group relative">
                      <button className="w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105">
                        गाय दूध विवरण
                      </button>
                      <div className="hidden group-hover:block absolute top-0 left-full ml-4 w-64 p-4 bg-gray-100 rounded-lg shadow-lg z-10">
                        <div className="overflow-x-auto">
                          <table className="min-w-full border-collapse border border-gray-200 rounded-lg shadow-lg">
                            <thead className="bg-blue-500 text-white">
                              <tr>
                                <th className="text-left py-3 px-4 border-b border-gray-300 font-semibold">
                                  Statistic
                                </th>
                                <th className="text-right py-3 px-4 border-b border-gray-300 font-semibold">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              <tr className="hover:bg-blue-50 transition-colors duration-300 ease-in-out">
                                <td className="py-1 px-2 text-gray-700 font-bold bg-blue-200">
                                  Total Liter
                                </td>
                                <td className="py-1 px-2 text-blue-600 font-bold text-right bg-blue-200">
                                  {totalLiterCow}
                                </td>
                              </tr>
                              <tr className="hover:bg-blue-50 transition-colors duration-300 ease-in-out">
                                <td className="py-1 px-2 text-gray-700 font-bold">
                                  Avg Fat
                                </td>
                                <td className="py-1 px-2 text-blue-600 font-bold text-right">
                                  {avgFatCow}
                                </td>
                              </tr>
                              <tr className="hover:bg-blue-50 transition-colors duration-300 ease-in-out">
                                <td className="py-1 px-2 text-gray-700 font-bold bg-blue-200">
                                  Avg SNF
                                </td>
                                <td className="py-1 px-2 text-blue-600 font-bold text-right bg-blue-200">
                                  {avgSnfCow}
                                </td>
                              </tr>
                              <tr className="hover:bg-blue-50 transition-colors duration-300 ease-in-out">
                                <td className="py-1 px-2 text-gray-700 font-bold">
                                  Avg Rate
                                </td>
                                <td className="py-1 px-2 text-blue-600 font-bold text-right">
                                  {avgRateCow}
                                </td>
                              </tr>
                              <tr className="hover:bg-blue-50 transition-colors duration-300 ease-in-out">
                                <td className="py-1 px-2 text-gray-700 font-bold bg-blue-200">
                                  Total Rakkam
                                </td>
                                <td className="py-1 px-2 text-blue-600 font-bold text-right bg-blue-200">
                                  {totalRakkamCow}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-6 flex flex-col space-y-2 ml-36">
                    <h1></h1>
                    {/* Main Hover Button for Buffalo Milk */}
                    <div className="group relative">
                      <button className="w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105">
                        म्हैस दूध विवरण
                      </button>
                      <div className="hidden group-hover:block absolute top-0 right-full mr-4 w-64 p-4 bg-gray-100 rounded-lg shadow-lg z-10">
                        <div className="overflow-x-auto">
                          <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow-lg">
                            <thead className="bg-blue-500 text-white">
                              <tr>
                                <th className="text-left py-3 px-4 border-b border-gray-200 font-semibold">
                                  Statistic
                                </th>
                                <th className="text-right py-3 px-4 border-b border-gray-200 font-semibold">
                                  Value
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              <tr className="hover:bg-blue-50 transition-colors duration-300 ease-in-out">
                                <td className="py-1 px-2 text-black font-bold bg-blue-200">
                                  Total Liter
                                </td>
                                <td className="py-1 px-2 text-blue-600 font-bold text-right bg-blue-200">
                                  {totalLiter}
                                </td>
                              </tr>
                              <tr className="hover:bg-blue-50 transition-colors duration-300 ease-in-out">
                                <td className="py-1 px-2 text-black font-bold">
                                  Avg Fat
                                </td>
                                <td className="py-1 px-2 text-blue-600 font-bold text-right">
                                  {avgFat}
                                </td>
                              </tr>
                              <tr className="hover:bg-blue-50 transition-colors duration-300 ease-in-out">
                                <td className="py-1 px-2 text-black font-bold bg-blue-200">
                                  Avg SNF
                                </td>
                                <td className="py-1 px-2 text-blue-600 font-bold text-right bg-blue-200">
                                  {avgSnf}
                                </td>
                              </tr>
                              <tr className="hover:bg-blue-50 transition-colors duration-300 ease-in-out">
                                <td className="py-1 px-2 text-black font-bold">
                                  Avg Rate
                                </td>
                                <td className="py-1 px-2 text-blue-600 font-bold text-right">
                                  {avgRate}
                                </td>
                              </tr>
                              <tr className="hover:bg-blue-50 transition-colors duration-300 ease-in-out">
                                <td className="py-1 px-2 text-black font-bold bg-blue-200">
                                  Total Rakkam
                                </td>
                                <td className="py-1 px-2 text-blue-600 font-bold text-right bg-blue-200">
                                  {totalRakkam}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-row space-x-6">
                    <div className="relative mt-2 flex flex-col space-y-4 ml-36">
                      <Image
                        src="/assets/cen.png"
                        alt="Image"
                        className="rounded-lg"
                        width={100}
                        height={300}
                        layout="intrinsic"
                      />
                    </div>

                      <h1 className="text-2xl text-black font-semibold">00</h1>

                      <div className="relative mt-2 flex flex-col space-y-4 ml-36">
                        <Image
                          src="/assets/cen.png"
                          alt="Image"
                          className="rounded-lg"
                          width={100}
                          height={300}
                          sizes="(max-width: 768px) 100vw, 768px"
                        />
                      </div>

                      <h1 className="text-2xl text-black font-semibold">00</h1>
                    </div>
                    <h1 className="text-2xl text-black font-semibold">
                      {" "}
                      काटा झेरो{" "}
                    </h1>
                  </div>
                </div>
                <div>
                  {/* Button to open the modal */}
                  <button
                    onClick={toggleModal}
                    className="w-full md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
                  >
                    न आलेले उत्पादक
                  </button>
                  <Link href="/home/SessionMilk">
                    <button
                      className="w-full ml-2 md:w-36 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md shadow-black transition-transform duration-300 hover:scale-105"
                      value={currentTime}
                    >
                      {currentTime === "morning" ? (
                        <span>सकाळचे दूध</span>
                      ) : (
                        <span>संध्याकाळचे दूध</span>
                      )}
                    </button>
                  </Link>

                  {/* Modal for displaying user table */}
                  {isModalOpen && (
                    <div className="text-black fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-10 mt-12 rounded-md">
                      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 relative max-h-[600px] overflow-y-auto">
                        <h2 className="text-xl text-black font-semibold mb-4">
                          न आलेले उत्पादक{" "}
                        </h2>

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
                              <th className="border-b px-4 py-2 text-left text-black">
                                रजीस्टर नं{" "}
                              </th>
                              <th className="border-b px-4 py-2 text-left text-black">
                                उत्पादकाचे नाव{" "}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {susers.map((user) => (
                              <tr key={user._id}>
                                <td className="border-b px-4 py-2 text-black">
                                  {user.registerNo}
                                </td>
                                <td className="border-b px-4 py-2 text-black">
                                  {user.name}
                                </td>
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
        <ToastContainer />
      </div>
      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-purple-300 p-8 mt-12">
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={() => setActiveComponent("AddUserOrder")}
                    className={`py-2 px-4 rounded-lg ${
                        activeComponent === "AddUserOrder" ? "bg-blue-600 text-white" : "bg-blue-300 text-gray-800"
                    } hover:bg-blue-500 transition`}
                >
                    उत्पादक खरेदी
                </button>
                <button
                    onClick={() => setActiveComponent("Addadvance")}
                    className={`py-2 px-4 rounded-lg ${
                        activeComponent === "Addadvance" ? "bg-green-600 text-white" : "bg-green-300 text-gray-800"
                    } hover:bg-green-500 transition`}
                >
                    अडवांस जमा
                </button>
                <button
                    onClick={() => setActiveComponent("AddBillKapat")}
                    className={`py-2 px-4 rounded-lg ${
                        activeComponent === "AddBillKapat" ? "bg-yellow-600 text-white" : "bg-yellow-300 text-gray-800"
                    } hover:bg-yellow-500 transition`}
                >
                    खरेदी कपात
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {renderComponent()}
            </div>
        </div>
    </>
  );
}
