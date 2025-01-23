"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

export default function Sabhasad() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getOwnerUsers() {
      try {
        const res = await axios.get("/api/user/getUsers");
        setUsers(res.data.data); // Adjusted to match the response format
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
      }
    }
    getOwnerUsers();
  }, []);

  return (
    <div className="container mx-auto p-4 text-black">
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          सभासद लिस्ट (Sabhasad List)
        </h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm bg-gray-300 border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-2 md:px-4 border-b whitespace-nowrap">Register No</th>
              <th className="py-2 px-2 md:px-4 border-b whitespace-nowrap">Name</th>
              <th className="py-2 px-2 md:px-4 border-b whitespace-nowrap">Milk</th>
              <th className="py-2 px-2 md:px-4 border-b whitespace-nowrap">Phone</th>
              <th className="py-2 px-2 md:px-4 border-b whitespace-nowrap">Bank Name</th>
              <th className="py-2 px-2 md:px-4 border-b whitespace-nowrap">Account No</th>
              <th className="py-2 px-2 md:px-4 border-b whitespace-nowrap">Aadhar No</th>
              <th className="py-2 px-2 md:px-4 border-b whitespace-nowrap">Actions</th>
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
                  <td className="py-2 px-2 md:px-4 border-b">{user.registerNo}</td>
                  <td className="py-2 px-2 md:px-4 border-b">{user.name}</td>
                  <td className="py-2 px-2 md:px-4 border-b">{user.milk}</td>
                  <td className="py-2 px-2 md:px-4 border-b">{user.phone}</td>
                  <td className="py-2 px-2 md:px-4 border-b">{user.bankName}</td>
                  <td className="py-2 px-2 md:px-4 border-b">{user.accountNo}</td>
                  <td className="py-2 px-2 md:px-4 border-b">{user.aadharNo}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/home/BillKapatSabhasad_List/${user._id}`}>
                    <div className="flex items-center space-x-4 bg-blue-400 text-center justify-center p-2 rounded-s-md m-2 hover:bg-blue-600">
                      <Image
                        src="/assets/monycut.png"
                        alt="View"
                        width={24}
                        height={24}
                        className="rounded-full object-cover hover:scale-110 transition-transform"
                      />
                      </div>
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
