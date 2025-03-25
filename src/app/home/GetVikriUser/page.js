"use client";
import { ToastContainer, toast as Toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function GetVikriUser() {
    const [vikriUsers, setVikriUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("/api/user/GetVikriUser");
                setVikriUsers(response.data.data);
            } catch (error) {
                console.error("Failed to fetch vikri users:", error);
                Toast.error("Failed to fetch vikri users");
            }
        }
        fetchData();
    }, []);

    return (
        <div className="gradient-bg flex flex-col min-h-screen mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Vikri Users</h2>
            {vikriUsers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border text-black border-gray-300 px-4 py-2 text-left">Register No</th>
                                <th className="border text-black border-gray-300 px-4 py-2 text-left">Name</th>
                                <th className="border text-black border-gray-300 px-4 py-2 text-left">Milk Type</th>
                                <th className="border text-black border-gray-300 px-4 py-2 text-left">Phone</th>
                                <th className="border text-black border-gray-300 px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vikriUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-300 bg-gray-200">
                                    <td className="border text-black border-gray-300 px-4 py-2">{user.registerNo}</td>
                                    <td className="border text-black border-gray-300 px-4 py-2">{user.name}</td>
                                    <td className="border text-black border-gray-300 px-4 py-2">{user.milk}</td>
                                    <td className="border text-black border-gray-300 px-4 py-2">{user.phone}</td>
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        <Link
                                            href={`/home/GetVikriUser/${user._id}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">No vikri users found.</p>
            )}
            <ToastContainer />
        </div>
    );
}
