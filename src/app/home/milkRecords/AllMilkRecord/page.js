"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Sabhasad() {
  const [milk, setMilk] = useState([]);

  useEffect(() => {
    async function getUserMilks() {
      try {
        const res = await axios.get('/api/milk/getMilkRecords');
        console.log(res.data);
        setMilk(res.data.data);
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
      }
    }
    getUserMilks();
  }, []);

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
    <div className="container text-black mx-auto mt-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-4xl font-bold">दुधाची लिस्ट</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">Register No</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Session</th>
              <th className="py-2 px-4 border-b">लिटर </th>
              <th className="py-2 px-4 border-b">फॅट</th>
              <th className="py-2 px-4 border-b">SNF</th>
              <th className="py-2 px-4 border-b">दर </th>
              <th className="py-2 px-4 border-b">रक्कम </th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {milk.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-2 px-4 border-b text-center">
                  कोणतेही दूध मिळालेले नाही 
                </td>
              </tr>
            ) : (
              milk.map((record, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{record.registerNo}</td>
                  <td className="py-2 px-4 border-b">{record.name}</td>
                  <td className="py-2 px-4 border-b">{record.session}</td>
                  <td className="py-2 px-4 border-b">{record.liter}</td>
                  <td className="py-2 px-4 border-b">{record.fat}</td>
                  <td className="py-2 px-4 border-b">{record.snf}</td>
                  <td className="py-2 px-4 border-b">{record.dar}</td>
                  <td className="py-2 px-4 border-b">{record.rakkam}</td>
                  <td className="py-2 px-4 border-b">
                    <Link href={`/home/milkRecords/AllMilkRecord/${record._id}`}>
                      <button className='bg-blue-400 hover:bg-blue-700 rounded-md p-1'>User Details</button>
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
