"use client"
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const UserDetail = () => {
  const router = useRouter();
  const { id } = useParams; // Destructure 'id' from router.query
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`/api/user/getUsers/${id}`);
          setUser(res.data.data);
          setLoading(false)
        } catch (err) {
            console.log("Failed to fetch doubt: ", error.message);
            setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='bg-white text-black'>
      <h1>User Details</h1>
      <p>Register No: {user.registerNo}</p>
      <p>User Name: {user.userName}</p>
      <p>Milk: {user.milk}</p>
      <p>Phone: {user.phone}</p>
      <p>Bank Name: {user.bankName}</p>
      <p>Account No: {user.accountNo}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserDetail;