'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

  // fetch milk records

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
    <div className="gradient-bg flex flex-col items-center justify-center min-h-screen">
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="bg-white text-black shadow-md rounded-lg p-4 mb-4 flex items-center">
        <Image
          src="/assets/avatar.jpg" 
          alt={user.name}
          width={100}
          height={100}
          className="w-20 h-20 rounded-full mr-4"
        />  
        <div>
          <p>
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">Register No:</span> {user.registerNo}
          </p>
          <p>
            <span className="font-semibold">Milk Type:</span> {user.milk}
          </p>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-2">Milk Records</h2>

      <div className="mb-6 flex items-center justify-center space-x-4">
  <div className="flex items-center space-x-2">
    <label className="text-black font-semibold">Start Date:</label>
    <DatePicker 
      className="text-black border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      selected={startDate} 
      onChange={(date) => setStartDate(date)} 
    />
  </div>

  <div className="flex items-center space-x-2">
    <label className="text-black font-semibold">End Date:</label>
    <DatePicker 
      className="text-black border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      selected={endDate} 
      onChange={(date) => setEndDate(date)} 
    />
  </div>

  <button
    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    onClick={fetchMilkRecords}
  >
    Fetch Records
  </button>
</div>


      <div className="flex justify-between">
        <div className="w-1/2 pr-2">
          <h3 className="text-lg font-semibold mb-2">Morning Records</h3>
          {morningRecords.length > 0 ? (
            <table className="min-w-full bg-white text-black shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Liter</th>
                  <th className="py-2 px-4 border-b">Fat</th>
                  <th className="py-2 px-4 border-b">SNF</th>
                  <th className="py-2 px-4 border-b">Dar</th>
                  <th className="py-2 px-4 border-b">Rakkam</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {morningRecords.map((record) => (
                  <tr key={record._id}>
                    <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{record.liter}</td>
                    <td className="py-2 px-4 border-b">{record.fat}</td>
                    <td className="py-2 px-4 border-b">{record.snf}</td>
                    <td className="py-2 px-4 border-b">{record.dar}</td>
                    <td className="py-2 px-4 border-b">{record.rakkam}</td>
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <FontAwesomeIcon icon={faEdit} className="text-yellow-500 cursor-pointer" onClick={() => handleUpdate(record._id)} />
                      <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => handleDelete(record._id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="py-2 px-4 border-t font-semibold">Total</td>
                  <td className="py-2 px-4 border-t">{totalMorningLiters.toFixed(2)}</td>
                  <td className="py-2 px-4 border-t">{totalMorningRakkam.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <p>No morning records found.</p>
          )}
        </div>
        <div className="w-1/2 pl-2">
          <h3 className="text-lg font-semibold mb-2">Evening Records</h3>
          {eveningRecords.length > 0 ? (
            <table className="min-w-full bg-white text-black shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>  
                  <th className="py-2 px-4 border-b">Liter</th>
                  <th className="py-2 px-4 border-b">Fat</th>
                  <th className="py-2 px-4 border-b">Dar</th>
                  <th className="py-2 px-4 border-b">Rakkam</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {eveningRecords.map((record) => (
                  <tr key={record._id}>
                    <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{record.liter}</td>
                    <td className="py-2 px-4 border-b">{record.fat}</td>
                    <td className="py-2 px-4 border-b">{record.dar}</td>
                    <td className="py-2 px-4 border-b">{record.rakkam}</td>
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <FontAwesomeIcon icon={faEdit} className="text-yellow-500 cursor-pointer" onClick={() => handleUpdate(record._id)} />
                      <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => handleDelete(record._id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="py-2 px-4 border-t font-semibold">Total</td>
                  <td className="py-2 px-4 border-t">{totalEveningLiters.toFixed(2)}</td>
                  <td className="py-2 px-4 border-t">{totalEveningRakkam.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <p>No evening records found.</p>
          )}
        </div>
      </div>

      <div className="bg-white text-black shadow-md rounded-lg p-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">Sthir Kapat</h3>
        {kapat.length > 0 ? (
          <table className="min-w-full bg-white text-black shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Kapat</th>
                <th className="py-2 px-4 border-b">रक्कम प्रति लिटर </th>
                <th className="py-2 px-4 border-b">कपात</th>
              </tr>
            </thead>
            <tbody>
              {kapat.map((item) => (
                <tr key={item._id}>
                  <td className="py-2 px-4 border-b">{item.kapatName}</td>
                  <td className="py-2 px-4 border-b">{item.kapatRate}</td>
                  <td className="py-2 px-4 border-b">{(totalLiters * item.kapatRate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" className="py-2 px-4 border-t font-semibold">Total कपात</td>
                <td className="py-2 px-4 border-t">{literKapat.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p>No Sthir Kapat records found.</p>
        )}
      </div>


      <div className="mt-4 p-4 bg-white text-black shadow-md rounded-lg">
        <p>
          <span className="font-semibold">Total Liters:</span> {totalLiters.toFixed(2)}
        </p>
        <p>
          <span className="font-semibold">Total Rakkam:</span> {totalRakkam}
        </p>
        <p>
          <span className="font-semibold">कपात :</span> {literKapat}
        </p>
        <p>
          <span className="font-semibold">निव्वळ अदा :</span> {netPayment}
        </p>
      </div>
    </div>
    </div>
  );
}
