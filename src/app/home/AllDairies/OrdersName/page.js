"use client";
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
    const { id } = useParams();
    const [productName, setProductName] = useState('');  // state for product name
    const [productNo, setProductNo] = useState('');      // state for product number
    const [productRate, setProductRate] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Match field names with backend schema (use uppercase for ProductName and ProductNo)
        const payload = {
            ProductName: productName,  // Make sure to use uppercase here
            ProductNo: productNo,
            ProductRate: productRate
        };
        
        console.log("Payload:", payload);  // Debugging output to check form data

        try {
            const res = await axios.post("/api/sangh/AddProductName", payload);  // Send data to your backend
            console.log(res.data.message);  // Log the response from the server

            // clear form information after successful submission
            setProductName('');  // Clear the form fields
            setProductNo('');   
            setProductRate('');

        } catch (error) {
            console.error("Error storing product information:", error.message);  // Catch errors in sending the request
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-300">Add Product</h1>

            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Product Information</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="productName" className="block text-gray-600 font-medium mb-2">Product Name</label>
                        <input 
                            type="text" 
                            id="productName"
                            value={productName}  // Bind the input value to state
                            onChange={(e) => setProductName(e.target.value)}  // Update state on input change
                            className="text-black w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow"
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="productNo" className="block text-gray-600 font-medium mb-2">Product Number</label>
                        <input 
                            type="text" 
                            id="productNo"
                            value={productNo}  // Bind the input value to state
                            onChange={(e) => setProductNo(e.target.value)}  // Update state on input change
                            className="text-black w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow"
                            placeholder="Enter product number"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="productRate" className="block text-gray-600 font-medium mb-2">Product Rate</label>
                        <input 
                            type="text" 
                            id="productRate"
                            value={productRate}  // Bind the input value to state
                            onChange={(e) => setProductRate(e.target.value)}  // Update state on input change
                            className="text-black w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow"
                            placeholder="Enter product number"
                            required
                        />
                    </div>
                    <div className="mt-8 text-center">
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Submit Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
