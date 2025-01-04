"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const FetchDecieses = () => {
    const [decieses, setDecieses] = useState([]);
    const [error, setError] = useState("");

    const fetchDecieses = async () => {
        try {
            setError("");
            const response = await axios.get("/api/Docter/GetDecies");
            if (response.status === 200) {
                setDecieses(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch Decies");
            }
        } catch (error) {
            setError(error.response?.data?.error || "Something went wrong");
        }
    };

    useEffect(() => {
        fetchDecieses();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Decies List</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {decieses.length > 0 ? (
                <div className="bg-white shadow rounded-lg p-4">
                    <ul className="divide-y divide-gray-200">
                        {decieses.map((decies, index) => (
                            <li key={decies._id} className="py-2">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">
                                        {index + 1}. {decies.Decieses}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Created At: {new Date(decies.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-gray-500">No Decieses found.</p>
            )}
        </div>
    );
};

export default FetchDecieses;
