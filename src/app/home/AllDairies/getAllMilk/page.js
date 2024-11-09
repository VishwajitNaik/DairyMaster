// pages/MilkRecords.js
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const MilkRecords = () => {
    const [milkRecords, setMilkRecords] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMilkRecords = async () => {
            try {
                const response = await axios.get('/api/sangh/GetOwnerMilk'); // Adjust the endpoint if necessary
                setMilkRecords(response.data.data);
            } catch (err) {
                setError(err.response?.data?.error || 'An error occurred while fetching milk records.');
            } finally {
                setLoading(false);
            }
        };

        fetchMilkRecords();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-5">Milk Records</h1>
            {milkRecords.length === 0 ? (
                <p>No milk records found.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className=" text-black border px-4 py-2">Register No</th>
                            <th className=" text-black border px-4 py-2">Sample No</th>
                            <th className=" text-black border px-4 py-2">Session</th>
                            <th className=" text-black border px-4 py-2">Milk Type</th>
                            <th className=" text-black border px-4 py-2">Quality</th>
                            <th className=" text-black border px-4 py-2">Milk KG</th>
                            <th className=" text-black border px-4 py-2">Fat</th>
                            <th className=" text-black border px-4 py-2">SNF</th>
                            <th className=" text-black border px-4 py-2">Rate</th>
                            <th className=" text-black border px-4 py-2">Amount</th>
                            <th className=" text-black border px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {milkRecords.map((record) => (
                            <tr key={record._id}>
                                <td className=" text-black border px-4 py-2">{record.registerNo}</td>
                                <td className=" text-black border px-4 py-2">{record.sampleNo}</td>
                                <td className=" text-black border px-4 py-2">{record.session}</td>
                                <td className=" text-black border px-4 py-2">{record.milkType}</td>
                                <td className=" text-black border px-4 py-2">{record.quality}</td>
                                <td className=" text-black border px-4 py-2">{record.milkKG}</td>
                                <td className=" text-black border px-4 py-2">{record.fat}</td>
                                <td className=" text-black border px-4 py-2">{record.snf}</td>
                                <td className=" text-black border px-4 py-2">{record.rate}</td>
                                <td className=" text-black border px-4 py-2">{record.amount}</td>
                                <td className=" text-black border px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MilkRecords;
