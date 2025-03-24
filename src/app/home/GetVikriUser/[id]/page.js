"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast as Toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserMilkDetails() {
    const { id } = useParams(); // Get user ID from URL
    const [milkData, setMilkData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [user, setUser] = useState(null); // State for user details
    const [liter, setLiter] = useState(0);
    const [rakkam, setRakkam] = useState(0);

    // ✅ Wrap fetchData in useCallback to fix dependency issue
    const fetchData = useCallback(async () => {
        try {
            const params = { singleMilk: id };
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await axios.get(`/api/user/getVikriMilk`, { params });
            setMilkData(response.data.data);
            setLiter(response.data.totalLiter);
            setRakkam(response.data.totalRakkam);
        } catch (error) {
            console.error("Failed to fetch milk data:", error);
            Toast.error("Failed to fetch milk data");
        }
    }, [id, startDate, endDate]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await axios.get(`/api/user/GetVikriUser/${id}`);
                setUser(res.data.data);
                fetchData(); // Fetch milk data after user data is fetched
            } catch (error) {
                console.error('Error fetching user details:', error.message);
                Toast.error('Failed to fetch user details');
            }
        };

        if (id) fetchUserDetails();
    }, [id, fetchData]);

    return (
        <div className="gradient-bg flex flex-col min-h-screen mx-auto p-4">

            {/* ✅ Display User Info */}
            {user && (
                <div className="mb-4 p-4 text-black bg-gray-100 rounded-md border">
                    <p><strong>विक्रेता नाव :</strong> {user.name || "N/A"}</p>
                    <p><strong>दूध प्रकार :</strong> {user.milk || "N/A"}</p>
                </div>
            )}

{/* ✅ Date Range Filter */}
<div className="flex flex-col sm:flex-row items-center mb-4 gap-4 w-full">
    <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="text-black border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto"
    />
    <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="text-black border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto"
    />
    <button
        onClick={fetchData}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
    >
        पहा
    </button>
</div>


            {/* ✅ Milk Data Table */}
            {milkData.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border text-black border-gray-300 px-4 py-2 text-left">दिनांक</th>
                                <th className="border text-black border-gray-300 px-4 py-2 text-left">सत्र</th>
                                <th className="border text-black border-gray-300 px-4 py-2 text-left">दूध प्रकार </th>
                                <th className="border text-black border-gray-300 px-4 py-2 text-left">लिटर </th>
                                <th className="border text-black border-gray-300 px-4 py-2 text-left">दर </th>
                                <th className="border text-black border-gray-300 px-4 py-2 text-left">रक्कम</th>
                            </tr>
                        </thead>
                        <tbody>
                            {milkData.map((milk) => (
                                <tr key={milk._id} className="hover:bg-gray-300 bg-gray-200">
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {milk.date ? new Date(milk.date).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {milk.session === "morning"
                                            ? "सकाळ"
                                            : milk.session === "evening"
                                                ? "संध्याकाळ"
                                                : "N/A"}
                                    </td>
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {milk.milk || "N/A"}
                                    </td>
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {milk.liter !== undefined ? milk.liter : "N/A"}
                                    </td>
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {milk.dar !== undefined ? milk.dar : "N/A"}
                                    </td>
                                    <td className="border text-black border-gray-300 px-4 py-2">
                                        {milk.rakkam !== undefined ? `${milk.rakkam}` : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {/* ✅ Add Total Row */}
                        <tfoot>
                            <tr className="bg-gray-300 font-bold">
                                <td className="text-black border border-gray-300 px-4 py-2" colSpan="3">
                                    एकूण 
                                </td>
                                <td className="text-black border border-gray-300 px-4 py-2" colSpan="2">
                                    {liter !== undefined ? Number(liter || 0).toFixed(2) : "N/A"}
                                </td>
                                <td className="text-black border border-gray-300 px-4 py-2">
                                    {rakkam !== undefined ? `₹${Number(rakkam || 0).toFixed(2)}` : "N/A"}
                                </td>

                            </tr>
                        </tfoot>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">या दिनांकमध्ये दूध नाही</p>
            )}

            <ToastContainer />
        </div>
    );
}
