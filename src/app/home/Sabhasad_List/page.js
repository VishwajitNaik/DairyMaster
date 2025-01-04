"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function Sabhasad() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [responseMessage, setResponseMessage] = useState("");
  const [userToDelete, setUserToDelete] = useState(null); // State for user to delete
  
  useEffect(() => {
    async function getOwnerUsers() {
      try {
        const res = await axios.get('/api/user/getUsers');
        setUsers(res.data.data.users);
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
      }
    }
    getOwnerUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

  // Handle user deletion with confirmation
  const handleDeleteUser = async (userId) => {
    setUserToDelete(userId); // Set the user to be deleted
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`/api/user/DeleteUser?id=${userToDelete}`);
      setUsers(users.filter(user => user._id !== userToDelete));
      setResponseMessage("User deleted successfully!");
      setUserToDelete(null); // Reset userToDelete state after deletion
    } catch (error) {
      setResponseMessage(`Failed to delete user: ${error.response?.data?.error || error.message}`);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null); // Cancel the deletion
  };

  // Handle the user update submission
  const handleUpdateSubmit = async () => {
    try {
      const response = await axios.put(`/api/user/UpdateUser`, {
        userId: editingUser._id,
        updatedData: updatedUserData,
      });
      setResponseMessage("User updated successfully!");
      setUsers(users.map(user => (user._id === editingUser._id ? response.data.data : user)));
      setEditingUser(null);
    } catch (error) {
      setResponseMessage(`Failed to update user: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
    <div className="container text-black mx-auto mt-6">
      <div className="flex justify-center items-center mb-6">
        <Image
          src="/assets/avatar.png"
          alt="Avatar"
          width={100}
          height={100}
          className="w-20 h-20 rounded-full mr-4"
        />
        <h1 className="text-4xl font-bold">सभासद लिस्ट</h1>
      </div>
  
      {responseMessage && <p className="text-center my-4">{responseMessage}</p>}
  
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto rounded-md">
        <table className="min-w-full bg-gray-300 border border-gray-200 rounded-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Register No</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Milk</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Bank Name</th>
              <th className="py-2 px-4 border-b">Account No</th>
              <th className="py-2 px-4 border-b">Aadhar No</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-2 px-4 border-b text-center">
                  No users available
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{user.registerNo}</td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.milk}</td>
                  <td className="py-2 px-4 border-b">{user.phone}</td>
                  <td className="py-2 px-4 border-b">{user.bankName}</td>
                  <td className="py-2 px-4 border-b">{user.accountNo}</td>
                  <td className="py-2 px-4 border-b">{user.aadharNo}</td>
                  <td className="py-2 px-4 border-b flex items-center space-x-4">
                    <Link href={`/home/Sabhasad_List/${user._id}`}>
                      <button className="bg-blue-400 hover:bg-blue-700 text-white rounded-md p-2 flex items-center">
                        <span>User Details</span>
                      </button>
                    </Link>
                    <Link href={`/home/OrdersSabhasad_List/${user._id}`}>
                      <FontAwesomeIcon icon={faShoppingCart} className="text-green-500 text-xl cursor-pointer" />
                    </Link>
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setUpdatedUserData({ ...user });
                      }}
                      className="bg-yellow-400 hover:bg-yellow-600 text-white rounded-md p-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-700 text-white rounded-md p-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
  
      {/* Mobile View */}
      <div className="sm:hidden">
        {users.length === 0 ? (
          <p className="text-center my-4">No users available</p>
        ) : (
          users.map((user, index) => (
            <div key={index} className="bg-gray-200 p-4 mb-4 rounded-md shadow-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Register No:</span>
                <span>{user.registerNo}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Milk:</span>
                <span>{user.milk}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Phone:</span>
                <span>{user.phone}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Actions:</span>
                <div className="flex space-x-2">
                  <Link href={`/home/Sabhasad_List/${user._id}`}>
                    <button className="bg-blue-400 hover:bg-blue-700 text-white rounded-md p-2">
                      Details
                    </button>
                  </Link>
                  <Link href={`/home/OrdersSabhasad_List/${user._id}`}>
                    <FontAwesomeIcon icon={faShoppingCart} className="text-green-500 text-xl cursor-pointer" />
                  </Link>
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setUpdatedUserData({ ...user });
                    }}
                    className="bg-yellow-400 hover:bg-yellow-600 text-white rounded-md p-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 hover:bg-red-700 text-white rounded-md p-2"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  
    {/* Confirmation modal for deletion */}
    {userToDelete && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-8 rounded-md shadow-md w-1/3">
          <h2 className="text-center text-2xl font-bold mb-4">Are you sure you want to delete this user?</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={confirmDeleteUser}
              className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
            >
              Yes, Delete
            </button>
            <button
              onClick={cancelDelete}
              className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  
    {/* Edit User Modal */}
    {editingUser && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-8 rounded-md shadow-md w-1/3">
          <h2 className="text-black text-center text-2xl font-bold mb-4">Update User</h2>
          <form>
            {/* Input fields */}
            <label className='text-black'>
              Register No:
              <input
                type="text"
                name="registerNo"
                value={updatedUserData.registerNo || ""}
                onChange={handleInputChange}
                className="text-black w-full p-2 mt-1 mb-4 border rounded"
              />
            </label>
            {/* Other form fields for user data */}
            <button
              type="button"
              onClick={handleUpdateSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full mt-4"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded w-full mt-4"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
  
  );
}
