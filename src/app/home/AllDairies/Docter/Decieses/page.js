"use client";
import React, { useState } from "react";
import axios from "axios";

const Decieses = () => {
    const [decieses, setDecieses] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setMessage("");

            const response = await axios.post("/api/Docter/AddDecies", {
                Decieses: decieses,    
            });

            if (response.status === 200) {
                setMessage(response.data.message);
                setDecieses("");
            }
        } catch (error) {
            setError(error.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add Decies</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="decieses" className="block font-medium mb-2">
                        Decieses
                    </label>
                    <input
                        type="text"
                        id="decieses"
                        className="text-black w-full p-2 border border-gray-300 rounded"
                        value={decieses}
                        onChange={(e) => setDecieses(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add Decies
                </button>
            </form>
            {message && <p className="text-green-500 mt-4">{message}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default Decieses;
