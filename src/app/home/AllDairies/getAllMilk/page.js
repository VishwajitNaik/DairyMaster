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

      console.log("Bufferalo Evening Milk Records:", buffaloEveningMilkRecords);

      setCowMorningMilkRecords(cowMorningMilkRecords);
      setBuffaloMorningMilkRecords(buffaloMorningMilkRecords);
      setCowEveningMilkRecords(cowEveningMilkRecords);
      setBuffaloEveningMilkRecords(buffaloEveningMilkRecords);
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
    <div className=" m-10">
      <h1 className="text-2xl font-bold mb-5">Milk Records</h1>

      {/* Date Range Filters */}
      <div className="flex items-center space-x-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-black p-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-black p-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          onClick={handleFilter}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Filter
        </button>
      </div>

      {/* Loading, Error, and Records Display */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && milkRecords.length === 0 && (
        <p>No milk records found. Please select a date range to filter.</p>
      )}
      {/* Milk Records Table: Morning Section */}
      <div className="flex flex-wrap mb-8">
        {/* Cow Morning Milk Records Table */}
        <div className="w-full md:w-1/2 p-2">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Cow Morning Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    तारीख
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    स्याम्पल नं
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    मिल्क प्रकार
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    मिल्क लिटर
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">फॅट</th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    एसएनफ
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">रेट</th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    रक्कम
                  </th>
                </tr>
              </thead>
              <tbody>
                {cowMorningMilkRecords.map((record) => (
                  <tr key={record._id} className="border-b bg-gray-200">
                    <td className="text-black px-2 sm:px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.sampleNo}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">गाय</td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.milkLiter}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.fat}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.snf}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      ₹{record.rate}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      ₹{record.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buffalo Morning Milk Records Table */}
        <div className="w-full md:w-1/2 p-2">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Buffalo Morning Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    तारीख
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    स्याम्पल नं
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    मिल्क प्रकार
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    मिल्क लिटर
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">फॅट</th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    एसएनफ
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">रेट</th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    रक्कम
                  </th>
                </tr>
              </thead>
              <tbody>
                {buffaloMorningMilkRecords.map((record) => (
                  <tr key={record._id} className="border-b bg-gray-200">
                    <td className="text-black px-2 sm:px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.sampleNo}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">भैंस</td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.milkLiter}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.fat}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.snf}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      ₹{record.rate}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      ₹{record.amount}
                    </td>
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
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Cow Evening Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    तारीख
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    स्याम्पल नं
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    मिल्क प्रकार
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    मिल्क लिटर
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">फॅट</th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    एसएनफ
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">रेट</th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    रक्कम
                  </th>
                </tr>
              </thead>
              <tbody>
                {cowEveningMilkRecords.map((record) => (
                  <tr key={record._id} className="border-b bg-gray-200">
                    <td className="text-black px-2 sm:px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.sampleNo}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">गाय</td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.milkLiter}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.fat}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.snf}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      ₹{record.rate}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      ₹{record.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buffalo Evening Milk Records Table */}
        <div className="w-full md:w-1/2 p-2">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Buffalo Evening Milk Records
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    तारीख
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    स्याम्पल नं
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    मिल्क प्रकार
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    मिल्क लिटर
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">फॅट</th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    एसएनफ
                  </th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">रेट</th>
                  <th className="border-b px-2 sm:px-4 py-2 text-left">
                    रक्कम
                  </th>
                </tr>
              </thead>
              <tbody>
                {buffaloEveningMilkRecords.map((record) => (
                  <tr key={record._id} className="border-b bg-gray-200">
                    <td className="text-black px-2 sm:px-4 py-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.sampleNo}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">भैंस</td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.milkLiter}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.fat}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      {record.snf}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      ₹{record.rate}
                    </td>
                    <td className="text-black px-2 sm:px-4 py-2">
                      ₹{record.amount}
                    </td>
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
