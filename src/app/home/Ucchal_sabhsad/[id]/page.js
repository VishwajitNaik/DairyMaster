"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function UserUcchalData() {
  const { id } = useParams(); // Get the user ID from the dynamic route
  const [data, setData] = useState([]);
  const [billKapat, setBillKapat] = useState([]);
  const [total, setTotal] = useState(0);
  const [netPayment, setNetPayment] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUcchalData() {
      try {
        const response = await axios.post(`/api/user/ucchal/getUchhal/${id}`);
        setData(response.data.data);
        setTotal(response.data.total);
        setBillKapat(response.data.billKapatRecords);
        setNetPayment(response.data.netPayment);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch data");
      }
    }

    if (id) fetchUcchalData();
  }, [id]);

  // ✅ Combine Ucchal and BillKapat data based on date order
  const combinedData = [
    ...billKapat.map((item) => ({ ...item, type: "billKapat" })),
    ...data.map((item) => ({ ...item, type: "ucchal" })),
  ].sort((a, b) => {
    if (a.type === "ucchal" && b.type !== "ucchal") return -1; // Keep Ucchal on top
    if (a.type !== "ucchal" && b.type === "ucchal") return 1;
    return new Date(a.date) - new Date(b.date); // Sort by date
  });
  
  let runningTotal = 0;

  return (
    <div className="gradient-bg flex flex-col min-h-screen items-center justify-center p-2">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        User Ucchal and BillKapat Data
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="overflow-x-auto w-full">
        {combinedData.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 shadow-lg bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-6 border border-gray-300 text-left">
                  दिनांक
                </th>
                <th className="py-3 px-6 border border-gray-300 text-left">
                  प्रकार
                </th>
                <th className="py-3 px-6 border border-gray-300 text-left">
                  रक्कम
                </th>
                <th className="py-3 px-6 border border-gray-300 text-left">
                  शिल्लक
                </th>
              </tr>
            </thead>
            <tbody>
              {combinedData.map((record, index) => {
                const rakkam =
                  record.type === "billKapat"
                    ? -parseFloat(record.rate) || 0
                    : parseFloat(record.rakkam) || 0;
                runningTotal += rakkam;

                return (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="py-3 px-6 border border-gray-300 text-gray-800">
                      {new Date(record.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="py-3 px-6 border border-gray-300 text-gray-800">
                      {record.type === "billKapat" ? "उच्चल कपात" : "उच्चल"}
                    </td>
                    <td
                      className={`py-3 px-6 border border-gray-300 ${
                        String(rakkam).startsWith("-")
                          ? "text-red-500"
                          : "text-gray-800"
                      }`}
                    >
                      {rakkam.toFixed(2)}
                    </td>
                    <td className="py-3 px-6 border border-gray-300 text-gray-800">
                      {runningTotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}

              {/* ✅ Add Total Row at the End */}
              <tr className="bg-gray-200 font-semibold">
                <td
                  className="py-3 px-6 border border-gray-300 text-gray-800"
                  colSpan="3"
                >
                  Total
                </td>
                <td className="py-3 px-6 border border-gray-300 text-gray-800">
                  {runningTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No data found</p>
        )}
      </div>

      {/* ✅ Total Section */}
      <div className="mt-6 bg-gray-100 rounded-lg p-4 shadow-md w-1/2">
        <h2 className="text-xl font-semibold text-gray-800">
          Net Payment: {netPayment.toFixed(2)}
        </h2>
      </div>
    </div>
  );
}
