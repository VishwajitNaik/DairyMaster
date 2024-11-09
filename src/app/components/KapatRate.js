'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';

const FetchKapatRates = () => {
    const [registerNo, setRegisterNo] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [kapatRates, setKapatRates] = useState([]);
    const [error, setError] = useState('');

    const handleFetch = async () => {
        if (!registerNo) {
            setError('Register number is required');
            return;
        }

        try {
            const response = await axios.get('/api/kapatRate/getKapatRate', {
                params: { registerNo, startDate, endDate },
            });
            setKapatRates(response.data.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch KapatRates');
            console.error('Error fetching KapatRates:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Register No"
                value={registerNo}
                onChange={(e) => setRegisterNo(e.target.value)}
            />
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={handleFetch}>Fetch KapatRates</button>
            {error && <p>{error}</p>}
            <ul>
                {kapatRates.map((rate) => (
                    <li key={rate._id}>
                        {rate.date.toString()}: {rate.rakkam}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FetchKapatRates;
