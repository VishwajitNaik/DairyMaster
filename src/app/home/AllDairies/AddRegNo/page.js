"use client";
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddRegNo = () => {
    const { id } = useParams();
    const [registerNo, setRegisterNo] = useState(''); // Changed regNo to registerNo
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');

    // Fetch owners when the component mounts
    useEffect(() => {
        const getOwners = async () => {
            try {
                const res = await axios.get('/api/owner/getOwners');
                setOwners(res.data.data); // Populate owners with the response data
                console.log(res.data);
            } catch (error) {
                console.error("Failed to fetch owners:", error.message);
            }
        };
        getOwners();
    }, []);

    // Handle owner selection
    const handleOwnerChange = (event) => {
        setSelectedOwner(event.target.value); // Update selected owner value
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            registerNo,  // Corrected to registerNo for backend consistency
            DairyName: selectedOwner,  // Use the selected owner dairy name
        };
        console.log('Payload:', payload);

        try {
            const res = await axios.post("/api/sangh/AddOwner", payload);
            console.log(res.data.message);
        } catch (error) {
            console.error("Error storing order information:", error.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* Register Number Input */}
                <div className='mb-4'>
                    <label htmlFor="registerNo" className='text-white font-medium'>Register No:</label>
                    <input
                        type="text"
                        id="registerNo"
                        className="p-2 rounded-md border border-gray-500 bg-gray-600 text-white"
                        value={registerNo}  // Controlled input
                        onChange={(e) => setRegisterNo(e.target.value)}  // Update registerNo state
                        required
                    />
                </div>

                {/* Owner Dropdown */}
                <div className='mb-4'>
                    <label htmlFor="owner-select" className="text-white font-medium">Dairy Name:</label>
                    <select
                        id="owner-select"
                        className="p-2 w-52 rounded-md border border-gray-500 bg-gray-600 text-white"
                        value={selectedOwner}  // Controlled input
                        onChange={handleOwnerChange}  // Update selectedOwner state
                        required
                    >
                        <option value="">Choose...</option>
                        {owners.map((owner) => (
                            <option className='text-white' key={owner.dairyName} value={owner.dairyName}>
                                {owner.dairyName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <button type="submit" className='w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md'>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddRegNo;
