"use client";
import { useEffect, useState } from "react";

const MilkRecords = () => {
  const [milkRecords, setMilkRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null); // For storing selected milk record

  useEffect(() => {
    // Fetch the milk records from the backend API
    const fetchMilkRecords = async () => {
      try {
        const response = await fetch("/api/owner/Sanghdata/ownerMilk");
        const data = await response.json();

        console.log("Owner Milks data: ", data);

        if (response.ok) {
          // Check if the response is an array, or if it has the records inside another field
          if (Array.isArray(data)) {
            setMilkRecords(data);
          } else if (data?.data && Array.isArray(data.data)) {
            setMilkRecords(data.data); // Adjust based on your actual response structure
          } else {
            setMilkRecords([]); // Handle the case where no valid records are found
            setError("No valid records found in the response.");
          }
        } else {
          setError(data.message || "Failed to fetch records");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchMilkRecords();
  }, []);

  const handlePop = (record) => {
    setSelectedRecord(record); // Set the selected record to display detailed information
  };

  const closeModal = () => {
    setSelectedRecord(null); // Close the modal
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Milk Records</h1>

      {milkRecords.length === 0 ? (
        <p>No milk records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border-b px-4 py-2 text-left">Date</th>
                <th className="border-b px-4 py-2 text-left">Register No</th>
                <th className="border-b px-4 py-2 text-left">Sample No</th>
                <th className="border-b px-4 py-2 text-left">Milk Type</th>
                <th className="border-b px-4 py-2 text-left">Milk Liter</th>
                <th className="border-b px-4 py-2 text-left">Fat</th>
                <th className="border-b px-4 py-2 text-left">SNF</th>
                <th className="border-b px-4 py-2 text-left">Rate</th>
                <th className="border-b px-4 py-2 text-left">Amount</th>
                <th className="border-b px-4 py-2 text-left">Action</th> {/* New column for button */}
              </tr>
            </thead>
            <tbody>
              {milkRecords.map((record) => (
                <tr key={record._id} className="border-b bg-gray-200">
                  <td className="text-black px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="text-black px-4 py-2">{record.registerNo}</td>
                  <td className="text-black px-4 py-2">{record.sampleNo}</td>
                  <td className="text-black px-4 py-2">{record.milkType}</td>
                  <td className="text-black px-4 py-2">{record.milkLiter}</td>
                  <td className="text-black px-4 py-2">{record.fat}%</td>
                  <td className="text-black px-4 py-2">{record.snf}%</td>
                  <td className="text-black px-4 py-2">₹{record.rate}</td>
                  <td className="text-black px-4 py-2">₹{record.amount}</td>
                  <td className="text-black px-4 py-2">
                    <button
                      onClick={() => handlePop(record)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      All details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal to show detailed info of the selected milk record */}
            {selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
            <h2 className="text-3xl font-semibold text-blue-950 mb-6">Milk Record Details</h2>
            
            <table className="min-w-full table-auto border-collapse">
                <thead>
                <tr className="bg-gray-100 text-gray-800">
                    <th className="px-4 py-2 text-left font-medium">Field</th>
                    <th className="px-4 py-2 text-left font-medium">Value</th>
                </tr>
                </thead>
                <tbody>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong>दिनांक</strong></td>
                    <td className="px-4 py-2 text-gray-700">{new Date(selectedRecord.date).toLocaleDateString()}</td>
                </tr>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong></strong></td>
                    <td className="px-4 py-2 text-gray-700">{selectedRecord.sampleNo}</td>
                </tr>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong>Milk Type</strong></td>
                    <td className="px-4 py-2 text-gray-700">{selectedRecord.milkType}</td>
                </tr>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong>Milk Liter</strong></td>
                    <td className="px-4 py-2 text-gray-700">{selectedRecord.milkLiter}</td>
                </tr>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong>Milk KG</strong></td>
                    <td className="px-4 py-2 text-gray-700">{selectedRecord.milkKG}</td>
                </tr>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong>Fat</strong></td>
                    <td className="px-4 py-2 text-gray-700">{selectedRecord.fat}</td>
                </tr>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong>SNF</strong></td>
                    <td className="px-4 py-2 text-gray-700">{selectedRecord.snf}</td>
                </tr>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong>Rate</strong></td>
                    <td className="px-4 py-2 text-gray-700">₹{selectedRecord.rate}</td>
                </tr>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong>Amount</strong></td>
                    <td className="px-4 py-2 text-gray-700">₹{selectedRecord.amount}</td>
                </tr>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong>SNF</strong></td>
                    <td className="px-4 py-2 text-gray-700">{selectedRecord.snf}</td>
                </tr>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong>SNF</strong></td>
                    <td className="px-4 py-2 text-gray-700">{selectedRecord.snf}</td>
                </tr>
                <tr className="border-t border-gray-300">
                    <td className="px-4 py-2 text-gray-700"><strong>SNF</strong></td>
                    <td className="px-4 py-2 text-gray-700">{selectedRecord.snf}</td>
                </tr>
                </tbody>
            </table>

            <div className="mt-6 flex justify-center">
                <button
                onClick={closeModal}
                className="text-white bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
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

export default MilkRecords;
