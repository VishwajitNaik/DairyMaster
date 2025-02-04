"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../../components/Loading/Loading"

const Page = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/billkapat/userSavedBills"); // Adjust API if needed
                setBills(response.data.UserBills); // Ensure correct API response mapping
                setLoading(false);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, []);

    return (
        <div className="gradient-bg flex flex-col min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">बिल यादी</h1>
    
        {loading && <p><Loading /></p>}
        {error && <p className="text-red-500">{error}</p>}
    
        {!loading && !error && bills.length === 0 && <p>कोणतेही बिल्स आढळले नाहीत.</p>}
    
        {!loading && !error && bills.length > 0 && (
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-300 w-full min-w-[600px] md:min-w-full bg-gray-200 rounded-md shadow-md hover:shadow-gray-600 shadow-gray-500">
                    <thead>
                        <tr className="bg-gray-500 text-xs sm:text-sm md:text-base">
                            <th className="text-white border border-gray-200 px-2 sm:px-4 py-2 whitespace-nowrap">
                                बिलाची सुरुवात तारीख
                            </th>
                            <th className="text-white border border-gray-200 px-2 sm:px-4 py-2 whitespace-nowrap">
                                रजिस्टर नं.
                            </th>
                            <th className="text-white border border-gray-200 px-2 sm:px-4 py-2 whitespace-nowrap">
                                एकूण लिटर
                            </th>
                            <th className="text-white border border-gray-200 px-2 sm:px-4 py-2 whitespace-nowrap">
                                एकूण रक्कम
                            </th>
                            <th className="text-white border border-gray-200 px-2 sm:px-4 py-2 whitespace-nowrap">
                                स्थिर कपात
                            </th>
                            <th className="text-white border border-gray-200 px-2 sm:px-4 py-2 whitespace-nowrap">
                                पशूखाद्य
                            </th>
                            <th className="text-white border border-gray-200 px-2 sm:px-4 py-2 whitespace-nowrap">
                                निव्वळ अदा
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill, index) => (
                            <tr key={index} className="even:bg-gray-50 hover:bg-gray-100 text-xs sm:text-sm md:text-base">
                                <td className="text-black border border-gray-500 px-2 sm:px-4 py-2 font-semibold text-center whitespace-nowrap">
                                    {bill.startDate ? new Date(bill.startDate).toLocaleDateString() : "N/A"}
                                    <span className="mx-2">ते</span>
                                    {bill.endDate ? new Date(bill.endDate).toLocaleDateString() : "N/A"}
                                </td>
                                <td className="text-black border border-gray-500 px-2 sm:px-4 py-2 whitespace-nowrap">{bill.registerNo}</td>
                                <td className="text-black border border-gray-500 px-2 sm:px-4 py-2 whitespace-nowrap">{bill.totalLiters}</td>
                                <td className="text-black border border-gray-500 px-2 sm:px-4 py-2 whitespace-nowrap">{bill.totalRakkam}</td>
                                <td className="text-black border border-gray-500 px-2 sm:px-4 py-2 whitespace-nowrap">
                                    {bill.totalKapatRateMultiplybyTotalLiter?.toFixed(2) || "0.00"}
                                </td>
                                <td className="text-black border border-gray-500 px-2 sm:px-4 py-2 whitespace-nowrap">
                                    {bill.totalBillKapat?.toFixed(2) || "0.00"}
                                </td>
                                <td className="text-black border border-gray-500 px-2 sm:px-4 py-2 whitespace-nowrap">
                                    {bill.netPayment?.toFixed(2) || "0.00"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
    
    );
};

export default Page;
