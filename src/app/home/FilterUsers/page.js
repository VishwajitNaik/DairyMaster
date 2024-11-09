'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function YourComponent() {
    const [users, setUsers] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]); // Today's date
    const [currentTime, setCurrentTime] = useState('morning'); // Default to morning or use some logic

    useEffect(() => {
        // Fetch users who haven't recorded milk for the current session
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/milk/filterUsers', {
                    params: { currentDate, currentTime }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        fetchUsers();
    }, [currentDate, currentTime]);

    return (
        <div>
            <select onChange={(e) => setCurrentTime(e.target.value)} value={currentTime}>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
            </select>

            <ul>
                {users.map(user => (
                    <li key={user._id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default YourComponent;
