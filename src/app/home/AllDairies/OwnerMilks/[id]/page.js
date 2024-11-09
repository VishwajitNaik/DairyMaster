"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

export default function OwnerMilkDetails() {
    const { id } = useParams();
    const [owner, setOwner] = useState({});
    const [morningRecords, setMorningRecords] = useState([]);
    const [eveningRecords, setEveningRecords] = useState([]);
    const [totalMorningLiters, setTotalMorningLiters] = useState(0);
    const [totalMorningRakkam, setTotalMorningRakkam] = useState(0);
    const [totalEveningLiters, setTotalEveningLiters] = useState(0);
    const [totalEveningRakkam, setTotalEveningRakkam] = useState(0);
    const [totalLiters, setTotalLiters] = useState(0);
    const [totalRakkam, setTotalRakkam] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        async function fetchOwnerDetails() {
            try {
                const res = await axios.get(`/api/owner/getOwners/${id}`);
                setOwner(res.data.data);
            } catch (error) {
                console.error("Error fetching owner details:", error.message);
            }
        }
        fetchOwnerDetails();
    }, [id]);

    useEffect(() => {
        async function fetchMilkRecords() {
            try {
                const res = await axios.get(`/api/sangh/OwnerWiseMilk`, {
                    params: {
                        ownerId: id,
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                    },
                });
                const milkRecords = res.data.data;
    
                console.log("Fetched milk records:", milkRecords); // Debugging line
    
                const morning = milkRecords.filter((record) => record.session === "morning");
                const evening = milkRecords.filter((record) => record.session === "evening");
    
                console.log("Morning Records:", morning); // Debugging line
                console.log("Evening Records:", evening); // Debugging line
    
                setMorningRecords(morning);
                setEveningRecords(evening);
    
                const totalMorning = morning.reduce(
                    (totals, record) => {
                        console.log("Record during morning reduction:", record); // Debugging line
                        totals.milkLiter += record.milkLiter || 0; // Ensure this is a number
                        totals.amount += record.amount || 0; // Ensure this is a number
                        return totals;
                    },
                    { milkLiter: 0, amount: 0 }
                );
    
                const totalEvening = evening.reduce(
                    (totals, record) => {
                        console.log("Record during evening reduction:", record); // Debugging line
                        totals.liters += record.liters || 0; // Ensure this is a number
                        totals.amount += record.amount || 0; // Ensure this is a number
                        return totals;
                    },
                    { liters: 0, amount: 0 }
                );
    
                console.log("Total Morning:", totalMorning); // Debugging line
                console.log("Total Evening:", totalEvening); // Debugging line
    
                setTotalMorningLiters(totalMorning.milkLiter);
                setTotalMorningRakkam(totalMorning.amount);
                setTotalEveningLiters(totalEvening.milkLiter);
                setTotalEveningRakkam(totalEvening.amount);
                setTotalLiters(totalMorning.milkLiter + totalEvening.liters);
                setTotalRakkam(totalMorning.amount + totalEvening.amount);
            } catch (error) {
                console.error("Error fetching milk records:", error.message);
            }
        }
        fetchMilkRecords();
    }, [id, startDate, endDate]);
    

    const handleDelete = async (recordId) => {
        // Logic to delete the record
        try {
            await axios.delete(`/api/sangh/deleteMilkRecord/${recordId}`);
            toast.success('Record deleted successfully!');
            // Refresh the records after deletion
            fetchMilkRecords();
        } catch (error) {
            toast.error('Failed to delete record.');
        }
    };

    const handleUpdate = (recordId) => {
        // Logic to handle the update
        // This can redirect to the edit page for the record
    };

    return (
        <div className="gradient-bg flex flex-col items-center justify-center min-h-screen">
            <ToastContainer />
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4">Owner Milk Details</h1>
                <Link href={`/home/AllDairies/OwnerMilks/${id}/add`} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Add Milk Record</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white text-black shadow-md rounded-lg p-4 mb-4 flex items-center">
                    <Image
                        src="/assets/avatar.jpg" 
                        alt={owner.ownerName}
                        width={100}
                        height={100}
                        className="w-20 h-20 rounded-full mr-4"
                    />
                <div>
                    <p className="text-black"><strong>Name:</strong> {owner.ownerName}</p>
                    <p className="text-black"><strong>Register No:</strong> {owner.registerNo}</p>
                </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="font-bold">Select Date Range</h2>
                    <DatePicker 
                        selected={startDate} 
                        onChange={date => setStartDate(date)} 
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="text-black border rounded p-2"
                        dateFormat="yyyy/MM/dd"
                    />
                    <DatePicker 
                        selected={endDate} 
                        onChange={date => setEndDate(date)} 
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        className="text-black border rounded p-2"
                        dateFormat="yyyy/MM/dd"
                    />
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-black font-bold">Morning Milk Records</h2>
                {morningRecords.length > 0 ? (
                    <>
                        <table className="min-w-full bg-white text-black shadow-md rounded-lg">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Date</th>
                                    <th className="py-2 px-4 border-b">Milk KG</th>
                                    <th className="py-2 px-4 border-b">Milk Liter</th>
                                    <th className="py-2 px-4 border-b">Fat</th>
                                    <th className="py-2 px-4 border-b">Rakkam</th>
                                    <th className="py-2 px-4 border-b">senedCen</th>
                                    <th className="py-2 px-4 border-b">acceptedCen</th>
                                    <th className="py-2 px-4 border-b">smeledCen</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {morningRecords.map((record) => (
                                    <tr key={record._id}>
                                        <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b">{record.milkKG}</td>
                                        <td className="py-2 px-4 border-b">{record.milkLiter}</td>
                                        <td className="py-2 px-4 border-b">{record.fat}</td>
                                        <td className="py-2 px-4 border-b">{record.amount}</td>
                                        <td className="py-2 px-4 border-b">{record.senedCen}</td>
                                        <td className="py-2 px-4 border-b">{record.acceptedCen}</td>
                                        <td className="py-2 px-4 border-b">{record.smeledCen}</td>
                                        
                                        <td className="py-2 px-4 border-b flex space-x-2">
                                            <FontAwesomeIcon icon={faEdit} className="text-yellow-500 cursor-pointer" onClick={() => handleUpdate(record._id)} />
                                            <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => handleDelete(record._id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4">
                            <h3 className="text-black font-bold">Total Morning Liters: {totalMorningLiters}</h3>
                            <h3 className="text-black font-bold">Total Morning Rakkam: {totalMorningRakkam}</h3>
                        </div>
                    </>
                ) : (
                    <p className="text-red-500">No morning records found.</p>
                )}

                <h2 className="text-black font-bold">Evening Milk Records</h2>
                {eveningRecords.length > 0 ? (
                    <>
                        <table className="min-w-full bg-white text-black shadow-md rounded-lg mt-4">
                            <thead>
                                <tr>
                                <th className="py-2 px-4 border-b">Date</th>
                                    <th className="py-2 px-4 border-b">Milk KG</th>
                                    <th className="py-2 px-4 border-b">Milk Liter</th>
                                    <th className="py-2 px-4 border-b">Fat</th>
                                    <th className="py-2 px-4 border-b">Rakkam</th>
                                    <th className="py-2 px-4 border-b">senedCen</th>
                                    <th className="py-2 px-4 border-b">acceptedCen</th>
                                    <th className="py-2 px-4 border-b">smeledCen</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eveningRecords.map((record) => (
                                    <tr key={record._id}>
                                    <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b">{record.milkKG}</td>
                                        <td className="py-2 px-4 border-b">{record.milkLiter}</td>
                                        <td className="py-2 px-4 border-b">{record.fat}</td>
                                        <td className="py-2 px-4 border-b">{record.amount}</td>
                                        <td className="py-2 px-4 border-b">{record.senedCen}</td>
                                        <td className="py-2 px-4 border-b">{record.acceptedCen}</td>
                                        <td className="py-2 px-4 border-b">{record.smeledCen}</td>
                                        <td className="text-black py-2 px-4 border-b flex space-x-2">
                                            <FontAwesomeIcon icon={faEdit} className="text-yellow-500 cursor-pointer" onClick={() => handleUpdate(record._id)} />
                                            <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => handleDelete(record._id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4">
                            <h3 className="text-black font-bold">Total Evening Liters: {totalEveningLiters}</h3>
                            <h3 className="text-black font-bold">Total Evening Rakkam: {totalEveningRakkam}</h3>
                        </div>
                    </>
                ) : (
                    <p className="text-red-500">No evening records found.</p>
                )}
            </div>
            <div className="mt-6">
                <h3 className="text-black font-bold">Overall Total Liters: {totalLiters}</h3>
                <h3 className="text-black font-bold">Overall Total Rakkam: {totalRakkam}</h3>
            </div>
        </div>
    );
}
