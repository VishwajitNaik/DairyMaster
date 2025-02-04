
'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '@/app/components/Navebars/UserNavebar';
import Loading from '@/app/components/Loading/Loading';
import Image from 'next/image';

export default function UserMilkDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [morningRecords, setMorningRecords] = useState([]);
  const [eveningRecords, setEveningRecords] = useState([]);
  const [totalMorningLiters, setTotalMorningLiters] = useState(0);
  const [totalMorningRakkam, setTotalMorningRakkam] = useState(0);
  const [totalEveningLiters, setTotalEveningLiters] = useState(0);
  const [totalEveningRakkam, setTotalEveningRakkam] = useState(0);
  const [totalLiters, setTotalLiters] = useState(0);
  const [totalRakkam, setTotalRakkam] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [literKapat, setLiterKapat] = useState(0);
  const [netPayment, setNetPayment] = useState(0);
  const [kapat, setKapat] = useState([])



// Get kapat options
  useEffect(() => {
    async function getKapatOptions() {
      try {
        const res = await axios.get('/api/kapat/getkapatUserISide');
        const sthirKapat = res.data.data.filter(item => item.KapatType === 'Sthir Kapat');
       setKapat(sthirKapat)

        const totalKapat = sthirKapat.reduce((total, item) => {
          return total + (totalLiters * item.kapatRate);
        }, 0);
        setLiterKapat(Math.floor(totalKapat));
        setNetPayment(totalRakkam - totalKapat);
      } catch (error) {
        console.log("Failed to fetch kapat options:", error.message);
      }
    }
    getKapatOptions();
  }, [totalLiters, totalRakkam]);


  const fetchMilkRecords = useCallback(async () => {
    try {
      const milkRes = await axios.get(`/api/milk/getMilkRecords`, {
        params: {
          userId: id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      const milkRecords = milkRes.data.data;
      const morning = milkRecords.filter((record) => record.session === 'morning');
      const evening = milkRecords.filter((record) => record.session === 'evening');

      setMorningRecords(morning);
      setEveningRecords(evening);

      const totalMorning = morning.reduce(
        (totals, record) => {
          totals.liters += record.liter;
          totals.rakkam += record.rakkam;
          return totals;
        },
        { liters: 0, rakkam: 0 }
      );

      const totalEvening = evening.reduce(
        (totals, record) => {
          totals.liters += record.liter;
          totals.rakkam += record.rakkam;
          return totals;
        },
        { liters: 0, rakkam: 0 }
      );

      setTotalMorningLiters(totalMorning.liters);
      setTotalMorningRakkam(Math.floor(totalMorning.rakkam));
      setTotalEveningLiters(totalEvening.liters);
      setTotalEveningRakkam(Math.floor(totalEvening.rakkam));

      setTotalLiters(totalMorning.liters + totalEvening.liters);
      setTotalRakkam(Math.floor(totalMorning.rakkam) + Math.floor(totalEvening.rakkam));
    } catch (error) {
      console.error('Error fetching milk records:', error.message);
    }
  }, [id, startDate, endDate]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`/api/user/getUsers/${id}`);
        setUser(res.data.data);
        fetchMilkRecords();
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    if (id) fetchUserDetails();
  }, [id, fetchMilkRecords]);


  const handleUpdate = (recordId) => {
    console.log('Update record: ', recordId);
  };

  

  if (!user) {
    return <div><Loading /></div>;
  }

  return (
<>
  <Navbar />
  <div className="gradient-bg flex flex-col items-center justify-center min-h-screen p-4">
  <div className="w-full md:w-11/12 lg:w-10/12 xl:w-8/12">
        <h1 className="text-2xl font-bold mb-4">उत्पादक माहिती </h1>
        <div className="bg-transperent text-black shadow-md rounded-lg p-4 mb-4 flex items-center">
          <Image
            src="/assets/avatar.png" 
            alt={user.name}
            width={100}
            height={100}
            className="w-20 h-20 rounded-full mr-4"
          />  
          <div className='bg-gray-300 opacity-90 rounded-lg p-4'>
            <p>
              <span className="font-semibold">उत्पादक नाव - </span> {user.name}
            </p>
            <p>
              <span className="font-semibold">रजि. नं - </span> {user.registerNo}
            </p>
            <p>
              <span className="font-semibold">दूध प्रकार - </span> {user.milk}
            </p>
          </div>
        </div>

    <h2 className="text-lg md:text-xl font-semibold mb-2">Milk Records</h2>

    {/* Date Picker */}
    <div className="mb-4 flex flex-col md:flex-row items-center">
      <label className="text-sm md:text-base mr-2">Start Date:</label>
      <DatePicker
        className="text-black p-2 font-mono mr-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-36 bg-gray-200 rounded-md shadow-sm pr-10"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
      <label className="text-sm md:text-base mr-2 md:ml-4">End Date:</label>
      <DatePicker
        className="text-black p-2 font-mono mr-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-36 bg-gray-200 rounded-md shadow-sm pr-10"
        selected={endDate}
        onChange={(date) => setEndDate(date)}
      />
      <button
        className="w-full sm:w-auto mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        onClick={fetchMilkRecords}
      >
        पहा
      </button>
    </div>

    <div className="flex flex-col md:flex-row">
      {/* Morning Records */}
      <div className="w-full md:w-1/2 mb-4 md:mb-0 md:pr-2">
        <h3 className="text-center text-xl font-semibold bg-gray-700 text-white py-3 rounded-t-lg">🐃 सकाळचे दूध विवरण 🐄</h3>
        <div className="overflow-x-auto w-full">
        <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: black;
          border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom right, #4a90e2, #9013fe);
          border-radius: 10px;
        }
      `}</style>
          {morningRecords.length > 0 ? (
            <table className="min-w-full bg-white text-black shadow-md rounded-lg text-xs lg:text-base">
        <thead className="bg-gray-300 shadow-md">
          <tr>
            <th className="py-2 px-4 border-b">दिनांक</th>
            <th className="py-2 px-4 border-b">लिटर </th>
            <th className="py-2 px-4 border-b">फॅट </th>
            <th className="py-2 px-4 border-b">SNF</th>
            <th className="py-2 px-4 border-b">दर </th>
            <th className="py-2 px-4 border-b">रक्कम </th>
          </tr>
        </thead>
        <tbody>
          {morningRecords.map((record) => (
            <tr key={record._id} className="hover:bg-gray-200">
              <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{record.liter}</td>
              <td className="py-2 px-4 border-b">{record.fat}</td>
              <td className="py-2 px-4 border-b">{record.snf}</td>
              <td className="py-2 px-4 border-b">{record.dar}</td>
              <td className="py-2 px-4 border-b">{record.rakkam}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="py-2 px-4 border-t font-semibold">
              Total
            </td>
            <td className="py-2 px-4 border-t font-semibold">{totalMorningLiters.toFixed(2)}</td>
            <td className="py-2 px-4 border-t font-semibold">{totalMorningRakkam.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
          ) : (
            <p>सकाळचे दूध मिळाले नाही .</p>
          )}
        </div>
      </div>

      {/* Evening Records */}
      <div className="w-full md:w-1/2 md:pl-2">
        <h3 className="text-center text-xl font-semibold bg-gray-700 text-white py-3 rounded-t-lg">🐃 संध्याकाळचे दूध विवरण 🐄</h3>
        <div className="overflow-x-auto w-full">
        <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: black;
          border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom right, #4a90e2, #9013fe);
          border-radius: 10px;
        }
      `}</style>
          {eveningRecords.length > 0 ? (
            <table className="min-w-full bg-white text-black shadow-md rounded-lg text-xs lg:text-base">
        <thead className="bg-gray-300 shadow-md">
          <tr>
            <th className="py-2 px-4 border-b">दिनांक</th>
            <th className="py-2 px-4 border-b">लिटर </th>
            <th className="py-2 px-4 border-b">फॅट </th>
            <th className="py-2 px-4 border-b">SNF</th>
            <th className="py-2 px-4 border-b">दर </th>
            <th className="py-2 px-4 border-b">रक्कम </th>
          </tr>
        </thead>
        <tbody className="bg-gray-100">
          {eveningRecords.map((record) => (
            <tr key={record._id} className="hover:bg-gray-200">
              <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{record.liter}</td>
              <td className="py-2 px-4 border-b">{record.fat}</td>
              <td className="py-2 px-4 border-b">{record.snf}</td>
              <td className="py-2 px-4 border-b">{record.dar}</td>
              <td className="py-2 px-4 border-b">{record.rakkam}</td>

            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="py-2 px-4 border-t font-semibold">
              Total
            </td>
            <td className="py-2 px-4 border-t font-semibold">{totalEveningLiters.toFixed(2)}</td>
            <td className="py-2 px-4 border-t font-semibold">{totalEveningLiters.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
          ) : (
            <p>संध्याकाळचे दूध मिळाले नाही .</p>
          )}
        </div>
      </div>
    </div>

    {/* Footer Totals */}
    <div className="mt-4 p-4 bg-white text-black shadow-md rounded-lg">
  <table className="min-w-full table-auto border-collapse">
    <thead>
      <tr>
        <th className="px-4 py-2 border-b font-semibold text-left">विवरण</th>
        <th className="px-4 py-2 border-b font-semibold text-left">मूल्य</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="px-4 py-2 border-b">एकूण लिटर</td>
        <td className="px-4 py-2 border-b">{totalLiters.toFixed(2)}</td>
      </tr>
      <tr>
        <td className="px-4 py-2 border-b">एकूण रक्कम</td>
        <td className="px-4 py-2 border-b">{totalRakkam}</td>
      </tr>
      <tr>
        <td className="px-4 py-2 border-b">कपात</td>
        <td className="px-4 py-2 border-b">{literKapat}</td>
      </tr>
      <tr>
        <td className="px-4 py-2 font-semibold">निव्वळ अदा</td>
        <td className="px-4 py-2 font-semibold">{netPayment}</td>
      </tr>
    </tbody>
  </table>
</div>
  </div>
</div>

</>


  );
}
