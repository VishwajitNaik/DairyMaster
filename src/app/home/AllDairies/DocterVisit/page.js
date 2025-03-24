"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import VisitDetailsModel from "@/app/components/Models/VisitDetailsModel";

const DisplayDairiesWithVisits = () => {
    const [dairiesWithVisits, setDairiesWithVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVisitId, setSelectedVisitId] = useState(null);
    const [expandedDairy, setExpandedDairy] = useState(null);

    useEffect(() => {
        const fetchDairiesWithVisits = async () => {
            try {
                const response = await axios.get("/api/sangh/DocterVisit");
                setDairiesWithVisits(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dairies and visits:", error.message);
                setError("Error fetching dairies and visits");
                setLoading(false);
            }
        };
        fetchDairiesWithVisits();
    }, []);

    const handleSendButtonClick = (visitId) => {
        setSelectedVisitId(visitId);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async ({ visitDate, visitTime }) => {
        try {
            await axios.post("/api/sangh/VisitAcceptStatus", {
                visitId: selectedVisitId,
                visitDate,
                visitTime,
            });
            alert("Visit details sent and accepted successfully!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error processing visit:", error.message);
            alert("Failed to process visit");
        }
    };

    const handleVisitAccept = async (visitId) => {
        try {
            await axios.patch("/api/sangh/PatchDocVisit", { visitId });
            setDairiesWithVisits((prevDairies) =>
                prevDairies.map((dairy) => ({
                    ...dairy,
                    visits: dairy.visits.map((visit) =>
                        visit._id === visitId ? { ...visit, status: "Accepted" } : visit
                    ),
                }))
            );
        } catch (error) {
            console.error("Error accepting visit:", error.message);
            alert("Failed to accept visit");
        }
    };

    const calculateProgress = (status) => {
        switch (status) {
            case "Completed":
                return 100;
            case "Accepted":
                return 50;
            case "Pending":
            case "Order Placed":
            default:
                return 0;
        }
    };

    const groupedVisits = dairiesWithVisits.reduce((acc, dairy) => {
        if (!acc[dairy.dairyName]) acc[dairy.dairyName] = { visits: [], dairyName: dairy.dairyName };
        acc[dairy.dairyName].visits.push(dairy);
        return acc;
    }, {});

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-col w-full items-center min-h-screen bg-gray-300 p-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-700">Dairies and Their Visits</h1>
            <div className="flex flex-row w-full justify-center space-x-4">
                <Link href="/home/AllDairies/AcceptedVisits">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4">
                        Check Accepted Visits
                    </button>
                </Link>
                <Link href="/home/AllDairies/CompletedVisits">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4">
                        Check Completed Visits
                    </button>
                </Link>
            </div>
            {Object.values(groupedVisits).map((dairy) => (
                <div
                    key={dairy.dairyName}
                    className={`bg-white shadow-lg rounded-lg p-6 w-full mb-4 cursor-pointer ${
                        expandedDairy === dairy.dairyName ? "border-2 border-green-500" : ""
                    }`}
                    onClick={() => setExpandedDairy(expandedDairy === dairy.dairyName ? null : dairy.dairyName)}
                >
                    <h2 className="text-xl font-semibold text-gray-800">{dairy.dairyName}</h2>
                    {expandedDairy === dairy.dairyName && (
                        <div className="mt-4">
                            <h3 className="font-bold text-green-600">Pending Visits</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                {dairy.visits.map((visit) => (
                                    <VisitComponent
                                        key={visit._id}
                                        visit={visit}
                                        onAccept={handleVisitAccept}
                                        onSend={handleSendButtonClick}
                                        calculateProgress={calculateProgress}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <VisitDetailsModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} />
        </div>
    );
};

const VisitComponent = ({ visit, onAccept, onSend, calculateProgress }) => (
    <div className="p-4 bg-blue-300 rounded-lg mb-4">
        <p className="text-black font-bold">Doctor: {visit.username}</p>
        <p className="text-black">Disease: {visit.Decises}</p>
        {visit.status !== "Completed" && (
            <button
                className={`${
                    visit.status === "Accepted" ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                } text-white font-bold py-2 px-4 rounded mt-2`}
                onClick={() => onSend(visit._id)}
            >
                Accept Visit
            </button>
        )}
        <div className="relative pt-1 mt-4">
            <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-semibold inline-block text-teal-600 uppercase px-2 py-1 rounded-full">
                    {calculateProgress(visit.status)}%
                </span>
            </div>
            <div className="flex h-2 mb-2 overflow-hidden text-xs bg-gray-200 rounded">
                <div
                    style={{ width: `${calculateProgress(visit.status)}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-600"
                />
            </div>
        </div>
    </div>
);

export default DisplayDairiesWithVisits;
