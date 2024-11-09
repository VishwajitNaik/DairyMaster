// components/MilkInputForm.js

import { useEffect, useState } from 'react';
import axios from 'axios';

const MilkInputForm = () => {
  const [users, setUsers] = useState([]); // State to hold users
  const [selectedOption, setSelectedOption] = useState(''); // Selected register number
  const [selectedUser, setSelectedUser] = useState(null); // Selected user object
  const [lastRecord, setLastRecord] = useState(null); // Latest milk record
  const [fat, setFat] = useState(''); // State for fat input
  const [snf, setSnf] = useState(''); // State for SNF input
  const [autoFill, setAutoFill] = useState(false); // State for radio button
  const [error, setError] = useState(null); // Error handling

  // Fetch users on component mount
  useEffect(() => {
    const getOwnerUsers = async () => {
      try {
        const res = await axios.get('/api/user/getUsers'); // API to fetch users
        setUsers(res.data.data.users); // Set users in state
      } catch (error) {
        console.log('Failed to fetch users:', error.message);
      }
    };
    getOwnerUsers();
  }, []);

  // Fetch latest milk record for the selected user
  useEffect(() => {
    const fetchLatestMilkRecord = async () => {
      if (!selectedUser) return; // Don't fetch if no user is selected

      try {
        const res = await axios.get(`/api/milk/latest?userId=${selectedUser._id}`);
        if (!res.data.error) {
          setLastRecord(res.data.data); // Set last record
          setError(null); // Reset error state
          if (autoFill) {
            // If autoFill is true, set fat and snf from last record
            setFat(res.data.data.fat);
            setSnf(res.data.data.snf);
          }
        } else {
          throw new Error(res.data.error);
        }
      } catch (error) {
        setError(error.message); // Handle error
      }
    };

    fetchLatestMilkRecord();
  }, [selectedUser, autoFill]); // Dependency on autoFill and selectedUser

  // Handle user selection by register number
  const handleUserChange = (event) => {
    const selectedRegisterNo = event.target.value;
    setSelectedOption(selectedRegisterNo);

    const user = users.find((user) => user.registerNo === parseInt(selectedRegisterNo, 10));
    setSelectedUser(user); // Update selected user based on register number
    setLastRecord(null); // Reset last record to trigger fetch
    setError(null); // Reset error state
    if (!autoFill) {
      setFat(''); // Reset fat only if auto-fill is not selected
      setSnf(''); // Reset SNF only if auto-fill is not selected
    }
  };

  // Handle radio button change
  const handleAutoFillChange = (event) => {
    const isChecked = event.target.checked; // Get checked state
    setAutoFill(isChecked); // Update auto-fill state
    if (isChecked && lastRecord) {
      setFat(lastRecord.fat); // Set fat from last record
      setSnf(lastRecord.snf); // Set SNF from last record
    }
  };

  // Handle manual input changes
  const handleFatChange = (event) => setFat(event.target.value);
  const handleSnfChange = (event) => setSnf(event.target.value);

  return (
    <div>
      <h2>Milk Input Form</h2>

      <label htmlFor="userSelect">Select User by Register No:</label>
      <select id="userSelect" onChange={handleUserChange} value={selectedOption}>
        <option value="">--Select a User--</option>
        {users.map((user) => (
          <option key={user._id} value={user.registerNo}>
            {user.registerNo} - {user.name} {/* Display registerNo and name */}
          </option>
        ))}
      </select>

      {error && <div>Error: {error}</div>}

      <div>
        <label>
          <input
            type="radio"
            checked={autoFill}
            onChange={handleAutoFillChange}
          />
          Use Latest Record Values
        </label>
      </div>

      <div>
        <label htmlFor="fat">Fat:</label>
        <input
          className='text-black'
          type="number"
          id="fat"
          value={fat}
          onChange={handleFatChange}
          placeholder="Enter fat value"
        />
      </div>

      <div>
        <label htmlFor="snf">SNF:</label>
        <input
          className='text-black'
          type="number"
          id="snf"
          value={snf}
          onChange={handleSnfChange}
          placeholder="Enter SNF value"
        />
      </div>
    </div>
  );
};

export default MilkInputForm;
