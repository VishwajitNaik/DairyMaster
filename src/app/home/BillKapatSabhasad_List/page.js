"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default function Sabhasad() {
  const [user, setUser] = useState([]); // Ensure initial state is an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getOwnerUsers() {
      try {
        const res = await axios.get('/api/user/getUsers');
        console.log(res.data);
        // Update the state to match the response structure
        setUser(res.data.data.users);  // Adjusted to match the response format: { data: owner }
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
      }
    }
    getOwnerUsers();
  }, []);

  if (loading) return <div>Loading...</div>; // Loading state
  if (error) return <div className="text-red-500">{error}</div>; // Error state

  return (
    <div className="container text-black mx-auto mt-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-4xl font-bold">सभासद लिस्ट</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Register No</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Milk</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Bank Name</th>
              <th className="py-2 px-4 border-b">Account No</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {user.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-2 px-4 border-b text-center">
                  No user created yet
                </td>
              </tr>
            ) : (
              user.map((sabhasad) => (
                <tr key={sabhasad._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{sabhasad.registerNo}</td>
                  <td className="py-2 px-4 border-b">{sabhasad.name}</td>
                  <td className="py-2 px-4 border-b">{sabhasad.milk}</td>
                  <td className="py-2 px-4 border-b">{sabhasad.phone}</td>
                  <td className="py-2 px-4 border-b">{sabhasad.bankName}</td>
                  <td className="py-2 px-4 border-b">{sabhasad.accountNo}</td>
                  <td className="py-2 px-4 border-b">{sabhasad.email}</td>
                  <td className="py-2 px-4 border-b flex items-center space-x-4">
                    <Link href={`/home/BillKapatSabhasad_List/${sabhasad._id}`}>
                      <FontAwesomeIcon icon={faShoppingCart} className="text-green-500 text-xl cursor-pointer" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
