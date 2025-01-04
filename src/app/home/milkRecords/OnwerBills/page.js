"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const OwnerBillsTable = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null); // State to hold the selected bill
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchOwnerBills = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/owner/Sanghdata/ownerBills"); // Replace with your actual API endpoint
        setBills(response.data.ownerBills);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bills:", error.message);
        setError("Failed to load bills.");
        setLoading(false);
      }
    };

    fetchOwnerBills();
  }, []);

  const openModal = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBill(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
    <div className="overflow-x-auto bg-white">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-black border border-gray-200 px-4 py-2">बिलाची तारीख </th>
            <th className="text-black border border-gray-200 px-4 py-2">रजिस्टर नं. </th>
            <th className="text-black border border-gray-200 px-4 py-2">ओनर नाव</th>
            <th className="text-black border border-gray-200 px-4 py-2">एकूण लिटर </th>
            <th className="text-black border border-gray-200 px-4 py-2">एकूण रक्कम </th>
            <th className="text-black border border-gray-200 px-4 py-2">एक्स्ट्रा दर </th>
            <th className="text-black border border-gray-200 px-4 py-2">एकूण कपात </th>
            <th className="text-black border border-gray-200 px-4 py-2">निव्वळ अदा </th>
            <th className="text-black border border-gray-200 px-4 py-2"> अधिक माहिती </th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, index) => (
            <tr key={index} className="even:bg-gray-50 hover:bg-gray-100">
            <b>
              <td className="text-black border border-gray-200 px-4 py-2">
                {`${new Date(bill.dateRange.startDate).getDate()} ते  ${new Date(bill.dateRange.endDate).getDate()}/${new Date(bill.dateRange.startDate).getMonth() + 1}/${new Date(bill.dateRange.startDate).getFullYear()}`}
              </td>
              </b>
              <td className="text-black border border-gray-200 px-8 py-2">{bill.registerNo}</td>
              <td className="text-black border border-gray-200 px-8 py-2">{bill.ownerName}</td>
              <td className="text-black border border-gray-200 px-8 py-2">{bill.milkData.totalLiters}</td>
              <td className="text-black border border-gray-200 px-8 py-2">{bill.totalRakkam}</td>
              <td className="text-black border border-gray-200 px-8 py-2">
                {(bill.extraRates.totalBuffExtraRate + bill.extraRates.totalCowExtraRate).toFixed(2)}
              </td>
              <td className="text-black border border-gray-200 px-8 py-2">{bill.kapatDetails.totalKapat}</td>
              <td className="text-black border border-gray-200 px-8 py-2">{bill.netPayment.toFixed(2)}</td>
              <td className="text-black border border-gray-200 px-8 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => openModal(bill)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    {/* Modal for detailed view */}
    {isModalOpen && selectedBill && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-md shadow-md max-w-2xl w-full h-[600px] overflow-y-auto">
      <h2 className="text-black text-xl font-bold mb-4 text-center">दहा दिवसांची बील यादी </h2>
      
      {/* Buffalo Table */}
      <h3 className="text-black text-lg font-bold mb-2">म्हैस दूध </h3>
      <table className="w-full border-collapse border border-gray-200 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-black border border-gray-200 px-4 py-2">म्हैस दूध माहिती </th>
            <th className="text-black border border-gray-200 px-4 py-2">रक्कम </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              म्हैस लिटर 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.milkData.totalLiters}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              एकूण रक्कम 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.milkData.buffTotalRakkam}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              एक्स्ट्रा म्हैस दर 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.extraRates.totalBuffExtraRate || "N/A"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Cow Table */}
      <h3 className="text-black text-lg font-bold mb-2">गाय दूध </h3>
      <table className="w-full border-collapse border border-gray-200 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-black border border-gray-200 px-4 py-2">माहिती</th>
            <th className="text-black border border-gray-200 px-4 py-2">रक्कम </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              एकूण गाय लिटर 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.milkData.cowTotalLiters}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              एकूण गाय रक्कम
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.milkData.cowTotalRakkam}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              एक्स्ट्रा गाय दर 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.extraRates.totalCowExtraRate || "N/A"}
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
              एकूण रक्कम 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.totalRakkam}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              एक्स्ट्रा दर 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
            {selectedBill.extraRates.totalBuffExtraRate + selectedBill.extraRates.totalCowExtraRate}
            </td>
          </tr>
          <tr className="bg-gray-100">
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              एकूण कपात 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
            {Number(selectedBill.kapatDetails.totalKapat || 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              स्थिर कपात 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
            {Number(selectedBill.kapatDetails.totalKapatRateMultiplybyTotalLiter || 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              निव्वळ अदा 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.netPayment}
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
    </div>
  );
};

export default OwnerBillsTable;
