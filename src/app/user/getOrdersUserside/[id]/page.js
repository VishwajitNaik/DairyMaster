"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function UserMilkDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [advanceData, setAdvanceData] = useState([]);
    const [billKapat, setBillKapat] = useState([]);
    
    // State for totals
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalAdvance, setTotalAdvance] = useState(0);
    const [totalBillKapat, setTotalBillKapat] = useState(0);
    const [totalDifference, setTotalDifference] = useState(0); // State for totalDifference

    const fetchData = useCallback(async (url, params, setData, setTotal) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(url, { params });
            const { data } = response.data;
            setData(data);
            const total = data.reduce((acc, item) => acc + (item.rakkam || item.rate), 0);
            setTotal(total);
        } catch (err) {
            setError(`Failed to fetch data from ${url}`);
            console.error(`Error fetching data from ${url}:`, err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            const params = { userId: id };  // No date range filter here
            fetchData('/api/orders/afterKapatordersUserSide', params, setOrderData, setTotalOrders);
            fetchData('/api/advance/GetAdvanceUserSide', params, setAdvanceData, setTotalAdvance);
            fetchData('/api/billkapat/getBillKapatUserSide', params, setBillKapat, setTotalBillKapat);
        }
    }, [id, fetchData]);

    // Calculate totalDifference whenever the totals change
    useEffect(() => {
        setTotalDifference(totalOrders - totalAdvance - totalBillKapat);
    }, [totalOrders, totalAdvance, totalBillKapat]);

    return (
        <div className='gradient-bg flex flex-col items-center justify-center min-h-screen p-4'>
            <div className="container mx-auto shadow-gray-800 shadow-lg rounded-lg p-6">
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                <h1 className="text-2xl font-bold mb-4 text-gray-800">खरेदी डाटा</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-300">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">तारीख </th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">दूध प्रकार </th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">खरेदी प्रकार </th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">रक्कम </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderData.length > 0 ? orderData.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{order.milktype}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{order.kharediData}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{order.rakkam}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-2 px-4 border-b text-center text-sm text-gray-500">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100">
                                <td colSpan="3" className="py-2 px-4 text-right text-sm font-semibold text-gray-700 bg-blue-300">Total Orders</td>
                                <td className="py-2 px-4 text-sm font-semibold text-gray-700 bg-blue-400">{totalOrders}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <h1 className='text-2xl font-bold my-4 text-gray-800'>अडवांस जमा</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-300">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">तारीख </th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">दूध प्रकार </th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">रक्कम</th>
                            </tr>
                        </thead>
                        <tbody>
                            {advanceData.length > 0 ? advanceData.map((adv) => (
                                <tr key={adv._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{new Date(adv.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{adv.milktype}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{adv.rakkam}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="py-2 px-4 border-b text-center text-sm text-gray-500">No advance data available</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100">
                                <td colSpan="2" className="py-2 px-4 text-right text-sm font-semibold text-gray-700 bg-blue-300">Total Advances</td>
                                <td className="py-2 px-4 text-sm font-semibold text-gray-700 bg-blue-400">{totalAdvance}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <h1 className='text-2xl font-bold my-4 text-gray-800'>बिल कपात</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-300">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">तारीख </th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">दूध प्रकार </th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">रक्कम</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billKapat.length > 0 ? billKapat.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{item.milktype}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-700">{item.rate}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="py-2 px-4 border-b text-center text-sm text-gray-500">No Bill Kapat data available</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100">
                                <td colSpan="2" className="py-2 px-4 text-right text-sm font-semibold text-gray-700 bg-blue-300">Total Bill Kapat</td>
                                <td className="py-2 px-4 text-sm font-semibold text-gray-700 bg-blue-400">{totalBillKapat}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="flex flex-col items-start bg-gray-300 p-6 rounded-lg shadow-md w-fit mt-4 animate-zoom">
                <h2 className="text-xl font-bold text-black">बाकी रक्कम</h2>
                <p className="text-gray-700 mt-2 text-2xl">{totalDifference}</p>
                </div>


            </div>
        </div>
    );
}
