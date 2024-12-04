"use client"; // Ensure the correct spelling of the directive
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const GetOwnerKapat = () => {
    const { id } = useParams(); // Retrieve route parameter
    const [kapat, setKapat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch kapat options on component mount
    useEffect(() => {
        async function getKapatOptions() {
            try {
                const res = await axios.get("/api/sangh/getOwnerkapat");
                const sthirKapat = res.data.data.filter(
                    (item) => item.KapatType === "Kapat"
                );
                setKapat(sthirKapat);
                setLoading(false); // Set loading to false after fetching data
            } catch (error) {
                console.error("Failed to fetch kapat options:", error.message);
                setError("Failed to load kapat data.");
                setLoading(false); // Set loading to false if an error occurs
            }
        }
        getKapatOptions();
    }, []);

    // Conditional rendering based on loading and error states
    if (loading) {
        return <div className="text-center mt-20">Loading kapat data...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg mt-20 shadow-lg w-full max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">कपात डेटा</h1>

            {kapat.length === 0 ? (
                <div className="text-center text-gray-300">No kapat data found.</div>
            ) : (
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border-b border-gray-600 p-2 text-left text-white">
                                    कपात नाव
                                </th>
                                <th className="border-b border-gray-600 p-2 text-left text-white">
                                    तपशील
                                </th>
                                <th className="border-b border-gray-600 p-2 text-left text-white">
                                    तारीख
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {kapat.map((item, index) => (
                                <tr key={item._id} className="hover:bg-gray-600">
                                    <td className="border-b border-gray-600 p-2 text-white">
                                        {item.kapatName}
                                    </td>
                                    <td className="border-b border-gray-600 p-2 text-white">
                                        {item.details || "नाही"}
                                    </td>
                                    <td className="border-b border-gray-600 p-2 text-white">
                                        {new Date(item.date).toLocaleDateString() || "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GetOwnerKapat;
