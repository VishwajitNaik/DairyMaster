"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const KapatDetails = () => {
    const { id } = useParams(); // Correct usage of useParams
    const [kapat, setKapat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchKapat = async () => {
                try {
                    const res = await axios.get(`/api/kapat/getKapat`); // Ensure the correct API call with id
                    setKapat(res.data.data);
                    console.log(res.data.data);
                    setLoading(false);
                } catch (error) {
                    console.log("Failed to fetch kapat: ", error.message);
                    setError(error.message);
                    setLoading(false);
                }
            };
            fetchKapat();
        }
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='bg-white text-black'>
            <h1>Kapat details</h1>
            {kapat && (
                <>
                    <p>KapatType: {kapat.KapatType}</p>
                    <p>kapatCode: {kapat.kapatCode}</p>
                    <p>kapatName: {kapat.kapatName}</p>
                </>
            )}
        </div>
    );
};

export default KapatDetails;
