'use client';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export default function Navbar() {
    const router = useRouter();
    const { id } = useParams(); // Assuming userId is retrieved from URL params
    const [user, setUser] = useState(null);

    const fetchUserDetails = useCallback(async () => {
        try {
            const res = await axios.get(`/api/user/getUsers/${id}`);
            setUser(res.data.data);
        } catch (error) {
            console.error("Error fetching user details:", error.message);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchUserDetails();
        }
    }, [id, fetchUserDetails]);

    const handleOrdersClick = async () => {
        try {
            await fetchUserDetails();
            if (user) {
                router.push(`/home/orders/getOrdersUserside/${id}`);
            } else {
                console.error("User ID is not available.");
            }
        } catch (error) {
            console.error("Error handling orders click:", error.message);
        }
    };

    const handleAdvanceClick = async () => {
        try {
            await fetchUserDetails();
            if (user) {
                router.push(`/home/getAdvanceUserSide/${id}`);
            } else {
                console.error("User ID is not available.");
            }            
        } catch (error) {
            console.error("Error handling advance click:", error.message);
        }
    };

    return (
        <nav className="bg-gray-900 p-4 shadow-md shadow-blue-900">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">DairyMaster</div>
                <div className="flex space-x-4">
                    <button 
                        onClick={handleOrdersClick} 
                        className="text-white hover:bg-blue-700 p-2 rounded"
                    >
                        Orders
                    </button>
                    <button 
                        onClick={handleAdvanceClick} 
                        className="text-white hover:bg-blue-700 p-2 rounded"
                    >
                        Advance
                    </button>
                    <Link href="/services" className="text-white hover:bg-blue-700 p-2 rounded">
                        Services
                    </Link>
                    <Link href="/contact" className="text-white hover:bg-blue-700 p-2 rounded">
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
}
