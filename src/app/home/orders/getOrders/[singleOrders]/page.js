"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const router = useRouter();
  
  // Extract the order ID from the URL
  const { query } = router;
  const orderId = query.id;

  useEffect(() => {
    if (!orderId) return;

    async function getOrderDetails() {
      try {
        const res = await axios.get(`/api/orders/getOrder/${orderId}`);
        console.log(res.data);
        setOrder(res.data.data);
      } catch (error) {
        console.log("Failed to fetch order details:", error.message);
      }
    }

    getOrderDetails();
  }, [orderId]);

  return (
    <div className="container text-black mx-auto mt-6">
      <div className="flex justify-center mb-6">
        <h1 className="text-4xl font-bold text-white">Order Details</h1>
      </div>
      {order ? (
        <div className="bg-white border border-gray-200 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Order Information</h2>
          <p><strong>Order No:</strong> {order.orderNo}</p>
          <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
          <p><strong>Kharedi Data:</strong> {order.kharediData}</p>
          <p><strong>Rakkam:</strong> {order.rakkam}</p>
          <Link href="/home/orders">
            <button className='bg-blue-400 hover:bg-blue-700 rounded-md p-2 mt-4'>Back to Orders</button>
          </Link>
        </div>
      ) : (
        <p className="text-center">Loading order details...</p>
      )}
    </div>
  );
}
