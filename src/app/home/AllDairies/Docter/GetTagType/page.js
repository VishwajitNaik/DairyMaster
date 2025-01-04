"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const TagTypeList = () => {
    const [tagTypes, setTagTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch TagType data from the backend
    const fetchTagTypes = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get("/api/Docter/GetTagType"); // Replace with your API route
            if (response.status === 200) {
                setTagTypes(response.data.data);
            }
        } catch (error) {
            setError(error.response?.data?.error || "Failed to fetch Tag Types");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTagTypes();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tag Types</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && tagTypes.length === 0 && (
                <p>No Tag Types found</p>
            )}

            {!loading && !error && tagTypes.length > 0 && (
                <ol className="list-decimal list-inside">
                    {tagTypes.map((tagType, index) => (
                        <li
                            key={tagType._id}
                            className="border bg-slate-100 border-gray-300 p-4 mb-2 rounded shadow"
                        >
                            <p className="text-black text-lg font-medium">
                                <span className="text-gray-600 font-semibold">Tag:</span> {tagType.TagType}
                            </p>
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">Created At:</span>{" "}
                                {new Date(tagType.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};

export default TagTypeList;
