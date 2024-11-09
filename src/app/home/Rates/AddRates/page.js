"use client";
import { useState } from 'react';
import axios from 'axios';

const RateForm = () => {
    const [formData, setFormData] = useState({
        HighFatB: '',
        HighRateB: '',
        LowFatB: '',
        LowRateB: '',
        HighFatC: '',
        HighRateC: '',
        LowFatC: '',
        LowRateC: ''
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const response = await axios.post('/api/milkrate/addrates', formData);
            setMessage(response.data.message);
            setFormData({
                HighFatB: '',
                HighRateB: '',
                LowFatB: '',
                LowRateB: '',
                HighFatC: '',
                HighRateC: '',
                LowFatC: '',
                LowRateC: ''
            });
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Add New Rate</h2>
            {message && <p className="text-green-600 text-center mb-4">{message}</p>}
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    <span className="text-gray-700">High Fat B:</span>
                    <input
                        type="text"
                        name="HighFatB"
                        value={formData.HighFatB}
                        onChange={handleChange}
                        required
                        className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">High Rate B:</span>
                    <input
                        type="text"
                        name="HighRateB"
                        value={formData.HighRateB}
                        onChange={handleChange}
                        required
                        className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">Low Fat B:</span>
                    <input
                        type="text"
                        name="LowFatB"
                        value={formData.LowFatB}
                        onChange={handleChange}
                        required
                        className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">Low Rate B:</span>
                    <input
                        type="text"
                        name="LowRateB"
                        value={formData.LowRateB}
                        onChange={handleChange}
                        required
                        className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">High Fat C:</span>
                    <input
                        type="text"
                        name="HighFatC"
                        value={formData.HighFatC}
                        onChange={handleChange}
                        required
                        className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">High Rate C:</span>
                    <input
                        type="text"
                        name="HighRateC"
                        value={formData.HighRateC}
                        onChange={handleChange}
                        required
                        className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">Low Fat C:</span>
                    <input
                        type="text"
                        name="LowFatC"
                        value={formData.LowFatC}
                        onChange={handleChange}
                        required
                        className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-700">Low Rate C:</span>
                    <input
                        type="text"
                        name="LowRateC"
                        value={formData.LowRateC}
                        onChange={handleChange}
                        required
                        className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </label>
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

export default RateForm;
