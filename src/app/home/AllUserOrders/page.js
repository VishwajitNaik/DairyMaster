"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/app/components/Loading/Loading";

const UserOrdersBillKapat = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Items per page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetching all data on component mount
  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get("/api/orders/AllUserOrders")
      .then((response) => {
        setData(response.data.data);
      })
      .catch(() => {
        setError("Failed to fetch data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Calculate the total remaining amount
  const totalRemainingAmount = data.reduce((sum, user) => sum + user.remainingAmount, 0);

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="gradient-bg flex items-center flex-col min-h-screen p-4 sm:p-8">
      <h1 className="text-2xl sm:text-4xl mb-8 text-center">
        सर्व उत्पादक बाकी पाहणे (संपूर्ण डेटा)
      </h1>

      {/* Loading and error messages */}
      {loading && <p className="text-center"><Loading /></p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Data table */}
      <div className="w-1/2 rounded-md shadow-md shadow-black">
        {currentData.length > 0 ? (
          <table className="table-auto border-collapse w-full bg-gray-200 text-sm sm:text-base rounded-md">
            <thead>
              <tr className="bg-gray-400">
                <th className="text-black border px-4 py-2">उत्पादक नं</th>
                <th className="text-black border px-4 py-2">उत्पादक</th>
                <th className="text-black border px-4 py-2">रक्कम</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((user) => (
                <tr key={user.userId} className="text-center">
                  <td className="text-black border border-gray-700 px-4 py-2">{user.registerNo}</td>
                  <td className="text-black border border-gray-700 px-4 py-2">{user.username}</td>
                  <td className="text-black border border-gray-700 px-4 py-2">{user.remainingAmount}</td>
                </tr>
              ))}
              {/* Footer row for total */}
              <tr className="bg-gray-100 font-bold text-center">
                <td className="border border-gray-700 px-4 py-2 text-blue-950" colSpan="2">एकूण बाकी</td>
                <td className="text-blue-950 border border-gray-700 px-4 py-2">
                   {totalRemainingAmount}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          !loading && <p className="text-center">डेटा उपलब्ध नाही</p>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded ${
              currentPage === 1 ? "bg-gray-500" : "bg-blue-500 text-white"
            }`}
          >
            मागील पृष्ठ
          </button>
          <span className="text-black">
            पृष्ठ {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded ${
              currentPage === totalPages ? "bg-gray-500" : "bg-blue-500 text-white"
            }`}
          >
            पुढील पृष्ठ
          </button>
        </div>
      )}
    </div>
  );
};

export default UserOrdersBillKapat;
