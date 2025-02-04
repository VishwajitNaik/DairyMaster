"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const MilkRecords = () => {
  const [milkRecords, setMilkRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cowMorningMilkRecords, setCowMorningMilkRecords] = useState([]); // for cow morning milk records
  const [buffaloMorningMilkRecords, setBuffaloMorningMilkRecords] = useState(
    []
  ); // for buffalo morning milk records
  const [cowEveningMilkRecords, setCowEveningMilkRecords] = useState([]); // for cow evening milk records
  const [buffaloEveningMilkRecords, setBuffaloEveningMilkRecords] = useState(
    []
  ); // for buffalo evening milk records
  const [tatalMilkRakkam, setTotalMilkRakkam] = useState(0);
  const [totalBuffMilkRakkam, setTotalBuffMilkRakkam] = useState(0);
  const [totalCowMilkRakkam, setTotalCowMilkRakkam] = useState(0);

  const fetchMilkRecords = async () => {
    setLoading(true);
    setError(null);

    if (!startDate || !endDate) {
      setError("Both startDate and endDate are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/sangh/GetOwnerMilk", {
        params: { startDate, endDate },
      });
      setMilkRecords(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while fetching milk records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (milkRecords.length > 0) {
      const cowMorningMilkRecords = milkRecords.filter(
        (record) => record.milkType === "cow" && record.session === "morning"
      );
      const buffaloMorningMilkRecords = milkRecords.filter(
        (record) => record.milkType === "buff" && record.session === "morning"
      );
      const cowEveningMilkRecords = milkRecords.filter(
        (record) => record.milkType === "cow" && record.session === "evening"
      );
      const buffaloEveningMilkRecords = milkRecords.filter(
        (record) => record.milkType === "buff" && record.session === "evening"
      );

      const totalMilkRakkam = milkRecords.reduce(
        (total, record) => total + record.amount,
        0
      );

      const totalBuffMilkRakkam =
        buffaloMorningMilkRecords.reduce(
          (total, record) => total + record.amount,
          0
        ) +
        buffaloEveningMilkRecords.reduce(
          (total, record) => total + record.amount,
          0
        );

      const totalCowMilkRakkam =
        cowMorningMilkRecords.reduce(
          (total, record) => total + record.amount,
          0
        ) +
        cowEveningMilkRecords.reduce(
          (total, record) => total + record.amount,
          0
        );

      setCowMorningMilkRecords(cowMorningMilkRecords);
      setBuffaloMorningMilkRecords(buffaloMorningMilkRecords);
      setCowEveningMilkRecords(cowEveningMilkRecords);
      setBuffaloEveningMilkRecords(buffaloEveningMilkRecords);
      setTotalMilkRakkam(totalMilkRakkam.toFixed(2));
      setTotalBuffMilkRakkam(totalBuffMilkRakkam.toFixed(2));
      setTotalCowMilkRakkam(totalCowMilkRakkam.toFixed(2));
    }
  }, [milkRecords]);
  const handleFilter = () => {
    fetchMilkRecords();
  };

  const handleMoreInfo = (record) => {
    alert(
      `More details for Register No: ${record.registerNo}\nMilk Type: ${record.milkType}`
    );
    // You can expand this to show more details in a modal or navigate to a new page
  };

  return (
    <div className="ml-5 mt-5">
<h1 className="text-3xl text-center text-gray-800 mb-6 font-bold">
  Milk Records
</h1>

{/* Date Range Filters */}
<div className="flex flex-col sm:flex-row sm:space-x-6 mx-[20%] p-6 bg-white rounded-lg shadow-lg border border-gray-200 mb-2">
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700">Start Date</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="text-black p-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
    />
  </div>
  
  <div className="flex-1 mt-4 sm:mt-0">
    <label className="block text-sm font-medium text-gray-700">End Date</label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="text-black p-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base"
    />
  </div>
  
  <button
    onClick={handleFilter}
    className="mt-6 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    Apply Filters
  </button>
</div>


      {/* Loading, Error, and Records Display */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && milkRecords.length === 0 && (
        <p>No milk records found. Please select a date range to filter.</p>
      )}
      {/* Milk Records Table: Morning Section */}
      <div className="flex flex-row flex-wrap gap-4 mb-8">
        {/* Cow Morning Milk Records Table */}
        <div className="w-full md:w-[48%] p-4 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-center text-xl font-semibold bg-gray-700 text-white py-3 rounded-t-lg">
            🐄 Cow Morning Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base text-black">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border border-gray-300 px-4 py-2">तारीख</th>
                  <th className="border border-gray-300 px-4 py-2">
                    स्याम्पल नं
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    मिल्क लिटर
                  </th>
                  <th className="border border-gray-300 px-4 py-2">फॅट</th>
                  <th className="border border-gray-300 px-4 py-2">एसएनफ</th>
                  <th className="border border-gray-300 px-4 py-2">रेट</th>
                  <th className="border border-gray-300 px-4 py-2">रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {cowMorningMilkRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b bg-white hover:bg-gray-100 transition-all text-black"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.sampleNo}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.milkLiter}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.fat}{" "}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.snf}{" "}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">
                      {record.rate}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">
                      {record.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buffalo Morning Milk Records Table */}
        <div className="w-full md:w-[48%] p-4 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-center text-xl font-semibold bg-gray-700 text-white py-3 rounded-t-lg">
            🐃 Buffalo Morning Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base text-black">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border border-gray-300 px-4 py-2 text-black">तारीख</th>
                  <th className="border border-gray-300 px-4 py-2 text-black">
                    स्याम्पल नं
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-black">
                    मिल्क लिटर
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-black">फॅट</th>
                  <th className="border border-gray-300 px-4 py-2 text-black">एसएनफ</th>
                  <th className="border border-gray-300 px-4 py-2 text-black">रेट</th>
                  <th className="border border-gray-300 px-4 py-2 text-black">रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {buffaloMorningMilkRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b bg-white hover:bg-gray-100 transition-all text-black"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.sampleNo}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.milkLiter}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.fat}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {record.snf}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">
                      {record.rate}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-bold text-black">
                      {record.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Milk Records Table: Evening Section */}
      <div className="flex flex-row flex-wrap gap-4 mb-8">
        {/* Cow Evening Milk Records Table */}
        <div className="w-full md:w-[48%] p-4 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-center text-xl font-semibold bg-gray-700 text-white py-3 rounded-t-lg">
            🐄 Cow Evening Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 px-4 py-2">तारीख</th>
                  <th className="border border-gray-300 px-4 py-2">
                    स्याम्पल नं
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    मिल्क लिटर
                  </th>
                  <th className="border border-gray-300 px-4 py-2">फॅट</th>
                  <th className="border border-gray-300 px-4 py-2">एसएनफ</th>
                  <th className="border border-gray-300 px-4 py-2">रेट</th>
                  <th className="border border-gray-300 px-4 py-2">रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {cowEveningMilkRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b text-center bg-white hover:bg-gray-100 transition-all"
                  >
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      {record.sampleNo}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      {record.milkLiter} 
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      {record.fat} 
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      {record.snf} 
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black font-bold">
                      {record.rate}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black font-bold">
                      {record.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buffalo Evening Milk Records Table */}
        <div className="w-full md:w-[48%] p-4 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-center text-xl font-semibold bg-gray-700 text-white py-3 rounded-t-lg">
            🐃 Buffalo Evening Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 px-4 py-2">तारीख</th>
                  <th className="border border-gray-300 px-4 py-2">
                    स्याम्पल नं
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    मिल्क लिटर
                  </th>
                  <th className="border border-gray-300 px-4 py-2">फॅट</th>
                  <th className="border border-gray-300 px-4 py-2">एसएनफ</th>
                  <th className="border border-gray-300 px-4 py-2">रेट</th>
                  <th className="border border-gray-300 px-4 py-2">रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {buffaloEveningMilkRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b text-center bg-white hover:bg-gray-100 transition-all"
                  >
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      {record.sampleNo}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      {record.milkLiter}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      {record.fat}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      {record.snf} 
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black font-bold">
                      {record.rate}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black font-bold">
                      {record.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto mt-6 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-center text-2xl font-semibold bg-gray-700 text-white py-3">
            Milk Summary
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">Milk Type</th>
                <th className="border border-gray-300 px-4 py-2">
                  Total Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center text-lg">
                <td className="border border-gray-300 px-4 py-2 font-medium text-black">
                  म्हैस दूध 
                </td>
                <td className="border border-gray-300 px-4 py-2 font-bold text-blue-600">
                  {totalBuffMilkRakkam}
                </td>
              </tr>
              <tr className="text-center text-lg bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium text-black">
                  गाय दूध 
                </td>
                <td className="border border-gray-300 px-4 py-2 font-bold text-green-600">
                  {totalCowMilkRakkam}
                </td>
              </tr>
              <tr className="text-center text-lg font-semibold bg-gray-300">
                <td className="border border-gray-300 px-4 py-2 text-black">
                  एकूण रक्कम (Total)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-red-600">
                  {tatalMilkRakkam}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MilkRecords;
