
'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '@/app/components/Navebars/UserNavebar';

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
        const res = await axios.get('/api/kapat/getKapat');
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

  const handleDelete = async (recordId) => {
    try {
      // Adjusting the delete request to use query parameters
      await axios.delete(`/api/milk/deleteMilkRecord?id=${recordId}`);
  
      // Update the state by removing the deleted record
      setMorningRecords((prevRecords) => prevRecords.filter((record) => record._id !== recordId));
      setEveningRecords((prevRecords) => prevRecords.filter((record) => record._id !== recordId));
      
      // Fetch the updated milk records after deletion
      fetchMilkRecords();
    } catch (error) {
      console.error('Error deleting milk record: ', error.message);
    }
  };
  

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
<>
  <Navbar />
  <div className='gradient-bg flex flex-col items-center justify-center min-h-screen'>
    <div className="w-full md:w-11/12 lg:w-10/12 xl:w-8/12 p-4">
      <h1 className="text-lg md:text-2xl font-bold mb-4">User Details</h1>
      
      <div className="bg-white text-black shadow-md rounded-lg p-3 mb-4">
        <p className="text-sm md:text-base">
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p className="text-sm md:text-base">
          <span className="font-semibold">Register No:</span> {user.registerNo}
        </p>
        <p className="text-sm md:text-base">
          <span className="font-semibold">Milk Type:</span> {user.milk}
        </p>
      </div>

      <h2 className="text-lg md:text-xl font-semibold mb-2">Milk Records</h2>

      <div className="mb-4 flex flex-col md:flex-row items-center">
        <label className="text-sm md:text-base mr-2">Start Date:</label>
        <DatePicker className='text-black' selected={startDate} onChange={(date) => setStartDate(date)} />
        <label className="text-sm md:text-base mr-2 ml-4">End Date:</label>
        <DatePicker className='text-black' selected={endDate} onChange={(date) => setEndDate(date)} />
        <button className="mt-2 md:mt-0 ml-0 md:ml-4 bg-blue-500 text-white py-1 px-3 rounded text-sm md:text-base" onClick={fetchMilkRecords}>
          Fetch Records
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Morning Records */}
        <div className="w-full md:w-1/2 mb-4 md:mb-0 md:pr-2">
          <h3 className="text-md md:text-lg font-semibold mb-2">Morning Records</h3>
          <div className="overflow-x-auto">
            {morningRecords.length > 0 ? (
              <table className="min-w-full bg-white text-black shadow-md rounded-lg">
                <thead>
                  <tr>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">Date</th>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">Liter</th>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">Fat</th>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">SNF</th>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">Dar</th>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">Rakkam</th>
                  </tr>
                </thead>
                <tbody>
                  {morningRecords.map((record) => (
                    <tr key={record._id}>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{record.liter}</td>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{record.fat}</td>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{record.snf}</td>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{record.dar}</td>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{record.rakkam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xs md:text-base">No morning records found.</p>
            )}
          </div>
        </div>

        {/* Evening Records */}
        <div className="w-full md:w-1/2 md:pl-2">
          <h3 className="text-md md:text-lg font-semibold mb-2">Evening Records</h3>
          <div className="overflow-x-auto">
            {eveningRecords.length > 0 ? (
              <table className="min-w-full bg-white text-black shadow-md rounded-lg">
                <thead>
                  <tr>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">Date</th>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">Liter</th>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">Fat</th>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">SNF</th>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">Dar</th>
                    <th className="py-2 px-3 border-b text-xs md:text-sm">Rakkam</th>
                   
                  </tr>
                </thead>
                <tbody>
                  {eveningRecords.map((record) => (
                    <tr key={record._id}>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{record.liter}</td>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{record.fat}</td>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{record.snf}</td>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{record.dar}</td>
                      <td className="py-1 px-3 border-b text-xs md:text-sm">{record.rakkam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xs md:text-base">No evening records found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Totals */}
      <div className="bg-white text-black shadow-md rounded-lg p-3 mt-4">
        <p className="text-sm md:text-base">
          <span className="font-semibold">Total Liters:</span> {totalLiters.toFixed(2)}
        </p>
        <p className="text-sm md:text-base">
          <span className="font-semibold">Total Rakkam:</span> {totalRakkam}
        </p>
        <p className="text-sm md:text-base">
          <span className="font-semibold">कपात :</span> {literKapat}
        </p>
        <p className="text-sm md:text-base">
          <span className="font-semibold">निव्वळ अदा :</span> {netPayment}
        </p>
      </div>
    </div>
  </div>
</>


  );
}
