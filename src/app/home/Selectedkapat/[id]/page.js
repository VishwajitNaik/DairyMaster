"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const SelectedKapatList = () => {
  const [selectedKapat, setSelectedKapat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get the user ID from the URL parameters

  // Fetch data when component mounts
  useEffect(() => {
    const fetchSelectedKapat = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/kapat/getKapatByIds`, {
          params: { userId: id }, // Pass userId to the backend
        });

        if (response.data && response.data.data) {
          setSelectedKapat(response.data.data); // Populate selectedKapat state with fetched data
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
  }, [id]); // Trigger fetch when `id` changes

  // Calculate total of all kapatRates and format it to 2 decimal places
  const totalKapatRate = selectedKapat.reduce((total, kapat) => total + kapat.kapatRate, 0).toFixed(2);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Selected Kapat</h2>
      {selectedKapat.length > 0 ? (
        <>
          <ul>
            {selectedKapat.map((kapat) => (
              <li key={kapat._id}>
                <strong>{kapat.KapatType}</strong> (Register No: {kapat.kapatRate})
                {/* Render other Kapat details here */}
              </li>
            ))}
          </ul>
          <div>
            <h3>Total Kapat Rate: {totalKapatRate}</h3>
          </div>
        </>
      ) : (
        <p>No selected Kapat found.</p>
      )}
    </div>
  );
};

export default SelectedKapatList;
