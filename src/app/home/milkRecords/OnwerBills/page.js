"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const OwnerBillsTable = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null); // State to hold the selected bill
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [currentPage, setCurrentPage] = useState(1);
  const [billsPerPage, setBillsPerPage] = useState(5);

  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);

  // change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(bills.length / billsPerPage); i++) {
    pageNumbers.push(i);
  }

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="gradient-bg flex flex-col min-h-screen">
    <div className="overflow-x-auto p-4">
    <table className="table-auto border-collapse border border-gray-300 w-full bg-gray-200 rounded-md shadow-md hover:shadow-gray-600 shadow-gray-500">
        <thead>
          <tr className="bg-gray-500">
            <th className="text-white border border-gray-200 px-4 py-2">बिलाची तारीख </th>
            <th className="text-white border border-gray-200 px-4 py-2">रजिस्टर नं. </th>
            <th className="text-white border border-gray-200 px-4 py-2">ओनर नाव</th>
            <th className="text-white border border-gray-200 px-4 py-2">एकूण लिटर </th>
            <th className="text-white border border-gray-200 px-4 py-2">एकूण रक्कम </th>
            <th className="text-white border border-gray-200 px-4 py-2">एक्स्ट्रा दर </th>
            <th className="text-white border border-gray-200 px-4 py-2">एकूण कपात </th>
            <th className="text-white border border-gray-200 px-4 py-2">निव्वळ अदा </th>
            <th className="text-white border border-gray-200 px-4 py-2">अधिक माहिती </th>
          </tr>
        </thead>
        <tbody>
          {currentBills.map((bill, index) => (
            <tr key={index} className="even:bg-gray-50 hover:bg-gray-100">
              <td className="text-black px-4 py-2">
                <b>
                  {`${new Date(bill.dateRange.startDate).getDate()} ते  ${new Date(bill.dateRange.endDate).getDate()}/${new Date(bill.dateRange.startDate).getMonth() + 1}/${new Date(bill.dateRange.startDate).getFullYear()}`}
                </b>
              </td>
              <td className="text-black border border-gray-500 px-8 py-2">{bill.registerNo}</td>
              <td className="text-black border border-gray-500 px-8 py-2">{bill.ownerName}</td>
              <td className="text-black border border-gray-500 px-8 py-2">{bill.milkData.totalLiters}</td>
              <td className="text-black border border-gray-500 px-8 py-2">{bill.totalRakkam}</td>
              <td className="text-black border border-gray-500 px-8 py-2">
                {(bill.extraRates.totalBuffExtraRate + bill.extraRates.totalCowExtraRate).toFixed(2)}
              </td>
              <td className="text-black border border-gray-500 px-8 py-2">{bill.kapatDetails.totalKapat}</td>
              <td className="text-black border border-gray-500 px-8 py-2">{bill.netPayment.toFixed(2)}</td>
              <td className="text-black border border-gray-500 px-8 py-2">
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

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`mx-2 px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
        >
          Previous
        </button>
        {Array.from({ length: pageNumbers }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`mx-1 px-3 py-1 rounded ${
              pageNumber === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageNumbers}
          className={`mx-2 px-3 py-1 rounded ${currentPage === pageNumbers ? "bg-gray-300" : "bg-blue-500 text-white"}`}
        >
          Next
        </button>
      </div>

    {/* Modal for detailed view */}
    {isModalOpen && selectedBill && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-md shadow-md w-full h-[600px] overflow-y-auto max-w-2xl mt-20">
    <style jsx>{`
  .max-w-2xl::-webkit-scrollbar {
    height: 8px; /* Adjust the height of the scrollbar */
  }
  .max-w-2xl::-webkit-scrollbar-track {
    background: transparent; /* Optional: Change track background */
  }
  .max-w-2xl::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom right, #4a90e2, #9013fe); /* Set the scrollbar color to black */
    border-radius: 10px; /* Optional: Add rounded corners */
  }
`}</style>
      <h2 className="text-gray-800 text-xl font-bold mb-4 text-center bg-gray-200 shadow-md shadow-gray-600 p-2">दहा दिवसांची बील यादी </h2>
      
      {/* Buffalo Table */}
      <h3 className="text-gray-800 text-lg font-bold mb-2 p-2 shadow-md shadow-gray-300 w-fit rounded-md bg-gray-200">दूध माहिती </h3>
      <table className="w-full border-collapse border border-gray-200 mb-4">
        <thead className="bg-gray-300">
          <tr>
            <th className="text-black border border-gray-200 px-4 py-2">दूध प्रकार </th>
            <th className="text-black border border-gray-200 px-4 py-2">लिटर </th>
            <th className="text-black border border-gray-200 px-4 py-2">रक्कम </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-black font-medium border text-center border-gray-200 px-4 py-2">
              गाय  
            </td>
            <td className="text-black border text-center border-gray-200 px-4 py-2">
              {selectedBill.milkData.cowTotalLiters}
            </td>
            <td className="text-black border text-center border-gray-200 px-4 py-2">
              {selectedBill.milkData.cowTotalRakkam}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border text-center border-gray-200 px-4 py-2">
              म्हैस  
            </td>
            <td className="text-black border text-center border-gray-200 px-4 py-2">
              {selectedBill.milkData.buffTotalLiters}
            </td>
            <td className="text-black border text-center border-gray-200 px-4 py-2">
              {selectedBill.milkData.buffTotalRakkam}
            </td>
          </tr>
          <tr>
            <td className="text-black border font-semibold text-center border-gray-200 px-4 py-2">
              एकूण  
            </td>
            <td className="text-black border text-center font-semibold border-gray-200 px-4 py-2">
            {selectedBill.milkData.totalLiters}
            </td>
            <td className="text-black border text-center font-semibold border-gray-200 px-4 py-2">
            {selectedBill.totalRakkam}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Cow Table */}
      <h3 className="text-gray-800 text-lg font-bold mb-2 p-2 shadow-md shadow-gray-300 w-fit rounded-md bg-gray-200">ज्यादा दर तपशील</h3>
      <table className="w-full border-collapse border border-gray-200 mb-4">
        <thead className="bg-gray-300">
          <tr>
            <th className="text-black border border-gray-200 px-4 py-2">प्रति लि. ज्यादा दर</th>
            <th className="text-black border border-gray-200 px-4 py-2">रक्कम </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-black font-medium border text-center border-gray-200 px-4 py-2">
               गाय  
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.extraRates.totalCowExtraRate}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border text-center border-gray-200 px-4 py-2">
              म्हैस 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.extraRates.totalBuffExtraRate}
            </td>
          </tr>
          <tr>
            <td className="text-blue-950 font-semibold border text-center border-gray-200 px-4 py-2">
              एकूण 
            </td>
            <td className="text-blue-950 border font-semibold border-gray-200 px-4 py-2">
            {selectedBill.extraRates.totalBuffExtraRate + selectedBill.extraRates.totalCowExtraRate}
            </td>
          </tr>
        </tbody>
      </table>
      <h3 className="text-gray-800 text-lg font-bold mb-2 p-2 shadow-md shadow-gray-300 w-fit rounded-md bg-gray-200">कपात तपशील</h3>
      <table className="w-full border-collapse border border-gray-200 mb-4">
        <thead className="bg-gray-300">
          <tr>
            <th className="text-black border border-gray-200 px-4 py-2">कपात </th>
            <th className="text-black border border-gray-200 px-4 py-2">रक्कम </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-black font-medium border text-center border-gray-200 px-4 py-2">
              पशूखाद्य  
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
            {Number(selectedBill.kapatDetails.totalKapat || 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border text-center border-gray-200 px-4 py-2">
              स्थिर कपात  
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
            {Number(selectedBill.kapatDetails.totalKapatRateMultiplybyTotalLiter || 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="text-blue-950 font-semibold border text-center border-gray-200 px-4 py-2">
              एकूण 
            </td>
            <td className="text-blue-950 border font-semibold border-gray-200 px-4 py-2">
            {Number(selectedBill.kapatDetails.totalKapatRateMultiplybyTotalLiter + selectedBill.kapatDetails.totalKapat || 0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Summary Details */}
      <h3 className="text-lg text-gray-800 font-bold mb-2 p-2 shadow-md shadow-gray-300 w-fit rounded-md bg-gray-200">समरी</h3>
      <table className="w-full border-collapse border border-gray-200">
        <tbody>
          <tr className="bg-gray-300">
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              इतर अदा रक्कम  
            </td>
            <td className="text-blue-950 border font-semibold border-gray-200 px-4 py-2">
            {selectedBill.extraRates.totalBuffExtraRate + selectedBill.extraRates.totalCowExtraRate}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              एकून रक्कम  
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
            {(selectedBill.totalRakkam + selectedBill.extraRates.totalBuffExtraRate + selectedBill.extraRates.totalCowExtraRate). toFixed(2)}
            </td>
          </tr>
          <tr className="">
            <td className="text-black  border border-gray-200 px-4 py-2">
              एकूण कपात 
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
            {Number(selectedBill.kapatDetails.totalKapatRateMultiplybyTotalLiter + selectedBill.kapatDetails.totalKapat || 0).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td className="text-black bg-gray-200 font-semibold border border-gray-200 px-4 py-2">
              निव्वळ अदा 
            </td>
            <td className="text-black border font-semibold border-gray-200 px-4 py-2">
              {selectedBill.netPayment}
            </td>
          </tr>
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
