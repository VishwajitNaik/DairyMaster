"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import bgImage from "/public/assets/Docter.jpeg"; // Replace with your actual background image path

const GetDocterVisit = () => {
    const [doctors, setDoctors] = useState([]);
    const [decisesList, setDecisesList] = useState([]);
    const [animalTypes] = useState(["गाय", "म्हैस", "शेळी", "मेंढी"]);
    const [username, setUsername] = useState("");
    const [decises, setDecises] = useState("");
    const [animalType, setAnimalType] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                const res = await axios.get("/api/user/getUsers");
                setDoctors(res.data.data.users);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch users:", error.message);
                setError("Failed to fetch users");
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    useEffect(() => {
        async function fetchDecises() {
            try {
                const res = await axios.get("/api/Docter/getDeciesOwnerSide");
                if (res.status === 200) {
                    setDecisesList(res.data.data);
                } else {
                    setError(res.data.message || "Failed to fetch diseases");
                }
            } catch (error) {
                console.error("Failed to fetch diseases:", error.message);
                setError("Failed to fetch diseases");
            }
        }
        fetchDecises();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { 
            username, 
            Decises: decises, 
            AnimalType: animalType,
            date: Date.now() 
        };

        try {
            const res = await axios.post("/api/Docter/GetDocterVisit", payload);
            toast.success(res.data.message || "Doctor Visit recorded successfully!");
            setUsername("");
            setDecises("");
            setAnimalType("");
        } catch (error) {
            console.error("Error storing visit information:", error.message);
            toast.error(error.response?.data?.error || "Failed to store visit information");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Background Image */}
            <Image
                src={bgImage}
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="absolute z-0"
            />

            {/* Form Container */}
            <div className="relative z-10 bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-lg w-full mx-auto mt-12">
                <ToastContainer />
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Doctor Visit</h1>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Selection */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            उत्पादक 
                        </label>
                        <select
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full text-black p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">उत्पादकाचे नाव </option>
                            {doctors.map((doctor) => (
                                <option key={doctor._id} value={doctor.name}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Disease Selection */}
                    <div>
                        <label htmlFor="decises" className="block text-sm font-medium text-gray-700">
                            आजाराचा प्रकार 
                        </label>
                        <select
                            id="decises"
                            name="decises"
                            value={decises}
                            onChange={(e) => setDecises(e.target.value)}
                            className="w-full text-black p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">आजाराचा प्रकार</option>
                            {decisesList.map((disease) => (
                                <option key={disease._id} value={disease.Decieses}>
                                    {disease.Decieses}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Animal Type Selection */}
                    <div>
                        <label htmlFor="animalType" className="block text-sm font-medium text-gray-700">
                            जनावर प्रकार
                        </label>
                        <select
                            id="animalType"
                            name="animalType"
                            value={animalType}
                            onChange={(e) => setAnimalType(e.target.value)}
                            className="w-full text-black p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">जनावर प्रकार </option>
                            {animalTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full text-white p-3 bg-blue-500 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GetDocterVisit;
