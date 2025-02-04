"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";

const AddRates = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        HighFatB: "",
        HighRateB: "",
        LowFatB: "",
        LowRateB: "",
        HighFatC: "",
        HighRateC: "",
        LowFatC: "",
        LowRateC: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            HighFatB: formData.HighFatB,
            HighRateB: formData.HighRateB,
            LowFatB: formData.LowFatB,
            LowRateB: formData.LowRateB,
            HighFatC: formData.HighFatC,
            HighRateC: formData.HighRateC,
            LowFatC: formData.LowFatC,
            LowRateC: formData.LowRateC,
        };

        try {
            const res = await axios.post("/api/sangh/AddRates", payload);
            setMessage(res.data.message);
            setFormData({
                HighFatB: "",
                HighRateB: "",
                LowFatB: "",
                LowRateB: "",
                HighFatC: "",
                HighRateC: "",
                LowFatC: "",
                LowRateC: "",
            });
        } catch (error) {
            setError("Error storing rate information: " + error.message);
        }
    };

    return (
            <div className="max-w-lg h-[90vh] mx-auto p-6 bg-blue-200 border border-gray-200 rounded-lg shadow-md mt-4 overflow-scroll">
                <h2 className="text-2xl text-center text-gray-800 mb-6 font-bold">दरपत्रक भरा</h2>
                {message && <p className="text-green-600 text-center mb-4">{message}</p>}
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <span className="text-gray-700 font-semibold text-2xl"> दरपत्रक म्हैस </span>
                        <label className="block w-full">
                            <span className="text-gray-700">सर्वात जास्त फॅट</span>
                            <input
                                type="text"
                                name="HighFatB"
                                value={formData.HighFatB}
                                onChange={handleChange}
                                required
                                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                            />
                        </label>
                        <label className="block w-full">
                            <span className="text-gray-700">जास्त फॅट दर</span>
                            <input
                                type="text"
                                name="HighRateB"
                                value={formData.HighRateB}
                                onChange={handleChange}
                                required
                                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                            />
                        </label>
                        <label className="block w-full">
                            <span className="text-gray-700">सर्वात कमी फॅट</span>
                            <input
                                type="text"
                                name="LowFatB"
                                value={formData.LowFatB}
                                onChange={handleChange}
                                required
                                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                            />
                        </label>
                        <label className="block w-full">
                            <span className="text-gray-700">सर्वात कमी फॅट दर</span>
                            <input
                                type="text"
                                name="LowRateB"
                                value={formData.LowRateB}
                                onChange={handleChange}
                                required
                                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                            />
                        </label>
                        <span className="text-gray-700 font-semibold text-2xl"> दरपत्रक गाय </span>
                        <label className="block w-full">
                            <span className="text-gray-700">सर्वात जास्त फॅट</span>
                            <input
                                type="text"
                                name="HighFatC"
                                value={formData.HighFatC}
                                onChange={handleChange}
                                required
                                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                            />
                        </label>
                        <label className="block w-full">
                            <span className="text-gray-700">सर्वात जास्त फॅट दर</span>
                            <input
                                type="text"
                                name="HighRateC"
                                value={formData.HighRateC}
                                onChange={handleChange}
                                required
                                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                            />
                        </label>
                        <label className="block w-full">
                            <span className="text-gray-700">सर्वात कमी फॅट</span>
                            <input
                                type="text"
                                name="LowFatC"
                                value={formData.LowFatC}
                                onChange={handleChange}
                                required
                                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                            />
                        </label>
                        <label className="block w-full">
                            <span className="text-gray-700">सर्वात कमी फॅट दर</span>
                            <input
                                type="text"
                                name="LowRateC"
                                value={formData.LowRateC}
                                onChange={handleChange}
                                required
                                className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Add Rate
                    </button>
                </form>
            </div>
    );
};

export default AddRates;
