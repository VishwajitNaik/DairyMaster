'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import Loading from '@/app/components/Loading/Loading';
import { FaCalendarAlt } from 'react-icons/fa'; // Importing calendar icon from react-icons

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
  const [selectedKapat, setSelectedKapat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchMilkRecords = useCallback(async () => {
    try {
      const milkRes = await axios.get(`/api/milk/getMilkRecords`, {
        params: {
          userId: id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
  
      let milkRecords = milkRes.data.data;
  
      // Optional: Sort records by date in ascending order (if needed)
      milkRecords = milkRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
  
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

  // fetch milk records
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

  useEffect(() => {
    const fetchSelectedKapat = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/kapat/getKapatByIds`, {
          params: { userId: id }, // Pass userId to the backend
        });
  
        // Check if the response data is valid
        if (response.data && response.data.data) {
          const fetchedKapat = response.data.data;
          setSelectedKapat(fetchedKapat); // Populate selectedKapat state with fetched data
  
          // Calculate total Kapat rate
          const totalKapatRate = fetchedKapat.reduce((total, kapat) => total + kapat.kapatRate, 0);
          
          // Calculate the total Kapat value (liter * rate) for each Kapat item
          const totalKapat = fetchedKapat.reduce((total, kapat) => total + (totalLiters * kapat.kapatRate), 0);
          
          // Update the state for literKapat and netPayment
          setLiterKapat(totalKapat.toFixed(2)); // Store total Kapat value
          setNetPayment((totalRakkam - totalKapat).toFixed(2)); // Calculate net payment
  
        } else {
          setError('No selectedKapat found for this user');
        }
      } catch (err) {
        console.error('Error fetching selectedKapat:', err);
        setError('Failed to fetch selectedKapat');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSelectedKapat();
  }, [id, totalLiters, totalRakkam]); // Trigger fetch when `id`, `totalLiters`, or `totalRakkam` change
  
  // Calculate total of all kapatRates and format it to 2 decimal places
  const totalKapatRate = selectedKapat.reduce((total, kapat) => total + kapat.kapatRate, 0).toFixed(2);


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
    return <div><Loading /></div>;
  }

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <div className="container mx-auto p-4">
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
        <h2 className="text-xl font-semibold mb-2 bg-transparent shadow-md rounded-lg p-4 w-fit">दूध विवरण</h2>

        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
    <label className="text-black font-semibold">Start Date:</label>
    <div className="relative">
      <DatePicker
        className="text-black p-2 font-mono mr-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-36 bg-gray-200 rounded-md shadow-sm pr-10" // Added pr-10 to give space for icon on the right
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="dd-MM-yyyy"
      />
      <FaCalendarAlt
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
        size={20}
      />
    </div>

  </div>

  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
    <label className="text-black font-semibold">End Date:</label>
    <div className="relative">
    <DatePicker
      className="text-black p-2 font-mono mr-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-36 bg-gray-200 rounded-md shadow-sm"
      selected={endDate}
      onChange={(date) => setEndDate(date)}
       dateFormat="dd-MM-yyyy"
    />
          <FaCalendarAlt
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
        size={20}
      />
    </div>
  </div>

  <button
    className="w-full sm:w-auto mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    onClick={fetchMilkRecords}
  >
    पहा 
  </button>
</div>



<div className="flex flex-col lg:flex-row justify-between">
  <div className="w-full lg:w-1/2 lg:pr-2 mb-4 lg:mb-0">
    <h3 className="text-lg font-semibold mb-2 bg-transparent shadow-md rounded-lg p-4">सकाळचे दूध विवरण</h3>
    {morningRecords.length > 0 ? (
      <div className="overflow-x-auto max-w-lg">
      <style jsx>{`
        .max-w-lg::-webkit-scrollbar {
          height: 8px; /* Adjust the height of the scrollbar */
        }
        .max-w-lg::-webkit-scrollbar-track {
          background: black; /* Optional: Change track background */
          border-radius: 10px;
        }
        .max-w-lg::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom right, #4a90e2, #9013fe); /* Set the scrollbar color to black */
          border-radius: 10px; /* Optional: Add rounded corners */
        }
      `}</style>
        <table className="min-w-full bg-white text-black shadow-md rounded-lg text-xs lg:text-base">
          <thead className='bg-gray-300 shadow-md'>
            <tr>
              <th className="py-2 px-4 border-b">दिनांक</th>
              <th className="py-2 px-4 border-b">लिटर </th>
              <th className="py-2 px-4 border-b">फॅट </th>
              <th className="py-2 px-4 border-b">SNF</th>
              <th className="py-2 px-4 border-b">दर </th>
              <th className="py-2 px-4 border-b">रक्कम </th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {morningRecords.map((record) => (
              <tr key={record._id} className='hover:bg-gray-200'>
                <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{record.liter}</td>
                <td className="py-2 px-4 border-b">{record.fat}</td>
                <td className="py-2 px-4 border-b">{record.snf}</td>
                <td className="py-2 px-4 border-b">{record.dar}</td>
                <td className="py-2 px-4 border-b">{record.rakkam}</td>
                <td className="py-2 px-4 border-b flex space-x-2">
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 cursor-pointer py-2 px-4"
                    onClick={() => handleDelete(record._id)}
                  />
                </td>
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
      </div>
    ) : (
      <p>सकाळचे दूध मिळाले नाही .</p>
    )}
  </div>
  <div className="w-full lg:w-1/2 lg:pr-2 mb-4 lg:mb-0">
    <h3 className="text-lg font-semibold mb-2 bg-transparent shadow-md rounded-lg p-4">संध्याकाळचे दूध विवरण</h3>
    {eveningRecords.length > 0 ? (
      <div className="overflow-x-auto max-w-lg">
      <style jsx>{`
        .max-w-lg::-webkit-scrollbar {
          height: 8px; /* Adjust the height of the scrollbar */
        }
        .max-w-lg::-webkit-scrollbar-track {
          background: black; /* Optional: Change track background */
          border-radius: 10px;
        }
        .max-w-lg::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom right, #4a90e2, #9013fe); /* Set the scrollbar color to black */
          border-radius: 10px; /* Optional: Add rounded corners */
        }
      `}</style>
        <table className="min-w-full bg-white text-black shadow-md rounded-lg text-xs lg:text-base">
          <thead className='bg-gray-300 shadow-md'>
            <tr>
            <th className="py-2 px-4 border-b">दिनांक</th>
              <th className="py-2 px-4 border-b">लिटर </th>
              <th className="py-2 px-4 border-b">फॅट </th>
              <th className="py-2 px-4 border-b">SNF</th>
              <th className="py-2 px-4 border-b">दर </th>
              <th className="py-2 px-4 border-b">रक्कम </th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className='bg-gray-100'>
            {eveningRecords.map((record) => (
              <tr key={record._id} className='hover:bg-gray-200'>
                <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{record.liter}</td>
                <td className="py-2 px-4 border-b">{record.fat}</td>
                <td className="py-2 px-4 border-b">{record.snf}</td>
                <td className="py-2 px-4 border-b">{record.dar}</td>
                <td className="py-2 px-4 border-b">{record.rakkam}</td>
                <td className="py-2 px-4 border-b flex space-x-2">
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 cursor-pointer py-2 px-4"
                    onClick={() => handleDelete(record._id)}
                  />
                </td>
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
      </div>
    ) : (
      <p>संध्याकाळचे दूध मिळाले नाही .</p>
    )}
  </div>

</div>


      <div className="bg-white text-black shadow-md rounded-lg p-4 mt-4">
  <h3 className="text-lg font-semibold mb-2 bg-transparent shadow-md rounded-lg p-4">स्थिर कपात </h3>
  {selectedKapat.length > 0 ? (
    <table className="min-w-full bg-gray-200 text-black shadow-md rounded-lg table-auto">
  <thead className="bg-gray-300">
    <tr>
      <th className="py-3 px-6 border-b text-left text-lg font-semibold">कपातीचे नाव </th>
      <th className="py-3 px-6 border-b text-left text-lg font-semibold">रक्कम प्रति लिटर </th>
      <th className="py-3 px-6 border-b text-left text-lg font-semibold">कपात</th>
    </tr>
  </thead>
  <tbody>
    {selectedKapat.map((item) => (
      <tr key={item._id} className="border-t hover:bg-gray-100">
        <td className="py-2 px-6 border-b">{item.kapatName}</td>
        <td className="py-2 px-6 border-b">{item.kapatRate}</td>
        <td className="py-2 px-6 border-b">{(totalLiters * item.kapatRate).toFixed(2)}</td>
      </tr>
    ))}
  </tbody>
  <tfoot>
    <tr>
      <td colSpan="2" className="py-3 px-6 border-t font-semibold text-left">
        Total कपात
      </td>
      <td className="py-3 px-6 border-t text-left font-semibold">
        {/* Calculate total literKapat */}
        {selectedKapat.reduce(
          (total, item) => total + totalLiters * item.kapatRate,
          0
        ).toFixed(2)}
      </td>
    </tr>
  </tfoot>
</table>

  ) : (
    <p>कपात मिळाले नाही कपात अपलोड करा .</p>
  )}
</div>



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
  );
}
