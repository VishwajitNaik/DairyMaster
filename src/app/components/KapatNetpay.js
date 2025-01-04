"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDetails = () => {
    const [users, setUsers] = useState([]); // Initialize as an empty array
    const [selectedUser, setSelectedUser] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch users for dropdown selection
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("/api/user/getUsers"); // Adjust endpoint as needed
                // Log the response data to see its structure
                console.log("Users fetched:", res.data.data.users);

                // Ensure the response is an array before setting the state
                if (Array.isArray(res.data.data.users)) {
                    setUsers(res.data.data.users);
                } else {
                    throw new Error("Unexpected response format");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to fetch users");
            }
        };
        fetchUsers();
    }, []);

    // Fetch user details based on selected user and date range
    const fetchUserDetails = async () => {
        if (!selectedUser || !startDate || !endDate) {
            setError("Please select a user and date range");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`/api/orders/afterKapatOrders/${selectedUser}`, {
                startDate,
                endDate,
            });
            setUserDetails(response.data);
        } catch (error) {
            setError("Failed to fetch user details");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-md shadow-md mt-12">
            <h1 className="text-2xl font-semibold text-white mb-4">User Details</h1>
            
            {/* User Selection */}
            <div className="mb-4">
                <label className="text-white" htmlFor="userSelect">Select User:</label>
                <select
                    id="userSelect"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full mt-2 p-2 rounded-md bg-gray-700 text-white"
                >
                    <option value="">Choose a user</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date Range Selection */}
            <div className="flex gap-4 mb-4">
                <div className="flex flex-col">
                    <label htmlFor="startDate" className="text-white">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-2 rounded-md bg-gray-700 text-white"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="endDate" className="text-white">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-2 rounded-md bg-gray-700 text-white"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={fetchUserDetails}
                className="w-full py-2 mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md"
                disabled={loading}
            >
                {loading ? "Loading..." : "Fetch Details"}
            </button>

            {/* Display Errors */}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {userDetails && (
    <div className="mt-6 text-white">
        <h2 className="text-lg font-semibold">Order and Payment Details</h2>
        
        <table className="min-w-full bg-gray-700 border border-gray-200 mb-4">
            <tbody>
                <tr>
                    <td className="py-2 px-4 border text-right font-semibold">एकूण कपात </td>
                    <td className="py-2 px-4 border">{userDetails.totalRakkam}</td>
                </tr>
                <tr>
                    <td className="py-2 px-4 border text-right font-semibold">अडवांस रक्कम </td>
                    <td className="py-2 px-4 border">{userDetails.totalAdvance}</td>
                </tr>
                <tr>
                    <td className="py-2 px-4 border text-right font-semibold">Total Bill Kapat:</td>
                    <td className="py-2 px-4 border">{userDetails.totalBillKapat}</td>
                </tr>
                <tr>
                    <td className="py-2 px-4 border text-right font-semibold">Net Payment:</td>
                    <td className="py-2 px-4 border">{userDetails.netPayment}</td>
                </tr>
            </tbody>
        </table>

        <h3 className="text-md font-semibold mt-6">Order Records</h3>
        <table className="min-w-full bg-gray-700 border border-gray-200 mb-4">
            <thead>
                <tr>
                    <th className="py-2 px-4 border text-left">Date</th>
                    <th className="py-2 px-4 border text-left">Amount</th>
                </tr>
            </thead>
            <tbody>
                {userDetails.userOrders.map((order, index) => (
                    <tr key={index}>
                        <td className="py-2 px-4 border">{new Date(order.date).toLocaleDateString("en-GB")}</td>
                        <td className="py-2 px-4 border">{order.rakkam}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <h3 className="text-md font-semibold mt-6">Bill Kapat Records</h3>
        <table className="min-w-full bg-gray-700 border border-gray-200 mb-4">
            <thead>
                <tr>
                    <th className="py-2 px-4 border text-left">Date</th>
                    <th className="py-2 px-4 border text-left">Rate</th>
                </tr>
            </thead>
            <tbody>
                {userDetails.billKapatRecords.map((record, index) => (
                    <tr key={index}>
                        <td className="py-2 px-4 border">
                            {new Date(record.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </td>
                        <td className="py-2 px-4 border">{record.rate}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <h3 className="text-md font-semibold mt-6">Advance Cuts</h3>
        <table className="min-w-full bg-gray-700 border border-gray-200">
            <thead>
                <tr>
                    <th className="py-2 px-4 border text-left">Date</th>
                    <th className="py-2 px-4 border text-left">Amount</th>
                </tr>
            </thead>
            <tbody>
                {userDetails.advanceCuts.map((advance, index) => (
                    <tr key={index}>
                        <td className="py-2 px-4 border">
                            {new Date(advance.date).toLocaleDateString("en-GB")}
                        </td>
                        <td className="py-2 px-4 border">{advance.rakkam}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
        </div>
    );
};

export default UserDetails;
