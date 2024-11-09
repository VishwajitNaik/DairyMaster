'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function TenDayBill() {
  const [users, setUsers] = useState([]);
  const [bills, setBills] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalRakkam, setTotalRakkam] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get('/api/user/getUsers');
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching all users:', error.message);
      setError('Error fetching all users');
    }
  };

  const fetchMilkRecordsForUser = async (userId, startDate, endDate) => {
    try {
      const res = await axios.get(`/api/milk/getMilkRecords`, {
        params: {
          userId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return res.data.data;
    } catch (error) {
      console.error(`Error fetching milk records for user ${userId}:`, error.message);
      return [];
    }
  };

  const fetchKapatRates = async () => {
    try {
      const res = await axios.get('/api/kapat/getKapat');
      return res.data.data.filter(item => item.KapatType === 'Sthir Kapat');
    } catch (error) {
      console.error('Failed to fetch kapat options:', error.message);
      return [];
    }
  };

  const fetchBillKapatRates = async () => {
    try {
      const res = await axios.get('/api/billkapat/totalBillKapat', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return res.data.data;
    } catch (error) {
      console.error('Failed to fetch bill kapat rates:', error.message);
      return [];
    }
  };

  const calculateBillForUser = (milkRecords, sthirKapat, billKapatRates) => {
    const morningRecords = milkRecords.filter((record) => record.session === 'morning');
    const eveningRecords = milkRecords.filter((record) => record.session === 'evening');

    const totalMorning = morningRecords.reduce(
      (totals, record) => {
        totals.liters += record.liter;
        totals.rakkam += record.rakkam;
        return totals;
      },
      { liters: 0, rakkam: 0 }
    );

    const totalEvening = eveningRecords.reduce(
      (totals, record) => {
        totals.liters += record.liter;
        totals.rakkam += record.rakkam;
        return totals;
      },
      { liters: 0, rakkam: 0 }
    );

    const totalLiters = totalMorning.liters + totalEvening.liters;
    const totalRakkam = totalMorning.rakkam + totalEvening.rakkam;

    const totalKapat = sthirKapat.reduce((total, item) => {
      return total + (totalLiters * item.kapatRate);
    }, 0);

    const billKapat = billKapatRates.reduce((total, item) => {
      return total + item.rate;
    }, 0);

    const literKapat = Math.floor(totalKapat);
    const netPayment = Math.floor(totalRakkam - literKapat - billKapat);

    return {
      totalMorningLiters: totalMorning.liters,
      totalMorningRakkam: Math.floor(totalMorning.rakkam),
      totalEveningLiters: totalEvening.liters,
      totalEveningRakkam: Math.floor(totalEvening.rakkam),
      totalLiters,
      totalRakkam: Math.floor(totalRakkam),
      literKapat,
      netPayment,
      billkapat: Math.floor(billKapat),
    };
  };

  const generateBills = async () => {
    setLoading(true);
    setError(null);
    const billsData = [];
    const sthirKapat = await fetchKapatRates();
    const billKapatRates = await fetchBillKapatRates();

    for (const user of users) {
      const milkRecords = await fetchMilkRecordsForUser(user._id, startDate, endDate);
      const bill = calculateBillForUser(milkRecords, sthirKapat, billKapatRates);
      billsData.push({ user, ...bill });
    }

    setBills(billsData);

    // Calculate the total Rakkam for all bills
    const totalRakkamSum = billsData.reduce((sum, bill) => sum + bill.totalRakkam, 0);
    setTotalRakkam(totalRakkamSum);

    setLoading(false);
  };

  const handleGenerateBills = () => {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    setStartDate(tenDaysAgo);
    setEndDate(new Date());
    generateBills();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">10-Day Bill Summary for All Users</h1>

      <div className="mb-4">
        <label className="mr-2">Start Date:</label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <label className="mr-2 ml-4">End Date:</label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        <button className="ml-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={handleGenerateBills}>
          Generate Bills
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : bills.length > 0 ? (
          <table className="min-w-full bg-white text-black">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Register No</th>
                <th className="py-2">Milk Type</th>
                <th className="py-2">Total Liters</th>
                <th className="py-2">Total Rakkam</th>
                <th className="py-2">कपात</th>
                <th className="py-2">निव्वळ अदा</th>
                <th className="py-2">बिल कपात</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{bill.user.name}</td>
                  <td className="border px-4 py-2">{bill.user.registerNo}</td>
                  <td className="border px-4 py-2">{bill.user.milk}</td>
                  <td className="border px-4 py-2">{bill.totalLiters}</td>
                  <td className="border px-4 py-2">{bill.totalRakkam}</td>
                  <td className="border px-4 py-2">{bill.literKapat}</td>
                  <td className="border px-4 py-2">{bill.netPayment}</td>
                  <td className="border px-4 py-2">{bill.billkapat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bills to display.</p>
        )}
      </div>
    </div>
  );
}
