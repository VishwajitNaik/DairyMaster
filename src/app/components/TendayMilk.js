import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MilkRecords = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [milkRecords, setMilkRecords] = useState([]);

  // Fetch all users for selection
  useEffect(() => {
    async function getOwnerUsers() {
      try {
        const res = await axios.get('/api/user/getUsers');
        setUsers(res.data.data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error.message);
      }
    }
    getOwnerUsers();
  }, []);

  // Fetch milk records based on selected user and date range
  const fetchMilkRecords = async () => {
    if (!selectedUser || !startDate || !endDate) {
      alert('Please select a user and date range');
      return;
    }

    try {
      const response = await axios.get(`/api/milk/getMilkRecords`, {
        params: {
          userId: selectedUser,
          startDate,
          endDate
        }
      });

      setMilkRecords(response.data.data);
      console.log("Milk records fetched:", response.data.data);
    } catch (error) {
      console.error("Error fetching milk records:", error.message);
    }
  };

  return (
    <div>
      <h1>Milk Records</h1>

      {/* User Selection Dropdown */}
      <label htmlFor="user">Select User:</label>
      <select
        id="user"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.registerNo})
          </option>
        ))}
      </select>

      {/* Date Range Selection */}
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input
          className='text-black'
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label htmlFor="endDate">End Date:</label>
        <input
          className='text-black'
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Fetch Button */}
      <button onClick={fetchMilkRecords}>Fetch Milk Records</button>

      {/* Milk Records Display */}
      {milkRecords.length > 0 && (
        <div>
          <h2>Milk Records for Selected User</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Liter</th>
                <th>Fat</th>
                <th>SNF</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {milkRecords.map((record) => (
                <tr key={record._id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td >{record.liter}</td>
                  <td >{record.fat}</td>
                  <td >{record.snf}</td>
                  <td >{record.rate}</td>
                  <td >{record.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MilkRecords;

// const handleFetchRecords = async () => {
//   try {
//     setError('');
//     const response = await axios.post(`/api/milk/tenDayMilk?startDate=${startDate}&endDate=${endDate}`);
//     setMilkRecords(response.data.data);
//   } catch (error) {
//     console.error("Error fetching milk records:", error);
//     setError('Failed to fetch milk records');
//   }
// };