"use client";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";

const AggregateUserTotals = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userTotals, setUserTotals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [milkRecords, setMilkRecords] = useState([]);
  const [summary, setSummary] = useState({});

  const fetchMilkRecords = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/milk/getOwnerAllMilk", {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });
      setMilkRecords(response.data.data);
      console.log("Milk Records:", response.data.data);

      // Calculate summary
      calculateSummary(response.data.data);
    } catch (err) {
      setError("Failed to fetch milk records.");
      console.error("Error fetching milk records:", err.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchMilkRecords();
  }, [fetchMilkRecords]);

  const calculateSummary = (records) => {
    const summaryData = { म्हैस: {}, गाय: {} };

    ["म्हैस", "गाय"].forEach((type) => {
      const filteredRecords = records.filter(record => record.milk.trim() === type);

      // Total Liter and Rakkam by Time (Morning and Evening)
      const morningRecords = filteredRecords.filter(record => record.greetings === "Morning");
      const eveningRecords = filteredRecords.filter(record => record.greetings === "Evening");

      const totalMorningLiter = morningRecords.reduce((total, record) => total + (parseFloat(record.liter) || 0), 0);
      const totalMorningRakkam = morningRecords.reduce((total, record) => total + (parseFloat(record.rakkam) || 0), 0);

      const totalEveningLiter = eveningRecords.reduce((total, record) => total + (parseFloat(record.liter) || 0), 0);
      const totalEveningRakkam = eveningRecords.reduce((total, record) => total + (parseFloat(record.rakkam) || 0), 0);

      // Total Liter, Fat, SNF, Rate, and Rakkam
      const totalLiter = filteredRecords.reduce((total, record) => total + (parseFloat(record.liter) || 0), 0);
      const totalFat = filteredRecords.reduce((total, record) => total + (parseFloat(record.fat) || 0), 0);
      const totalSnf = filteredRecords.reduce((total, record) => total + (parseFloat(record.snf) || 0), 0);
      const totalRate = filteredRecords.reduce((total, record) => total + (parseFloat(record.dar) || 0), 0);
      const totalRakkam = filteredRecords.reduce((total, record) => total + (parseFloat(record.rakkam) || 0), 0);

      // Averages
      const avgFat = filteredRecords.length > 0 ? totalFat / filteredRecords.length : 0;
      const avgSnf = filteredRecords.length > 0 ? totalSnf / filteredRecords.length : 0;
      const avgRate = filteredRecords.length > 0 ? totalRate / filteredRecords.length : 0;

      summaryData[type] = {
        totalLiter,
        avgFat,
        avgSnf,
        avgRate,
        totalRakkam,
        totalMorningLiter,
        totalMorningRakkam,
        totalEveningLiter,
        totalEveningRakkam,
      };
    });

    setSummary(summaryData);
  };

  const handleFetchTotals = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/orders/aggregateUserTotals", {
        startDate,
        endDate,
      });

      setUserTotals(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.error || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContents = document.getElementById("summary-section").innerHTML;
    const newWindow = window.open();
    newWindow.document.write(`<html><body>${printContents}</body></html>`);
    newWindow.document.close();
    newWindow.print();
  };

  // Calculate totals for all users
  const totalRakkam = userTotals.reduce((sum, user) => sum + user.totalRakkam, 0);
  const totalBillKapat = userTotals.reduce((sum, user) => sum + user.totalBillKapat, 0);
  const totalAdvance = userTotals.reduce((sum, user) => sum + user.totalAdvance, 0);
  const totalNetPayment = userTotals.reduce((sum, user) => sum + user.netPayment, 0);
  const difference = ((summary["म्हैस"]?.totalRakkam || 0) + (summary["गाय"]?.totalRakkam || 0)) - totalBillKapat;

  return (
<div className="p-6 max-w-4xl mx-auto">
  <h1 className="text-2xl font-bold mb-4">Aggregate User Totals</h1>

  <div className="mb-4 flex gap-4">
    <div>
      <label htmlFor="startDate" className=" text-black block text-sm font-medium mb-1">
        Start Date
      </label>
      <input
        type="date"
        id="startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="text-black border rounded-md p-2 w-full"
      />
    </div>
    <div>
      <label htmlFor="endDate" className="text-black block text-sm font-medium mb-1">
        End Date
      </label>
      <input
        type="date"
        id="endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="text-black border rounded-md p-2 w-full"
      />
    </div>
  </div>

  <button
    onClick={handleFetchTotals}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    disabled={loading}
  >
    {loading ? "Loading..." : "Fetch Totals"}
  </button>
  <div className="mt-4 text-red-500">
    {error && <p>{error}</p>}
  </div>

  <div className="mt-6">
    <h2 className="text-xl font-semibold mb-2">Results:</h2>
    <div className="border p-2 bg-white text-black">
      <p>Total</p>
      <p>{totalRakkam.toFixed(2)}</p>
      <p>{totalBillKapat.toFixed(2)}</p>
      <p>{totalAdvance.toFixed(2)}</p>
      <p>{totalNetPayment.toFixed(2)}</p>
    </div>

    {/* Summary Section */}
    {!loading && !error && (
      <div id="summary-section" className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <table className="table-auto border-collapse border border-gray-300 w-full text-center bg-white text-black">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">म्हैस</th>
              <th className="border border-gray-300 px-4 py-2">गाय</th>
              <th className="border border-gray-300 px-4 py-2">Total Liter (गाय + म्हैस)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Total Liter</td>
              <td className="border border-gray-300 px-4 py-2">{summary["म्हैस"]?.totalLiter || 0}</td>
              <td className="border border-gray-300 px-4 py-2">{summary["गाय"]?.totalLiter || 0}</td>
              <td className="border border-gray-300 px-4 py-2">
                {(summary["म्हैस"]?.totalLiter || 0) + (summary["गाय"]?.totalLiter || 0)}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Average Fat</td>
              <td className="border border-gray-300 px-4 py-2">{summary["म्हैस"]?.avgFat.toFixed(2) || 0}</td>
              <td className="border border-gray-300 px-4 py-2">{summary["गाय"]?.avgFat.toFixed(2) || 0}</td>
              <td className="border border-gray-300 px-4 py-2">-</td> {/* No calculation for Average Fat in combined column */}
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Average SNF</td>
              <td className="border border-gray-300 px-4 py-2">{summary["म्हैस"]?.avgSnf.toFixed(2) || 0}</td>
              <td className="border border-gray-300 px-4 py-2">{summary["गाय"]?.avgSnf.toFixed(2) || 0}</td>
              <td className="border border-gray-300 px-4 py-2">-</td> {/* No calculation for Average SNF in combined column */}
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Total Rakkam</td>
              <td className="border border-gray-300 px-4 py-2">{summary["म्हैस"]?.totalRakkam.toFixed(2) || 0}</td>
              <td className="border border-gray-300 px-4 py-2">{summary["गाय"]?.totalRakkam.toFixed(2) || 0}</td>
              <td className="border border-gray-300 px-4 py-2">{(summary["म्हैस"]?.totalRakkam || 0) + (summary["गाय"]?.totalRakkam || 0)}</td> {/* No combined calculation for Rakkam */}
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Total Bill Kapat</td>
              <td className="border border-gray-300 px-4 py-2" colSpan="2">
                
              </td>
              <td className="border border-gray-300 px-4 py-2">{totalBillKapat.toFixed(2)}</td> {/* No combined value for this row */}
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Bill Kapat</td>
              <td className="border border-gray-300 px-4 py-2" colSpan="2">
                
              </td>
              <td className="border border-gray-300 px-4 py-2">{difference.toFixed(2)}</td> {/* No combined value for this row */}
            </tr>
          </tbody>
        </table>
        <button
          onClick={handlePrint}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Print Summary
        </button>
      </div>
    )}
  </div>
</div>

  );
};

export default AggregateUserTotals;
