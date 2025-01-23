"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function Sabhasad() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getOwnerUsers() {
      try {
        const res = await axios.get('/api/user/getUsers');
        console.log(res.data);
        // Update the state to match the response structure
        setUsers(res.data.data);  // Adjusted to match the response format: { data: owner }
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
      }
    }
    getOwnerUsers();
  }, []);

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
    <div className="container text-black mx-auto mt-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-4xl font-bold">सभासद लिस्ट (Sabhasad List)</h1>
      </div>
      <div className="hidden sm:block overflow-x-auto rounded-md">
        <table className="min-w-full bg-gray-300 border border-gray-200 rounded-md">
          <thead className="bg-gray-500">
            <tr>
            <th className="py-2 px-4 border-b">रजिस्टर नं. </th>
              <th className="py-2 px-4 border-b">उत्पादक नं. </th>
              <th className="py-2 px-4 border-b">दूध प्रकार </th>
              <th className="py-2 px-4 border-b">मोबाईल नं.</th>
              <th className="py-2 px-4 border-b">बँकेचे नाव</th>
              <th className="py-2 px-4 border-b">खाता नं. </th>
              <th className="py-2 px-4 border-b">आधार नं.</th>
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
                  <td className="py-2 px-4 border-b flex items-center space-x-4 bg-blue-400 text-center rounded-s-md m-2 hover:bg-blue-600">
                    {/* Link to user details */}
                        <Link href={`/home/AdvanceSabhasad_List/${user._id}`}>
                          <Image src="/assets/monycut.png" alt="View" width={30} height={30} className='rounded-full' />
                        </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}



