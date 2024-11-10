'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function UserMilkDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [orderData, setOrderData] = useState([]);
    const [advanceData, setAdvanceData] = useState([]);
    const [billKapat, setBillKapat] = useState([]);
    
    // State for totals
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalAdvance, setTotalAdvance] = useState(0);
    const [totalBillKapat, setTotalBillKapat] = useState(0);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/orders/afterKapatordersUserSide`, {
                params: {
                    userId: id,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                }
            });

            const { data } = response.data;
            setOrderData(data);

            const total = data.reduce((acc, order) => acc + order.rakkam, 0);
            setTotalOrders(total);
        } catch (err) {
            setError('Failed to fetch order data');
            console.error('Error fetching order data:', err);
        } finally {
            setLoading(false);
        }
    }, [id, startDate, endDate]);

    useEffect(() => {
        if (id) {
            fetchOrders();
        }
    }, [id, startDate, endDate, fetchOrders]);

    const fetchAdvance = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/advance/GetAdvanceUserSide`, {
                params: {
                    userId: id,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                },
            });

            const fetchedData = res.data.data || [];
            setAdvanceData(fetchedData);

            const total = fetchedData.reduce((acc, adv) => acc + adv.rakkam, 0);
            setTotalAdvance(total);
        } catch (err) {
            setError('Failed to fetch advance data');
            console.error('Error fetching advance data:', err);
        } finally {
            setLoading(false);
        }
    }, [id, startDate, endDate]);

    useEffect(() => {
        if (id) {
            fetchAdvance();
        }
    }, [id, startDate, endDate, fetchAdvance]);

    const fetchBillkapat = useCallback(async () => {
        if (startDate && endDate) {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/billkapat/getBillKapat', {
                    params: {
                        userId: id,
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                    },
                });
                const data = response.data.data || [];
                setBillKapat(data);

                const total = data.reduce((acc, item) => acc + item.rate, 0);
                setTotalBillKapat(total);
            } catch (err) {
                setError('Failed to fetch bill kapat data');
                console.error('Error fetching bill kapat data:', err);
            } finally {
                setLoading(false);
            }
        } else {
            setError('Please select both start and end dates.');
            setLoading(false);
        }
    }, [id, startDate, endDate]);

    useEffect(() => {
        if (id) {
            fetchBillkapat();
        }
    }, [id, startDate, endDate, fetchBillkapat]);

    const totalDifference = totalOrders - totalAdvance - totalBillKapat;

    return (
        <div className='gradient-bg flex flex-col items-center justify-center min-h-screen'>
        <div className="container mx-auto p-4">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <div className="flex space-x-4 mb-4 text-black">
                <div>
                    <label className="block mb-1">Start Date</label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
                <div>
                    <label className="block mb-1">End Date</label>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <button
                    onClick={fetchOrders}
                    className="bg-blue-500 text-white p-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Fetch Orders'}
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-4">खरेदी डाटा </h1>
            <table className="min-w-full rounded-md bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-black">Date</th>
                        <th className="py-2 px-4 border-b text-black">Milk Type</th>
                        <th className="py-2 px-4 border-b text-black">Purchase Data</th>
                        <th className="py-2 px-4 border-b text-black">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {orderData.length > 0 ? (
                        orderData.map((order) => (
                            <tr key={order._id}>
                                <td className="py-2 px-4 border-b text-black">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b text-black">{order.milktype}</td>
                                <td className="py-2 px-4 border-b text-black">{order.kharediData}</td>
                                <td className="py-2 px-4 border-b text-black">{order.rakkam}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="py-2 px-4 border-b text-center" colSpan="4">
                                No orders found.
                            </td>
                        </tr>
                    )}
                </tbody>
                {/* Total Orders row */}
                <tfoot>
                    <tr>
                        <td colSpan="3" className="py-2 px-4 font-bold text-right bg-slate-500 text-black">Total Orders</td>
                        <td className="py-2 px-4 text-black font-bold bg-slate-400">{totalOrders}</td>
                    </tr>
                </tfoot>
            </table>

            <h1 className='text-2xl font-bold m-4'>अडवांस जमा </h1>
            <div className="bg-white p-4 shadow-md rounded-md text-black">
                {advanceData && advanceData.length > 0 ? (
                    <table className="w-full rounded-md text-left table-auto border-collapse border border-gray-200 text-black">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Date</th>
                                <th className="border px-4 py-2">Milk Type</th>
                                <th className="border px-4 py-2">Amount (रक्कम)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {advanceData.map((adv) => (
                                <tr key={adv._id}>
                                    <td className="border px-4 py-2">{new Date(adv.date).toLocaleDateString()}</td>
                                    <td className="border px-4 py-2">{adv.milktype}</td>
                                    <td className="border px-4 py-2">{adv.rakkam}</td>
                                </tr>
                            ))}
                        </tbody>
                        {/* Total Advances row */}
                        <tfoot>
                            <tr>
                                <td colSpan="2" className="bg-gray-500 py-2 px-4 text-right font-bold">Total Advances</td>
                                <td className="py-2 px-4 text-black bg-gray-600 font-bold">{totalAdvance}</td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <p>No advance data available</p>
                )}
            </div>

            <h1 className='text-2xl font-bold m-4'>बिल कपात </h1>
            {billKapat.length > 0 ? (
                <table className="w-full rounded-md text-left bg-white table-auto border-collapse border border-gray-200 text-black">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Date</th>
                            <th className="border px-4 py-2">Milk Type</th>
                            <th className="border px-4 py-2">Amount (रक्कम)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billKapat.map((item) => (
                            <tr key={item._id}>
                                <td className="border px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="border px-4 py-2">{item.milktype}</td>
                                <td className="border px-4 py-2">{item.rate}</td>
                            </tr>
                        ))}
                    </tbody>
                    {/* Total Bill Kapat row */}
                    <tfoot>
                        <tr>
                            <td colSpan="2" className="bg-gray-500 py-2 px-4 text-right font-bold">Total Bill Kapat</td>
                            <td className="py-2 px-4 text-black bg-gray-600 font-bold">{totalBillKapat}</td>
                        </tr>
                    </tfoot>
                </table>
            ) : (
                <p>No Bill Kapat data available</p>
            )}

            <h2 className="text-xl font-bold mt-4">Total Difference (Orders - Advances - Bill Kapat)</h2>
            <p>{totalDifference}</p>
        </div>
        </div>
    );
}
