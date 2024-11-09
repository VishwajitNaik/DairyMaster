'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function UserOrdersDetails() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    if (id) {
      fetchOrders();
    }
  }, [id, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/api/orders/getOrders`, {
        params: {
          userId: id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
  
      if (res.status === 200) {
        const ordersData = res.data.data;
        setOrders(ordersData);
        setTotalOrders(ordersData.length);
      } else {
        console.error('Error response:', res);
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };
  

  const handleUpdate = (orderId) => {
    console.log('Update order: ', orderId);
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`/api/orders/deleteOrder/${orderId}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order: ', error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Orders</h1>

      <div className="mb-4">
        <label className="mr-2">Start Date:</label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <label className="mr-2 ml-4">End Date:</label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        <button className="ml-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={fetchOrders}>
          Fetch Orders
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        {orders.length > 0 ? (
          <table className="min-w-full bg-white text-black shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order No</th>
                <th className="py-2 px-4 border-b">User Name</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Kharedi Data</th>
                <th className="py-2 px-4 border-b">Rakkam</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-2 px-4 border-b">{order.orderNo}</td>
                  <td className="py-2 px-4 border-b">{order.username}</td>
                  <td className="py-2 px-4 border-b">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{order.kharediData}</td>
                  <td className="py-2 px-4 border-b">{order.rakkam}</td>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <FontAwesomeIcon icon={faEdit} className="text-yellow-500 cursor-pointer" onClick={() => handleUpdate(order._id)} />
                    <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => handleDelete(order._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="py-2 px-4 border-t font-semibold">Total Orders</td>
                <td className="py-2 px-4 border-t">{totalOrders}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>No orders found for the selected date range.</p>
        )}
      </div>

    </div>
  );
}
