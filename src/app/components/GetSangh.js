import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetSangh = () => {
    const [sangh, setSangh] = useState([]);

    useEffect(() => {
        async function fetchSanghDetails() {
            try {
                console.log("Fetching sangh details...");
                const res = await axios.get("/api/sangh/getSangh");
                console.log("Response:", res.data.data);
                setSangh(res.data.data);
            } catch (error) {
                console.log("Failed to fetch sangh details:", error.message);
            }
        }
        fetchSanghDetails();
    }, []);

    return (
        <div className="container text-black mx-auto mt-6">
            <div className="flex justify-center mb-6">
                <h1 className="text-4xl font-bold">सभासद लिस्ट</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 border-b">sanghache nav</th>
                            <th className="py-2 px-4 border-b">email</th>
                            <th className="py-2 px-4 border-b">phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sangh.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="py-2 px-4 border-b text-center">
                                    No user created yet
                                </td>
                            </tr>
                        ) : (
                            sangh.map((sanghList, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{sanghList.SanghName}</td>
                                    <td className="py-2 px-4 border-b">{sanghList.email}</td>
                                    <td className="py-2 px-4 border-b">{sanghList.sangh}</td>
                                    <td className="py-2 px-4 border-b">{sanghList.phone}</td>
                                    <td className="py-2 px-4 border-b flex items-center space-x-4"></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GetSangh;
