"use client";
import { useEffect, useState } from "react";

const MilkRecords = () => {
  const [milkRecords, setMilkRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [startDate, setStartDate] = useState(""); // for start date
  const [endDate, setEndDate] = useState(""); // for end date
  const [filteredRecords, setFilteredRecords] = useState([]); // for filtered records
  const [cowMorningMilkRecords, setCowMorningMilkRecords] = useState([]); // for cow morning milk records
  const [buffaloMorningMilkRecords, setBuffaloMorningMilkRecords] = useState([]); // for buffalo morning milk records
  const [cowEveningMilkRecords, setCowEveningMilkRecords] = useState([]); // for cow evening milk records
  const [buffaloEveningMilkRecords, setBuffaloEveningMilkRecords] = useState([]); // for buffalo evening milk records

  useEffect(() => {
    const fetchMilkRecords = async () => {
      try {
        const response = await fetch("/api/owner/Sanghdata/ownerMilk");
        const data = await response.json();

        if (response.ok) {
          if (Array.isArray(data)) {
            setMilkRecords(data);
            filterByToday(data); // Default to today’s records
          } else if (data?.data && Array.isArray(data.data)) {
            setMilkRecords(data.data);
            filterByToday(data.data); // Default to today’s records
          } else {
            setMilkRecords([]);
            setFilteredRecords([]);
            setError("No valid records found in the response.");
          }
        } else {
          setError(data.message || "Failed to fetch records");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchMilkRecords();
  }, []);

  const handlePop = (record) => {
    setSelectedRecord(record);
  };

  const closeModal = () => {
    setSelectedRecord(null);
  };

  // Now separate the data into the specific categories (morning/evening, cow/buffalo)
  useEffect(() => {
    if (milkRecords.length > 0) {
      const cowMorning = milkRecords.filter(record => record.milkType === "cow" && record.session === "morning");
      const buffaloMorning = milkRecords.filter(record => record.milkType === "buff" && record.session === "morning");
      const cowEvening = milkRecords.filter(record => record.milkType === "cow" && record.session === "evening");
      const buffaloEvening = milkRecords.filter(record => record.milkType === "buff" && record.session === "evening");
      console.log("CowMorning Filtered records:", cowMorning);
      
      setCowMorningMilkRecords(cowMorning);
      setBuffaloMorningMilkRecords(buffaloMorning);
      setCowEveningMilkRecords(cowEvening);
      setBuffaloEveningMilkRecords(buffaloEvening);
    }
  }, [milkRecords]);

  const filterByToday = (data) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const todayRecords = data.filter((record) => {
      const recordDate = new Date(record.date);
      const recordStr = recordDate.toISOString().split('T')[0]; // Format record date as YYYY-MM-DD
      return recordStr === todayStr;
    });

    setFilteredRecords(todayRecords);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
<div>
  <h1 className="text-lg sm:text-xl font-bold mb-4">Milk Records</h1>

  {/* Date Range Picker */}
  <div className="mb-4">
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="mr-4 p-2 text-black border rounded text-sm sm:text-base"
    />
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="mr-4 p-2 text-black border rounded text-sm sm:text-base"
    />
    <button
      onClick={() => filterByToday(milkRecords)} // Handle date range filtering as required
      className="p-2 bg-blue-500 text-white rounded text-sm sm:text-base"
    >
      Filter
    </button>
  </div>

  {/* Milk Records Table: Morning Section */}
  <div className="flex flex-wrap mb-8">
    {/* Cow Morning Milk Records Table */}
    <div className="w-full md:w-1/2 p-2">
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Cow Morning Milk Records</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="border-b px-2 sm:px-4 py-2 text-left">तारीख</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">स्याम्पल नं</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">मिल्क प्रकार</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">मिल्क लिटर</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">फॅट</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">एसएनफ</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">रेट</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">रक्कम</th>
            </tr>
          </thead>
          <tbody>
            {cowMorningMilkRecords.map((record) => (
              <tr key={record._id} className="border-b bg-gray-200">
                <td className="text-black px-2 sm:px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.sampleNo}</td>
                <td className="text-black px-2 sm:px-4 py-2">गाय</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.milkLiter}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.fat}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.snf}</td>
                <td className="text-black px-2 sm:px-4 py-2">₹{record.rate}</td>
                <td className="text-black px-2 sm:px-4 py-2">₹{record.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Buffalo Morning Milk Records Table */}
    <div className="w-full md:w-1/2 p-2">
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Buffalo Morning Milk Records</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="border-b px-2 sm:px-4 py-2 text-left">तारीख</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">स्याम्पल नं</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">मिल्क प्रकार</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">मिल्क लिटर</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">फॅट</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">एसएनफ</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">रेट</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">रक्कम</th>
            </tr>
          </thead>
          <tbody>
            {buffaloMorningMilkRecords.map((record) => (
              <tr key={record._id} className="border-b bg-gray-200">
                <td className="text-black px-2 sm:px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.sampleNo}</td>
                <td className="text-black px-2 sm:px-4 py-2">भैंस</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.milkLiter}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.fat}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.snf}</td>
                <td className="text-black px-2 sm:px-4 py-2">₹{record.rate}</td>
                <td className="text-black px-2 sm:px-4 py-2">₹{record.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  {/* Milk Records Table: Evening Section */}
  <div className="flex flex-wrap mb-8">
    {/* Cow Evening Milk Records Table */}
    <div className="w-full md:w-1/2 p-2">
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Cow Evening Milk Records</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="border-b px-2 sm:px-4 py-2 text-left">तारीख</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">स्याम्पल नं</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">मिल्क प्रकार</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">मिल्क लिटर</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">फॅट</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">एसएनफ</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">रेट</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">रक्कम</th>
            </tr>
          </thead>
          <tbody>
            {cowEveningMilkRecords.map((record) => (
              <tr key={record._id} className="border-b bg-gray-200">
                <td className="text-black px-2 sm:px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.sampleNo}</td>
                <td className="text-black px-2 sm:px-4 py-2">गाय</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.milkLiter}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.fat}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.snf}</td>
                <td className="text-black px-2 sm:px-4 py-2">₹{record.rate}</td>
                <td className="text-black px-2 sm:px-4 py-2">₹{record.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Buffalo Evening Milk Records Table */}
    <div className="w-full md:w-1/2 p-2">
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Buffalo Evening Milk Records</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="border-b px-2 sm:px-4 py-2 text-left">तारीख</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">स्याम्पल नं</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">मिल्क प्रकार</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">मिल्क लिटर</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">फॅट</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">एसएनफ</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">रेट</th>
              <th className="border-b px-2 sm:px-4 py-2 text-left">रक्कम</th>
            </tr>
          </thead>
          <tbody>
            {buffaloEveningMilkRecords.map((record) => (
              <tr key={record._id} className="border-b bg-gray-200">
                <td className="text-black px-2 sm:px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.sampleNo}</td>
                <td className="text-black px-2 sm:px-4 py-2">भैंस</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.milkLiter}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.fat}</td>
                <td className="text-black px-2 sm:px-4 py-2">{record.snf}</td>
                <td className="text-black px-2 sm:px-4 py-2">₹{record.rate}</td>
                <td className="text-black px-2 sm:px-4 py-2">₹{record.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

  );
};

export default MilkRecords;
