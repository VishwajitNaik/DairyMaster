'use client';

import React, { useState } from 'react';
import axios from 'axios';

const SavedBills = () => {
  const [bills, setBills] = useState([]); // State to hold fetched bills
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(''); // State to manage error messages
  const [startDate, setStartDate] = useState(''); // State for start date
  const [endDate, setEndDate] = useState(''); // State for end date
  const [filteredBills, setFilteredBills] = useState({}); // State to store filtered bills by date range
  const [showDropdown, setShowDropdown] = useState(null); // State to manage which dropdown to show
  const [selectedBill, setSelectedBill] = useState(null); // State to store the selected bill for the modal
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility

  // Fetch bills by date range
  const fetchBillsByDateRange = async (start, end) => {
    setLoading(true);
    setError('');
    try {
      const endpoint = `/api/sangh/savedOwnerBills?startDate=${start}&endDate=${end}`;
      const response = await axios.get(endpoint);
      setFilteredBills((prev) => ({
        ...prev,
        [`${start}_${end}`]: response.data.data,
      }));
    } catch (err) {
      console.error('Failed to fetch bills:', err.message);
      setError('Failed to fetch bills. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle date range submission
  const handleButtonClick = () => {
    if (startDate && endDate) {
      fetchBillsByDateRange(startDate, endDate);
    } else {
      setError('Please select both start and end dates.');
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = (rangeKey) => {
    setShowDropdown(showDropdown === rangeKey ? null : rangeKey);
  };

  // Handle more info click to show modal
  const handleMoreInfo = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedBill(null);
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-black text-2xl font-bold mb-4">Saved Bills</h1>

      {/* Date Range Inputs */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="text-black border border-gray-300 p-2 rounded mb-2 w-full"
        />

        <label className="block mb-2 font-medium">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="text-black border border-gray-300 p-2 rounded w-full"
        />

        <button
          onClick={handleButtonClick}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
        >
          Fetch Bills
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Loading Spinner */}
      {loading && <p>Loading...</p>}

      {/* Display Filtered Bills */}
      {Object.keys(filteredBills).length > 0 && (
        <div>
          {Object.keys(filteredBills).map((rangeKey) => (
            <div key={rangeKey} className="mb-4">
              <button
                onClick={() => toggleDropdown(rangeKey)}
                className="bg-gray-200 text-black px-4 py-2 rounded w-full text-left"
              >
                {rangeKey} <span className='text-blue-700'> (Click to {showDropdown === rangeKey ? 'hide' : 'view'}) </span>
              </button>
              {showDropdown === rangeKey && (
                <div className="border border-gray-300 rounded mt-2 p-2">
                  {filteredBills[rangeKey].length > 0 ? (
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="text-black border border-gray-200 px-4 py-2">Register No</th>
                          <th className="text-black border border-gray-200 px-4 py-2">Owner Name</th>
                          <th className="text-black border border-gray-200 px-4 py-2">Total Liters</th>
                          <th className="text-black border border-gray-200 px-4 py-2">Total Rakkam</th>
                          <th className="text-black border border-gray-200 px-4 py-2">Sthir Kapat</th>
                          <th className="text-black border border-gray-200 px-4 py-2">Extra Rate</th>
                          <th className="text-black border border-gray-200 px-4 py-2">Total Kapat</th>
                          <th className="text-black border border-gray-200 px-4 py-2">Net Payment</th>
                          <th className="text-black border border-gray-200 px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBills[rangeKey].map((bill, index) => (
                          <tr key={index} className="even:bg-gray-50">
                            <td className="text-black border border-gray-200 px-4 py-2">{bill.registerNo}</td>
                            <td className="text-black border border-gray-200 px-4 py-2">{bill.ownerName}</td>
                            <td className="text-black border border-gray-200 px-4 py-2">{bill.milkData.totalLiters}</td>
                            <td className="text-black border border-gray-200 px-4 py-2">{bill.totalRakkam}</td>
                            <td className="text-black border border-gray-200 px-4 py-2">{(bill.kapatDetails.totalKapatRateMultiplybyTotalLiter).toFixed(2)}</td>
                            <td className="text-black border border-gray-200 px-4 py-2">
                              {bill.extraRates.totalBuffExtraRate + bill.extraRates.totalCowExtraRate}
                            </td>
                            <td className="text-black border border-gray-200 px-4 py-2">
                              {Number(bill.kapatDetails.totalKapat || 0).toFixed(2)}
                            </td>
                            <td className="text-black border border-gray-200 px-4 py-2">{bill.netPayment}</td>
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
                  ) : (
                    <p className='text-red-600'>No bills found for this date range.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal to Display Detailed Information */}
      {showModal && selectedBill && (
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
              {selectedBill.milkData.totalLiters}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Total Rakkam
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.milkData.buffTotalRakkam}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Extra Rate
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.extraRates.totalBuffExtraRate || "N/A"}
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
              {selectedBill.milkData.cowTotalLiters}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Total Rakkam
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
              {selectedBill.milkData.cowTotalRakkam}
            </td>
          </tr>
          <tr>
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Extra Rate
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
            {selectedBill.extraRates.totalBuffExtraRate + selectedBill.extraRates.totalCowExtraRate}
            </td>
          </tr>
          <tr className="bg-gray-100">
            <td className="text-black font-medium border border-gray-200 px-4 py-2">
              Total Kapat
            </td>
            <td className="text-black border border-gray-200 px-4 py-2">
            {Number(selectedBill.kapatDetails.totalKapat || 0).toFixed(2)}
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
            {Number(selectedBill.kapatDetails.totalKapatRateMultiplybyTotalLiter || 0).toFixed(2)}
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

export default SavedBills;