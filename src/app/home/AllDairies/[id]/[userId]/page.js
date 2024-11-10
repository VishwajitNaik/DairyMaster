'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const UserDetails = () => {
  const { id, userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (id && userId) {
      const fetchUserDetails = async () => {
        try {
          const res = await axios.get(`/api/owner/getOwners/${id}/${userId}`);
          setUser(res.data.data);
        } catch (error) {
          console.error('Error fetching user details:', error.message);
        }
      };
      
      fetchUserDetails();
    }
  }, [id, userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="bg-white text-black shadow-md rounded-lg p-4 mb-4">
        <p><span className='font-semibold'>Name:</span> {user.name}</p>
        <p><span className='font-semibold'>Milk Type:</span> {user.milk}</p>
        <p><span className='font-semibold'>User ID:</span> {user._id}</p>
      </div>
    </div>
  );
}

export default UserDetails;
