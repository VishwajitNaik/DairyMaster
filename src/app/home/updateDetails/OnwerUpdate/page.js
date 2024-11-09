"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OwnerProfile = () => {
    const [ownerData, setOwnerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        registerNo: '',
        ownerName: '',
        dairyName: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        const fetchOwnerProfile = async () => {
            try {
                const response = await axios.get('/api/owner/OwnerDetails'); // Adjust the endpoint as necessary
                setOwnerData(response.data.data); // Set state with the owner's data
                setFormData({
                    registerNo: response.data.data.registerNo,
                    ownerName: response.data.data.ownerName,
                    dairyName: response.data.data.dairyName,
                    email: response.data.data.email,
                    phone: response.data.data.phone,
                }); // Initialize form data
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch owner profile');
            } finally {
                setLoading(false);
            }
        };

        fetchOwnerProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('/api/owner/updateOwner', formData); // Adjust the endpoint as necessary
            setOwnerData(response.data.data); // Update owner data with response
            setIsEditing(false); // Exit edit mode
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update owner profile');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg mt-10 shadow-md w-full max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold text-white mb-4">Owner Profile</h1>
            {isEditing ? (
                <form onSubmit={handleUpdate} className="text-white">
                    <div>
                        <label className="block">Register No:</label>
                        <input
                            type="text"
                            name="registerNo"
                            value={formData.registerNo}
                            onChange={handleInputChange}
                            className="text-black block w-full p-2 mt-1 mb-4 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block">Name:</label>
                        <input
                            type="text"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleInputChange}
                            className="text-black block w-full p-2 mt-1 mb-4 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block">Dairy Name:</label>
                        <input
                            type="text"
                            name="dairyName"
                            value={formData.dairyName}
                            onChange={handleInputChange}
                            className="text-black block w-full p-2 mt-1 mb-4 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="text-black block w-full p-2 mt-1 mb-4 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block">Phone:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="text-black block w-full p-2 mt-1 mb-4 rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded-md"
                    >
                        Update Profile
                    </button>
                </form>
            ) : (
                <div className="text-white">
                    <p><strong>Register No:</strong> {ownerData.registerNo}</p>
                    <p><strong>Name:</strong> {ownerData.ownerName}</p>
                    <p><strong>Dairy Name:</strong> {ownerData.dairyName}</p>
                    <p><strong>Email:</strong> {ownerData.email}</p>
                    <p><strong>Phone:</strong> {ownerData.phone}</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 bg-yellow-500 text-white p-2 rounded-md"
                    >
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default OwnerProfile;
