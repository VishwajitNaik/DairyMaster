// Frontend: components/DomyData.js
"use client";
import React, { useState } from "react";
import axios from "axios";

const DomyData = () => {
    const [domy, setDomy] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const token = localStorage.getItem("token"); 
            const response = await axios.post("/api/domyRoute", { domy }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                setMessage("Data submitted successfully!");
                setDomy("");
            }
        } catch (error) {
            setError(error.response?.data?.error || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 bg-white rounded-lg shadow-lg">
            <h1 className="text-xl font-bold mb-4">Submit Domy Data</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="number"
                    value={domy}
                    onChange={(e) => setDomy(e.target.value)}
                    placeholder="Enter Domy Data"
                    className="w-full p-2 border border-gray-300 rounded text-black"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full p-2 rounded ${isLoading ? "bg-gray-400" : "bg-blue-600 text-white"}`}
                >
                    {isLoading ? "Submitting..." : "Submit"}
                </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
};

export default DomyData;
