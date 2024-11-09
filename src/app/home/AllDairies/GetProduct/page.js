"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DisplayProducts = () => {
    const [products, setProducts] = useState([]);  // State to store products
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(null);  // State for handling errors

    useEffect(() => {
        // Fetch the products when the component mounts
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/sangh/GetOrders');  // Make GET request to the backend
                
                // Check if the response data is valid
                if (response.data && response.data.data) {
                    console.log("Product Details", response.data.data);
                    setProducts(response.data.data);  // Set the products in state
                } else {
                    setError("Invalid data structure received from the API");
                }
                
            } catch (error) {
                console.error("Error fetching products:", error.message);
                setError("Failed to fetch products");
            } finally {
                setLoading(false);  // Stop loading once data is fetched or an error occurs
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>;  // Show loading state
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;  // Show error if any
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8 text-gray-700">Product List</h1>
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
                <table className="w-full text-left table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Product Name</th>
                            <th className="py-3 px-6 text-left">Product Number</th>
                            <th className="py-3 px-6 text-left">Product Rate</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6">{product.ProductName}</td>
                                    <td className="py-3 px-6">{product.ProductNo ? product.ProductNo : 'N/A'}</td>
                                    <td className="py-3 px-6">{product.ProductRate ? product.ProductRate : 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-3 px-6 text-center text-gray-500">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DisplayProducts;
