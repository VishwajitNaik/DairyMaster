"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TodayMilkRecords() {
  const [milkRecords, setMilkRecords] = useState([]);
  const [cowMilkRecords, setCowMilkRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalLiter, setTotalLiter] = useState(0);
  const [avgFat, setAvgFat] = useState(0);
  const [avgSnf, setAvgSnf] = useState(0);
  const [avgRate, setAvgRate] = useState(0);
  const [totalRakkam, setTotalRakkam] = useState(0);
  const [totalLiterCow, setTotalLiterCow] = useState(0);
  const [avgFatCow, setAvgFatCow] = useState(0);
  const [avgSnfCow, setAvgSnfCow] = useState(0);
  const [avgRateCow, setAvgRateCow] = useState(0);
  const [totalRakkamCow, setTotalRakkamCow] = useState(0);
  const [session, setSession] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640); // Set breakpoint for mobile view (640px and below)
    };

    handleResize(); // Check initially
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchTodayMilkRecords() {
      try {
        const response = await axios.get("/api/milk/getSessionMilk");

        if (response.data && Array.isArray(response.data.milkRecords)) {
          const buffaloRecords = response.data.milkRecords.filter(record => record.milk === "म्हैस ");
          const cowRecords = response.data.milkRecords.filter(record => record.milk === "गाय ");
          const session = response.data.milkRecords[0].session;

          setSession(session);
          setMilkRecords(buffaloRecords);
          setCowMilkRecords(cowRecords);
          
          if (buffaloRecords.length > 0) {
            const totalLiter = buffaloRecords.reduce((sum, record) => sum + record.liter, 0);
            const avgFat = buffaloRecords.reduce((sum, record) => sum + record.fat, 0) / buffaloRecords.length;
            const avgSnf = buffaloRecords.reduce((sum, record) => sum + record.snf, 0) / buffaloRecords.length;
            const avgRate = buffaloRecords.reduce((sum, record) => sum + record.dar, 0) / buffaloRecords.length;
            const totalRakkam = buffaloRecords.reduce((sum, record) => sum + record.rakkam, 0);

            setTotalLiter(totalLiter.toFixed(2));
            setAvgFat(avgFat.toFixed(2));
            setAvgSnf(avgSnf.toFixed(2));
            setAvgRate(avgRate.toFixed(2));
            setTotalRakkam(totalRakkam.toFixed(2));
          }

          if (cowRecords.length > 0) {
            const totalLiterCow = cowRecords.reduce((sum, record) => sum + record.liter, 0);
            const avgFatCow = cowRecords.reduce((sum, record) => sum + record.fat, 0) / cowRecords.length;
            const avgSnfCow = cowRecords.reduce((sum, record) => sum + record.snf, 0) / cowRecords.length;
            const avgRateCow = cowRecords.reduce((sum, record) => sum + record.dar, 0) / cowRecords.length;
            const totalRakkamCow = cowRecords.reduce((sum, record) => sum + record.rakkam, 0);

            setTotalLiterCow(totalLiterCow.toFixed(2));
            setAvgFatCow(avgFatCow.toFixed(2));
            setAvgSnfCow(avgSnfCow.toFixed(2));
            setAvgRateCow(avgRateCow.toFixed(2));
            setTotalRakkamCow(totalRakkamCow.toFixed(2));
          }
        } else {
          setError("Unexpected response format.");
        }
      } catch (err) {
        setError("Failed fetch today's milk records.");
        console.error("Error fetching today's milk records:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTodayMilkRecords();
  }, []);

  if (loading) {
    return <div className="text-center mt-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-6">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-6">
    <h1 className="text-4xl font-bold text-center mb-6">आजचे दूध</h1>

    {/* Buffalo Milk Table */}
    <h2 className="text-2xl font-semibold bg-gray-200 py-2 px-4 w-fit rounded-lg shadow-md shadow-black text-gray-600 mb-4">
      म्हैस दूध
    </h2>
    <div className="overflow-x-auto mb-6 rounded-md shadow-md shadow-black">
      {isMobile ? (
        // Mobile view small table
        <table className="min-w-full bg-white border border-gray-200 text-sm rounded-md shadow-md shadow-black">
          <thead className="bg-gray-200 shadow-md shadow-black">
            <tr>
              <th className="text-black py-1 px-2 border-b">राजिस्टर नं.</th>
              <th className="text-black py-1 px-2 border-b">लिटर</th>
              <th className="text-black py-1 px-2 border-b">फॅट</th>
              <th className="text-black py-1 px-2 border-b">रक्कम</th>
            </tr>
          </thead>
          <tbody>
            {milkRecords.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-black py-2 px-4 border-b text-center">
                  आज एक ही दूध लिस्ट उपलब्ध नाही.
                </td>
              </tr>
            ) : (
              milkRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="text-black py-1 px-2 border-b">{record.registerNo}</td>
                  <td className="text-black py-1 px-2 border-b">{record.liter}</td>
                  <td className="text-black py-1 px-2 border-b">{record.fat}</td>
                  <td className="text-black py-1 px-2 border-b">{record.rakkam}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        // Desktop view full table
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md shadow-black">
          <thead className="bg-gray-200 shadow-md shadow-black">
            <tr>
              <th className="text-black py-2 px-4 border border-gray-400">राजिस्टर नं.</th>
              <th className="text-black py-2 px-4 border border-gray-400">लिटर</th>
              <th className="text-black py-2 px-4 border border-gray-400">फॅट</th>
              <th className="text-black py-2 px-4 border border-gray-400">एसन्फ</th>
              <th className="text-black py-2 px-4 border border-gray-400">दर</th>
              <th className="text-black py-2 px-4 border border-gray-400">एकूण रक्कम</th>
            </tr>
          </thead>
          <tbody>
            {milkRecords.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-black py-2 px-4 border-b text-center">
                  आज एक ही दूध लिस्ट उपलब्ध नाही.
                </td>
              </tr>
            ) : (
              milkRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-100 text-center">
                  <td className="text-black py-2 px-4 border border-gray-400">{record.registerNo}</td>
                  <td className="text-black py-2 px-4 border border-gray-400">{record.liter}</td>
                  <td className="text-black py-2 px-4 border border-gray-400">{record.fat}</td>
                  <td className="text-black py-2 px-4 border border-gray-400">{record.snf}</td>
                  <td className="text-black py-2 px-4 border border-gray-400">{record.dar}</td>
                  <td className="text-black py-2 px-4 border border-gray-400">{record.rakkam}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>

    {/* Cow Milk Table */}
    <h2 className="text-2xl font-semibold bg-gray-200 py-2 px-4 w-fit rounded-lg shadow-md shadow-black text-gray-600 mb-4">
      गाईचे दूध
    </h2>
    <div className="overflow-x-auto mb-6 rounded-md shadow-md shadow-black">
      {isMobile ? (
        // Mobile view small table
        <table className="min-w-full bg-white border border-gray-200 text-sm rounded-md shadow-md shadow-black">
          <thead className="bg-gray-200 shadow-md shadow-black">
            <tr>
              <th className="text-black py-1 px-2 border-b">राजिस्टर नं.</th>
              <th className="text-black py-1 px-2 border-b">लिटर</th>
              <th className="text-black py-1 px-2 border-b">फॅट</th>
              <th className="text-black py-1 px-2 border-b">रक्कम</th>
            </tr>
          </thead>
          <tbody>
            {cowMilkRecords.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-black py-2 px-4 border-b text-center">
                  आज एक ही दूध लिस्ट उपलब्ध नाही.
                </td>
              </tr>
            ) : (
              cowMilkRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="text-black py-1 px-2 border-b">{record.registerNo}</td>
                  <td className="text-black py-1 px-2 border-b">{record.liter}</td>
                  <td className="text-black py-1 px-2 border-b">{record.fat}</td>
                  <td className="text-black py-1 px-2 border-b">{record.rakkam}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        // Desktop view full table
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md shadow-black">
          <thead className="bg-gray-200 shadow-md shadow-black">
            <tr>
              <th className="text-black py-2 px-4 border border-gray-400">राजिस्टर नं.</th>
              <th className="text-black py-2 px-4 border border-gray-400">लिटर</th>
              <th className="text-black py-2 px-4 border border-gray-400">फॅट</th>
              <th className="text-black py-2 px-4 border border-gray-400">एसन्फ</th>
              <th className="text-black py-2 px-4 border border-gray-400">दर</th>
              <th className="text-black py-2 px-4 border border-gray-400">एकूण रक्कम</th>
            </tr>
          </thead>
          <tbody>
            {cowMilkRecords.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-black py-2 px-4 border-b text-center">
                  आज एक ही दूध लिस्ट उपलब्ध नाही.
                </td>
              </tr>
            ) : (
              cowMilkRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-100 text-center">
                  <td className="text-black py-2 px-4 border border-gray-400">{record.registerNo}</td>
                  <td className="text-black py-2 px-4 border border-gray-400">{record.liter}</td>
                  <td className="text-black py-2 px-4 border border-gray-400">{record.fat}</td>
                  <td className="text-black py-2 px-4 border border-gray-400">{record.snf}</td>
                  <td className="text-black py-2 px-4 border border-gray-400">{record.dar}</td>
                  <td className="text-black py-2 px-4 border border-gray-400">{record.rakkam}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  </div>
  );
}
