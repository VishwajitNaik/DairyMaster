"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const DoctorVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorVisits = async () => {
      try {
        const response = await axios.get("/api/Docter/DocterVisits");
        setVisits(response.data.data);
      } catch (err) {
        setError("Failed to fetch doctor visits");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorVisits();
  }, []);

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Doctor Visits</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && visits.length === 0 && <p>No visits found.</p>}
      {!loading && !error && visits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visits.map((visit) => (
            <div key={visit._id} className="p-4 bg-gray-100 text-black rounded-lg shadow-md">
              <p><strong>तारीख </strong> {new Date(visit.date).toLocaleDateString()}</p>
              <p><strong>उत्पादक </strong> {visit.username}</p>
              <p><strong> आजारचा प्रकार </strong> {visit.Decises}</p>
              <p><strong>जनावर प्रकार</strong> {visit.AnimalType}</p>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorVisits;
