"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/app/components/Loading/Loading";

const UcchalPage = () => {
  const [ucchal, setUcchal] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch Ucchal Records
  const fetchUcchal = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`/api/user/ucchal/GetAllUserUcchal`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Send token
        },
      });

      setUcchal(response.data.data || []);
      setTotalAmount(response.data.TotalUcchal || 0);
    } catch (err) {
      console.error("Error fetching Ucchal records:", err);
      setError(err.response?.data?.error || "Failed to fetch Ucchal records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUcchal(); // ✅ Fetch records on load
  }, []);

  // ✅ Delete Ucchal Record
  const deleteUcchal = async (recordId) => {
    if (!recordId) return;

    setLoading(true);
    try {
      const response = await axios.delete(`/api/user/ucchal/delete?id=${recordId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setUcchal((prev) => prev.filter((record) => record._id !== recordId));
        setTotalAmount((prev) => prev - response.data.amount);
      }
    } catch (error) {
      console.error("Error deleting Ucchal record:", error);
      setError("Failed to delete record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center bg-transparent shadow-md rounded-md shadow-black w-fit mx-auto p-2">
          उच्चल तपशील (Ucchal Records)
        </h1>

        {/* ✅ Loading/Error State */}
        {loading ? (
          <div className="text-center mt-10">
            <Loading />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : ucchal.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full bg-white text-black shadow-md rounded-lg text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-200 font-bold">
                  <th className="py-2 px-1 md:py-3 md:px-2 border border-gray-400 text-center">
                    तारीख (Date)
                  </th>
                  <th className="py-2 px-1 md:py-3 md:px-2 border border-gray-400 text-center">
                    रजि. नं. 
                  </th>
                  <th className="py-2 px-1 md:py-3 md:px-2 border border-gray-400 text-center">
                    रक्कम (Amount)
                  </th>
                  <th className="py-2 px-1 md:py-3 md:px-2 border border-gray-400 text-center">
                    कृती (Actions)
                  </th>
                </tr>
              </thead>
              <tbody>
                {ucchal.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-100">
                    <td className="py-2 px-1 md:px-4 border border-gray-400 text-center font-bold">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-1 md:px-2 border border-gray-400 text-center">
                      {record.registerNo}
                    </td>
                    <td className="py-2 px-1 md:px-2 border border-gray-400 text-center">
                      {record.rakkam.toFixed(2)}
                    </td>
                    <td className="py-2 px-1 md:px-2 border border-gray-400 text-center">
                      <button
                        onClick={() => deleteUcchal(record._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="py-2 px-1 md:py-3 md:px-2 border border-gray-400 text-center">
                    एकूण (Total)
                  </td>
                  <td className="py-2 px-1 md:py-3 md:px-2 border border-gray-400 text-center"></td> 
                  <td className="py-2 px-1 md:py-3 md:px-2 border border-gray-400 text-center">
                    ₹{totalAmount.toFixed(2)}
                  </td>
                  <td className="py-2 px-1 md:py-3 md:px-2 border border-gray-400 text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center font-bold text-xl md:text-2xl mt-4">
            कोणतेही उच्चल रेकॉर्ड उपलब्ध नाहीत.
          </p>
        )}
      </div>
    </div>
  );
};

export default UcchalPage;
