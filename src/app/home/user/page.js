'use client';
import { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            // Make a POST request to your API
            const response = await axios.post('/api/user', { username });

            // If successful, set the success message
            setMessage(response.data.message);
            setError(''); // Clear any previous error
        } catch (err) {
            // Handle error by setting error message
            setError(err.response?.data?.error || 'Something went wrong!');
            setMessage(''); // Clear any previous success message
        }

        // Clear the input field
        setUsername('');
    };

    return (
        <div>
            <h2>Create User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create User</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CreateUser;
