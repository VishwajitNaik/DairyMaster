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
    const [morningBuffMilk, setMorningBuffMilk] = useState([]);
    const [morningCowMilk, setMorningCowMilk] = useState([]);
    const [eveningBuffMilk, setEveningBuffMilk] = useState([]);
    const [eveningCowMilk, setEveningCowMilk] = useState([]);
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
                const morningBuffMilk = morning.filter((record) => record.milkType === "buff");
                const morningCowMilk = morning.filter((record) => record.milkType === "cow");

                setMorningBuffMilk(morningBuffMilk);
                setMorningCowMilk(morningCowMilk);

                const evening = milkRecords.filter((record) => record.session === "evening");
                const eveningBuffMilk = evening.filter((record) => record.milkType === "buff");
                const eveningCowMilk = evening.filter((record) => record.milkType === "cow");

                setEveningBuffMilk(eveningBuffMilk);
                setEveningCowMilk(eveningCowMilk);
                
    
                setMorningRecords(morning);
                setEveningRecords(evening);
    
                const totalMorning = morning.reduce(
                    (totals, record) => {
                        totals.milkLiter += record.milkLiter || 0; // Ensure this is a number
                        totals.amount += record.amount || 0; // Ensure this is a number
                        return totals;
                    },
                    { milkLiter: 0, amount: 0 }
                );
    
                const totalEvening = evening.reduce(
                    (totals, record) => {
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
                setTotalLiters(totalMorning.milkLiter + totalEvening.milkLiter);
                setTotalRakkam(totalMorning.amount + totalEvening.amount);
            } catch (error) {
                console.error("Error fetching milk records:", error.message);
            }
        }
        fetchMilkRecords();
    }, [id, startDate, endDate]);

    useEffect(() => {
        console.log("Updated Morning Buff Milk State:", morningBuffMilk);
    }, [morningBuffMilk]);
    
    useEffect(() => {
        console.log("Updated Evening Buff Milk State:", eveningBuffMilk);
    }, [eveningBuffMilk]);

    useEffect(() => {
        console.log("Updated Morning Buff Milk State:", eveningCowMilk);
    }, [eveningCowMilk]);
    
    useEffect(() => {
        console.log("Updated Evening Buff Milk State:", eveningCowMilk);
    }, [eveningCowMilk]);
    
    

    const handleDelete = async (recordId) => {
        // Logic to delete the record
        try {
            await axios.delete(`/api/sangh/deleteMilkRecord?id=${recordId}`);
            toast.success('Record deleted successfully!');
            setMorningRecords((prevRecords) => prevRecords.filter((record) => record._id !== recordId));
            setEveningRecords((prevRecords) => prevRecords.filter((record) => record._id !== recordId));
            // Refresh the records after deletion
            fetchMilkRecords();
        } catch (error) {
            console.error("Error deleting record:", error.message);
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
                    <h2 className="font-bold text-blue-900">तारीख निवडा </h2>
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
            <div className="bg-blue-300 p-4 rounded-lg shadow-md" style={{ width: '60%' }}>
            {/* Morning Buffalo Milk Records */}
            <h2 className="text-black font-bold">Morning Buffalo Milk Records</h2>
            {morningBuffMilk.length > 0 ? (
                <>
                    <table className="min-w-full bg-white text-black shadow-md rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">दिनांक</th>
                                <th className="py-2 px-4 border-b">दूध प्रकार</th>
                                <th className="py-2 px-4 border-b">दूध किलो</th>
                                <th className="py-2 px-4 border-b">दूध लिटर </th>
                                <th className="py-2 px-4 border-b">फॅट </th>
                                <th className="py-2 px-4 border-b">रक्कम </th>
                                <th className="py-2 px-4 border-b"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {morningBuffMilk.map((record) => (
                                <tr key={record._id}>
                                    <td className="py-2 px-8 border-b">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-8 border-b">{record.milkType}</td>
                                    <td className="py-2 px-8 border-b">{record.milkKG}</td>
                                    <td className="py-2 px-8 border-b">{record.milkLiter}</td>
                                    <td className="py-2 px-8 border-b">{record.fat}</td>
                                    <td className="py-2 px-8 border-b">{record.amount}</td>
                                    <td className="py-2 px-4 border-b flex space-x-2">
                                        <FontAwesomeIcon icon={faEdit} className="text-yellow-500 cursor-pointer" onClick={() => handleUpdate(record._id)} />
                                        <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => handleDelete(record._id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p className="text-red-500">No morning buffalo records found.</p>
            )}

            {/* Morning Cow Milk Records */}
            <h2 className="text-black font-bold mt-6">Morning Cow Milk Records</h2>
            {morningCowMilk.length > 0 ? (
                <>
                    <table className="min-w-full bg-white text-black shadow-md rounded-lg">
                        <thead>
                            <tr>
                            <th className="py-2 px-4 border-b">दिनांक</th>
                                <th className="py-2 px-4 border-b">दूध प्रकार</th>
                                <th className="py-2 px-4 border-b">दूध किलो</th>
                                <th className="py-2 px-4 border-b">दूध लिटर </th>
                                <th className="py-2 px-4 border-b">फॅट </th>
                                <th className="py-2 px-4 border-b">रक्कम </th>
                                <th className="py-2 px-4 border-b"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {morningCowMilk.map((record) => (
                                <tr key={record._id}>
                                    <td className="py-2 px-8 border-b">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-8 border-b">{record.milkType}</td>
                                    <td className="py-2 px-8 border-b">{record.milkKG}</td>
                                    <td className="py-2 px-8 border-b">{record.milkLiter}</td>
                                    <td className="py-2 px-8 border-b">{record.fat}</td>
                                    <td className="py-2 px-8 border-b">{record.amount}</td>
                                    <td className="py-2 px-4 border-b flex space-x-2">
                                        <FontAwesomeIcon icon={faEdit} className="text-yellow-500 cursor-pointer" onClick={() => handleUpdate(record._id)} />
                                        <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => handleDelete(record._id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p className="text-red-500">No morning cow records found.</p>
            )}

            {/* Evening Buffalo Milk Records */}
            <h2 className="text-black font-bold mt-6">Evening Buffalo Milk Records</h2>
            {eveningBuffMilk.length > 0 ? (
                <>
                    <table className="min-w-full bg-gray-100 text-black shadow-md rounded-lg">
                        <thead>
                            <tr>
                            <th className="py-2 px-4 border-b">दिनांक</th>
                                <th className="py-2 px-4 border-b">दूध प्रकार</th>
                                <th className="py-2 px-4 border-b">दूध किलो</th>
                                <th className="py-2 px-4 border-b">दूध लिटर </th>
                                <th className="py-2 px-4 border-b">फॅट </th>
                                <th className="py-2 px-4 border-b">रक्कम </th>
                                <th className="py-2 px-4 border-b"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {eveningBuffMilk.map((record) => (
                                <tr key={record._id}>
                                    <td className="py-2 px-8 border-b">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-8 border-b">{record.milkType}</td>
                                    <td className="py-2 px-8 border-b">{record.milkKG}</td>
                                    <td className="py-2 px-8 border-b">{record.milkLiter}</td>
                                    <td className="py-2 px-8 border-b">{record.fat}</td>
                                    <td className="py-2 px-8 border-b">{record.amount}</td>
                                    <td className="py-2 px-4 border-b flex space-x-2">
                                        <FontAwesomeIcon icon={faEdit} className="text-yellow-500 cursor-pointer" onClick={() => handleUpdate(record._id)} />
                                        <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => handleDelete(record._id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p className="text-red-500">No evening buffalo records found.</p>
            )}

            {/* Evening Cow Milk Records */}
            <h2 className="text-black font-bold mt-6">Evening Cow Milk Records</h2>
            {eveningCowMilk.length > 0 ? (
                <>
                    <table className="min-w-full bg-gray-100 text-black shadow-md rounded-lg">
                        <thead>
                            <tr>
                            <th className="py-2 px-4 border-b">दिनांक</th>
                                <th className="py-2 px-4 border-b">दूध प्रकार</th>
                                <th className="py-2 px-4 border-b">दूध किलो</th>
                                <th className="py-2 px-4 border-b">दूध लिटर </th>
                                <th className="py-2 px-4 border-b">फॅट </th>
                                <th className="py-2 px-4 border-b">रक्कम </th>
                                <th className="py-2 px-4 border-b"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {eveningCowMilk.map((record) => (
                                <tr key={record._id}>
                                    <td className="py-2 px-8 border-b">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-8 border-b">{record.milkType}</td>
                                    <td className="py-2 px-8 border-b">{record.milkKG}</td>
                                    <td className="py-2 px-8 border-b">{record.milkLiter}</td>
                                    <td className="py-2 px-8 border-b">{record.fat}</td>
                                    <td className="py-2 px-8 border-b">{record.amount}</td>
                                    <td className="py-2 px-4 border-b flex space-x-2">
                                        <FontAwesomeIcon icon={faEdit} className="text-yellow-500 cursor-pointer" onClick={() => handleUpdate(record._id)} />
                                        <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => handleDelete(record._id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p className="text-red-500">No evening cow records found.</p>
            )}
        </div>
        </div>
    );
}
