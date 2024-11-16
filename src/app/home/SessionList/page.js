"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function UserTable() {
  const [users, setUsers] = useState([]); // Initialize users as an empty array
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    // Fetch available users who don't have milk records for the current date and session
    const noMilkUsers = async () => {
      try {
        const response = await axios.get("/api/SessionList"); // Updated API route
        if (Array.isArray(response.data.data)) {
          setUsers(response.data.data); // Ensure response is an array before setting
        } else {
          console.error("Unexpected response format:", response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]); // Fallback to an empty array in case of error
      } finally {
        setIsLoading(false); // Loading complete
      }
    };

    noMilkUsers();
  }, []);

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (isLoading) {
    return <p>Loading...</p>; // Display a loading message
  }

  if (users.length === 0) {
    return <p>No users available</p>; // Handle the case where no users are available
  }

  return (
    <div>
    {/* Button to open the modal */}
    <button
      onClick={toggleModal}
      className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-lg"
    >
      Show Users
    </button>

    {/* Modal for displaying user table */}
    {isModalOpen && (
      <div className="text-black fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="bg-white text-black p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 relative">
          <h2 className="text-xl text-black font-semibold mb-4">Users Without Milk Records</h2>
          {/* Cross button */}
          <button
            onClick={toggleModal}
            className="text-black absolute top-2 right-2 hover:text-black text-2xl font-bold"
          >
            &times;
          </button>

          <table className="table-auto w-full border-collapse text-black">
            <thead>
              <tr>
                <th className="border-b px-4 py-2 text-left text-black">Name</th>
                <th className="border-b px-4 py-2 text-left text-black">Register No</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border-b px-4 py-2 text-black">{user.name}</td>
                  <td className="border-b px-4 py-2 text-black">{user.registerNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>

  );
}
