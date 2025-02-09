"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MilkRecords = () => {
  const [data, setData] = useState([]);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMilkRecords = async () => {
      try {
        const response = await axios.get("/api/analysis/sanghMilk");
        setData(response.data.data);
        setOwner(response.data.owner);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMilkRecords();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const morningData = data.filter((record) => record.session === "morning");
  const eveningData = data.filter((record) => record.session === "evening");

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      {owner && (
        <div className="border-b pb-4 text-center">
          <h2 className="text-2xl font-bold text-black">{owner.dairyName}</h2>
          <p className="text-lg text-gray-600">Owner: {owner.ownerName}</p>
          <p className="text-gray-600">Phone: {owner.phone} | Email: {owner.email}</p>
        </div>
      )}

      <h2 className="text-xl font-semibold text-center">Milk Production Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-center">Morning Session</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={morningData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="liter" stroke="#8884d8" name="Liters" strokeWidth={2} />
              <Line type="monotone" dataKey="fat" stroke="#82ca9d" name="Fat %" strokeWidth={2} />
              <Line type="monotone" dataKey="snf" stroke="#ffc658" name="SNF %" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-center">Evening Session</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={eveningData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="liter" stroke="#8884d8" name="Liters" strokeWidth={2} />
              <Line type="monotone" dataKey="fat" stroke="#82ca9d" name="Fat %" strokeWidth={2} />
              <Line type="monotone" dataKey="snf" stroke="#ffc658" name="SNF %" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-center">Milk Records</h2>
        {data.length > 0 ? (
          <ul className="divide-y divide-gray-300 bg-gray-100 p-4 rounded-lg">
            {data.map((record, index) => (
              <li key={index} className="py-4 px-6 bg-white shadow-md rounded-lg mb-2">
                <p className="text-black"><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                <p className="text-black"><strong>Milk Type:</strong> {record.milkType}</p>
                <p className="text-black"><strong>Session:</strong> {record.session}</p>
                <p className="text-black"><strong>Liters:</strong> {record.liter} L</p>
                <p className="text-black"><strong>SNF:</strong> {record.snf}</p>
                <p className="text-black"><strong>Fat:</strong> {record.fat}</p>
                <p className="text-black"><strong>Amount:</strong> ₹{record.rakkam}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No milk records found.</p>
        )}
      </div>
    </div>
  );
};

export default MilkRecords;
