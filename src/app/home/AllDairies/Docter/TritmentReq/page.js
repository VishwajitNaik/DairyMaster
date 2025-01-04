// pages/owners/index.js
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const OwnersPage = () => {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch owner data
    useEffect(() => {
        const getOwners = async () => {
            try {
                const res = await axios.get("/api/sangh/getOwners");
                console.log("Sangh Data:", res.data.data);
                setOwners(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch owners:", error.message);
                setError("Failed to fetch owners");
                setLoading(false);
            }
        };
        getOwners();
    }, []);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    const handleOwnerDetails = (ownerId) => {
        // Implement the logic to handle owner details, e.g., navigate to a details page
        console.log("Show details for owner ID:", ownerId);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8 text-gray-700">Owners List</h1>
            <div className="overflow-x-auto w-full max-w-6xl bg-white shadow-md rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-600">Reg No</th>
                            <th className="px-6 py-3 text-left text-gray-600">Dairy name</th>
                            <th className="px-6 py-3 text-left text-gray-600">Email</th>
                            <th className="px-6 py-3 text-left text-gray-600">Phone</th>
                            <th className="px-6 py-3 text-left text-gray-600">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {owners.map((owner) => (
                            <tr key={owner._id} className="border-b">
                                <td className="text-black px-6 py-4">{owner.registerNo}</td>
                                <td className="text-black px-6 py-4">{owner.dairyName}</td>
                                <td className="text-black px-6 py-4">{owner.email}</td>
                                <td className="text-black px-6 py-4">{owner.phone}</td>
                                <td className="text-black px-6 py-4">

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OwnersPage;
