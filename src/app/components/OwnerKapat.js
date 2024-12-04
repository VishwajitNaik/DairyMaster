"use client"; // Ensure the correct spelling of the directive
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const OwnerKapat = () => {
    const { id } = useParams(); // Retrieve route parameter
    const [kapat, setKapat] = useState([]);
    const [owners, setOwners] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedKharediData, setSelectedKharediData] = useState("");
    const [selectedOptionOrder, setSelectedOptionOrder] = useState("");
    const [rakkam, setRakkam] = useState("");
    const [totalMilkRakkam, setTotalMilkRakkam] = useState(0);
    const [netPayment, setNetPayment] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const useRef = React.useRef(null);

    // Fetch owners on component mount
    useEffect(() => {
        async function getOwnerUsers() {
            try {
                const res = await axios.get("/api/sangh/getOwners");
                setOwners(res.data.data || []);
                setUsers(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch owners:", error.message);
            }
        }
        getOwnerUsers();
    }, []);

    
  const handleRegisterNoFocus = () => {
    setSelectedOption('');
    setSelectedUser(null);
    inputRefs.current.forEach(ref => {
      if (ref) ref.value = '';
    });
  };
    
  // create a useEffect for date

    useEffect(() => {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0]; // yyyy-mm-dd format
        setCurrentDate(formattedDate);
        setStartDate(formattedDate);
      }, []);

    const handleRegisterNoBlur = (event) => {
        const registerNo = event.target.value;
        const user = users.find(user => user.registerNo === parseInt(registerNo, 10));
        setSelectedUser(user);
        setSelectedOption(registerNo);
      };

    // Fetch kapat options on component mount
    useEffect(() => {
        async function getKapatOptions() {
            try {
                const res = await axios.get("/api/sangh/getOwnerkapat");
                const sthirKapat = res.data.data.filter(
                    (item) => item.KapatType === "Kapat"
                );
                setKapat(sthirKapat);
            } catch (error) {
                console.error("Failed to fetch kapat options:", error.message);
            }
        }
        getKapatOptions();
    }, []);

    // Handle changes for the Register Number
    const handleUserChange = (event) => {
        const registerNo = event.target.value;
        setSelectedOption(registerNo);
        const user = owners.find(
            (user) => user.registerNo === parseInt(registerNo, 10)
        );
        setSelectedUser(user || null);
    };

    // Handle form submission
const handleSubmit = async (event) => {
    event.preventDefault();

    // List of missing fields
    const missingFields = [];

    // Validate each field and add to missingFields if invalid
    if (!selectedOption) missingFields.push("Register Number");
    if (!selectedOptionOrder) missingFields.push("Kharedi Data");
    if (!currentDate) missingFields.push("Date");
    if (!rakkam || isNaN(parseFloat(rakkam))) missingFields.push("Rate");

    // If there are missing fields, show an alert and exit
    if (missingFields.length > 0) {
        alert(`Please fill out the following required fields:\n- ${missingFields.join("\n- ")}`);
        return;
    }

    // Payload to be sent to the server
    const payload = {
        date:currentDate,
        username: selectedUser?.ownerName,
        registerNo: selectedOption,
        orderData: selectedOptionOrder,
        rate: parseFloat(rakkam),
    };

    console.log("Submitting payload:", payload);

    // Try submitting the data
    try {
        const res = await axios.post("/api/sangh/Ownerkapat", payload);
        alert("Kapat entry saved successfully!");
        console.log(res.data);
    } catch (error) {
        console.error("Failed to save kapat entry:", error.response?.data || error.message);
    }
};


    // Fetch milk records (to be implemented as per your backend logic)
    const fetchMilkRecords = async () => {
        try {
            const res = await axios.get(
                `/api/sangh/getMilkRecords?startDate=${startDate}&endDate=${endDate}`
            );
            const { totalRakkam, netRemaining } = res.data;
            setTotalMilkRakkam(totalRakkam || 0);
            setNetPayment(netRemaining || 0);
        } catch (error) {
            console.error("Failed to fetch milk records:", error.message);
        }
    };

    return (
        <div
            className="bg-gray-800 p-6 rounded-lg mt-20 shadow-lg w-full max-w-2xl mx-auto"
            style={{
                backgroundImage: "url(/assets/mony.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="relative">
                <h1 className="text-3xl font-bold text-white mb-6 text-center mt-12">
                    खरेदी कपात
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-gray-700 p-6 rounded-lg shadow-md shadow-gray-900"
            >
                {/* Date Selection */}
                <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
                    <div>
                        <label htmlFor="startDate" className="text-white font-semibold">
                            Start Date:
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="text-black rounded-md p-2 shadow-md shadow-white ml-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="text-white font-semibold ml-4">
                            End Date:
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="text-black rounded-md p-2 shadow-md shadow-white ml-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="text-white font-semibold ml-4">
                            Kapat date:
                        </label>
                        <input
                            type="date"
                            id="currentDate"
                            value={currentDate}
                            onChange={(e) => setCurrentDate(e.target.value)}
                            className="text-black rounded-md p-2 shadow-md shadow-white ml-2"
                        />
                    </div>

                </div>

                {/* User Selection */}
                <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
                    <input
                        type="text"
                        id="code"
                        className='w-24 p-2 rounded-md border border-gray-500 bg-gray-600 text-white'
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        onBlur={handleRegisterNoBlur}
                        onFocus={handleRegisterNoFocus}
                        required
                    />
                    <select
                        id="user-select"
                        value={selectedOption}
                        onChange={handleUserChange}
                        className="w-full p-2 rounded-md border border-gray-500 bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user._id} value={user.registerNo}>
                                {user.ownerName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Milk Records */}
                <button
                    type="button"
                    onClick={fetchMilkRecords}
                    className="w-full py-2 mb-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition"
                >
                    Fetch Milk Records
                </button>

                {/* Display Milk Data */}
                <div className="bg-gray-600 p-4 mb-6 rounded-md shadow-inner flex justify-between space-x-6 text-white">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold">बील:</span>
                        <span className="px-2 py-1 bg-gray-800 border border-gray-400 rounded-md text-lg">
                            {totalMilkRakkam}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-bold">बाकी:</span>
                        <span className="px-2 py-1 bg-gray-800 border border-gray-400 rounded-md text-lg">
                            {netPayment}
                        </span>
                    </div>
                </div>

                {/* Order and Rate Input */}
                <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
                    <select
                        id="order-select"
                        value={selectedOptionOrder}
                        onChange={(e) => setSelectedOptionOrder(e.target.value)}
                        className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    >
                        <option value="">Choose an option...</option>
                        {kapat.map((k) => (
                            <option key={k._id} value={k.kapatName}>
                                {k.kapatName}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Enter Rate"
                        value={rakkam}
                        onChange={(e) => setRakkam(e.target.value)}
                        className="w-24 p-2 rounded-md border border-gray-500 bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default OwnerKapat;
