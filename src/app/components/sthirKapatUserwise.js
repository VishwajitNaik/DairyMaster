import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

const KapatUserDetails = () => {
  const [kapatUser, setKapatUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { userId } = useParams();  // Extract registerNo from URL params

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return; // Don't fetch if no registerNo is available

      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await axios.get(`/api/kapat/getKapatByIds/${userId}`);
        
        console.log(response.data); // Log the response to see the structure
        if (response.data && response.data.data) {
          setKapatUser(response.data.data);  // Set the fetched user data to 'kapatUser' state
          setLoading(false);
        } else {
          throw new Error("Data not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);  // Log error for debugging
        setError(error.response?.data?.error || "Something went wrong");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]); // Run effect when userId changes

  useEffect(() => {
    console.log("KapatUser state:", kapatUser);  // Log to see if the state is updated
  }, [kapatUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Kapat User Details</h2>
      <p><strong>Name:</strong> {kapatUser.name}</p>
      <p><strong>Register No:</strong> {kapatUser.registerNo}</p>
      <p><strong>Milk Type:</strong> {kapatUser.milk}</p>

      <div>
        <strong>Selected Kapat:</strong>
        {kapatUser.selectedKapat && kapatUser.selectedKapat.length > 0 ? (
          kapatUser.selectedKapat.map((kapat) => (
            <div key={kapat._id}>
              <p>₹{kapat.kapatRate}</p>
            </div>
          ))
        ) : (
          <p>No selected kapat found.</p>
        )}
      </div>
    </div>
  );
};

export default KapatUserDetails;
