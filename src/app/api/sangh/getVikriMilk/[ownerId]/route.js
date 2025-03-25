import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig"; // Ensure your DB connection is working
import Owner from "@/models/ownerModel";
import VikriUser from "@/models/sthanikVikri";
import { getDataFromToken } from "@/helpers/getSanghFormToken"; // Import function to extract data from token

connect();

export async function GET(request, {params}) {
    try {
        const { ownerId } = params; // Get ownerId from request params
        const sanghId = await getDataFromToken(request); // Extract Sangh ID from the token
        const url = new URL(request.url);
        const startDate = url.searchParams.get("startDate");
        const endDate = url.searchParams.get("endDate");

        if (!ownerId) {
            return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
        }

        if (!sanghId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }


        // Parse startDate and endDate to Date objects
        const start = startDate ? new Date(startDate) : new Date(0); // Default to epoch start
        const end = endDate ? new Date(endDate) : new Date(); // Default to now

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        // Fetch owner data
        const owner = await Owner.findOne({ _id: ownerId, sangh: sanghId });

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Fetch users created by the owner, including their milk records
        const ownerCreatedUsers = await VikriUser.find({ createdBy: ownerId }).populate("vikriMilk");

        if (ownerCreatedUsers.length === 0) {
            return NextResponse.json({ message: "No users found for this owner", data: [] }, { status: 200 });
        }

        let totalLiters = 0;
        let totalRakkam = 0;
        let recordCount = 0;

        // Aggregate milk records
        const userData = ownerCreatedUsers.map(user => {
            const filteredRecords = user.vikriMilk.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate >= start && recordDate <= end;
            });

            filteredRecords.forEach(record => { 
                totalLiters += record.liter || 0;
                totalRakkam += record.rakkam || 0;
                recordCount++;
            });

            return {
                _id: user._id,
                name: user.name,
                totalLiters,
                totalRakkam,
                recordCount,
            };
        });

        return NextResponse.json({ 
            message: "Milk information fetched successfully",
            data: {
                owner: {
                    _id: owner._id,
                    name: owner.name, // Assuming 'name' field exists in Owner model
                },
                totalLiters: totalLiters.toFixed(2),
                totalRakkam: totalRakkam.toFixed(2),
                recordCount,
                userData,
            },

         }, { status: 200 });

    } catch (error) {
        console.error("Error fetching milk information:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}