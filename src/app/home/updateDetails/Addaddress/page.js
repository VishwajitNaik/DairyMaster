"use client";

import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAddressForm = () => {
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Assumes token is stored in localStorage
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const payload = {
        Address: address,
        PinCode: pinCode,
        createdBy: "ownerId", // Replace with dynamic ownerId if available
      };

      const response = await axios.post("/api/owner/AddAddress", payload, { headers });

      toast.success(response.data.message || "Address added successfully!");
      setAddress("");
      setPinCode("");
    } catch (error) {
      console.error("Error adding address:", error.message);
      toast.error(error.response?.data?.error || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover"
      style={{ backgroundImage: "url('/path/to/your/background.jpg')" }}
    >
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Add New Address</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Input */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-black p-2 border border-gray-300 rounded"
              placeholder="Enter the address"
              required
            />
          </div>

          {/* Pin Code Input */}
          <div>
            <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
              Pin Code
            </label>
            <input
              type="text"
              id="pinCode"
              name="pinCode"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full text-black p-2 border border-gray-300 rounded"
              placeholder="Enter the pin code"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAddressForm;
