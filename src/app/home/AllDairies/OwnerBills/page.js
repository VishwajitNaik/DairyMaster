"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const BillSummary = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [billsGenerated, setBillsGenerated] = useState(false);
  const [error, setError] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);

  const handleFetchBills = async () => {
    setLoading(true);
    setError("");
    setBillsGenerated(false);

    try {
      const response = await axios.post("/api/sangh/OwnerBills", {
        startDate,
        endDate,
      });

      if (response.data && Array.isArray(response.data.data)) {
        setBillData(response.data.data);
        setBillsGenerated(true);
      } else {
        setError("Invalid response format from server.");
      }
    } catch (error) {
      setError("Failed to fetch bill data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMoreInfo = (bill) => {
    setSelectedBill(bill);
  };

  const closeModal = () => {
    setSelectedBill(null);
  };

  useEffect(() => {}, [billData]);

  const handleSaveBills = async () => {
    if (billData.length === 0) {
      setError("No bills to save.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/sangh/Store", { bills: billData, startDate, endDate });
      console.log("Bills saved successfully:", response.data);
      alert("Bills saved successfully!");
    } catch (error) {
      console.error("Failed to save bill data:", error.message);
      setError("Failed to save bill data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="gradient-bg flex flex-col min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Bill Summary</h1>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
        <div>
          <label htmlFor="startDate" className="block mb-1 font-medium">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-black border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block mb-1 font-medium">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-black border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>
        <button
          onClick={handleFetchBills}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Fetching..." : "Generate Bills"}
        </button>
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {billsGenerated && billData.length > 0 && (
        <div>
          <table className="w-full border-collapse border border-gray-200 mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-black border border-gray-200 px-4 py-2">Register No</th>
                <th className="text-black border border-gray-200 px-4 py-2">Owner Name</th>
                <th className="text-black border border-gray-200 px-4 py-2">Total Liters</th>
                <th className="text-black border border-gray-200 px-4 py-2">Total Rakkam</th>
                <th className="text-black border border-gray-200 px-4 py-2">Extra Rate</th>
                <th className="text-black border border-gray-200 px-4 py-2">Total Kapat</th>
                <th className="text-black border border-gray-200 px-4 py-2">Net Payment</th>
                <th className="text-black border border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billData.map((bill, index) => (
                <tr key={index} className="even:bg-gray-50">
                  <td className="text-black border border-gray-200 px-4 py-2">
                    {bill.registerNo}
                  </td>
                  <td className="text-black border border-gray-200 px-4 py-2">
                    {bill.ownerName}
                  </td>
                  <td className="text-black border border-gray-200 px-4 py-2">
                    {bill.totalLiters}
                  </td>
                  <td className="text-black border border-gray-200 px-4 py-2">
                    {bill.totalRakkam}
                  </td>
                  <td className="text-black border border-gray-200 px-4 py-2">
                    {bill.totalExtraRate}
                  </td>
                  <td className="text-black border border-gray-200 px-4 py-2">
                    {bill.totalKapat}
                  </td>
                  <td className="text-black border border-gray-200 px-4 py-2">
                    {bill.netPayment}
                  </td>
                  <td className="text-black border border-gray-200 px-4 py-2">
                    <button
                      onClick={() => handleMoreInfo(bill)}
                      className="bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-700 transition"
                    >
                      More Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center">
          <button
                onClick={handleSaveBills}
                className='py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md'>
                Save Bills
              </button>
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Print Summary
            </button>
          </div>
        </div>
      )}

      {billsGenerated && billData.length === 0 && (
        <p className="text-center text-gray-500">
          No bills found for the selected date range.
        </p>
      )}

      {selectedBill && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-md shadow-md max-w-2xl w-full h-[600px] overflow-y-auto">
      <h2 className="text-black text-xl font-bold mb-4 text-center">Additional Details</h2>
      
      {/* Buffalo Table */}
      <h3 className="text-black text-lg font-bold mb-2">Buffalo Details</h3>
      <table className="w-full border-collapse border border-gray-200 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-black border border-gray-200 px-4 py-2">Detail</th>
            <th className="text-black border border-gray-200 px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Total Liters
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.buffTotalLiters}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Total Rakkam
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.buffTotalRakkam}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Extra Rate
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.totalBuffExtraRate || "N/A"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Cow Table */}
      <h3 className="text-black text-lg font-bold mb-2">Cow Details</h3>
      <table className="w-full border-collapse border border-gray-200 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-black border border-gray-200 px-4 py-2">Detail</th>
            <th className="text-black border border-gray-200 px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Total Liters
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.cowTotalLiters}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Total Rakkam
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.cowTotalRakkam}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Extra Rate
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.totalCowExtraRate || "N/A"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Summary Details */}
      <h3 className="text-lg font-bold mb-2">Summary</h3>
      <table className="w-full border-collapse border border-gray-200">
        <tbody>
          <tr className="bg-gray-100">
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Total Rakkam
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.totalRakkam}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Extra Rate
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.totalExtraRate}
            </td>
          </tr>
          <tr className="bg-gray-100">
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Total Kapat
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.totalKapat}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Net Payment
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.netPayment}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Sthir Kapat
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.totalKapatRateMultiplybyTotalLiter}
            </td>
          </tr>

          {/*  */}
        </tbody>
      </table>

      <div className="text-center mt-4">
        <button
          onClick={closeModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default BillSummary;
