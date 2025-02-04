import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig"; // Ensure your DB connection is working
import Owner from "@/models/ownerModel"; // Import Owner model
import User from "@/models/userModel"; // Import User model

// Ensure DB connection
connect();

export async function GET(request, { params }) {
    try {
        const { ownerId } = params; // Get ownerId from request params
        const url = new URL(request.url);
        const startDate = url.searchParams.get("startDate");
        const endDate = url.searchParams.get("endDate");

        if (!ownerId) {
            return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
        }

        // Parse startDate and endDate to Date objects
        const start = startDate ? new Date(startDate) : new Date(0); // Default to epoch start
        const end = endDate ? new Date(endDate) : new Date(); // Default to now

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        // Fetch owner data
        const owner = await Owner.findOne({ _id: ownerId });

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Fetch users created by the owner, including their milk records
        const ownerCreatedUsers = await User.find({ createdBy: ownerId }).populate("milkRecords");

        if (ownerCreatedUsers.length === 0) {
            return NextResponse.json({ message: "No users found for this owner", data: [] }, { status: 200 });
        }

        let totalLiters = 0;
        let totalFat = 0;
        let totalSNF = 0;
        let recordCount = 0;
        let totalRakkam = 0;

        // Aggregate milk records
        const userData = ownerCreatedUsers.map(user => {
            const filteredRecords = user.milkRecords.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate >= start && recordDate <= end;
            });

            filteredRecords.forEach(record => {
                totalLiters += record.liter || 0;
                totalFat += record.fat || 0;
                totalSNF += record.snf || 0;
                totalRakkam += record.rakkam || 0;
                recordCount++;
            });

            return {
                _id: user._id,
                username: user.username, // Or any other user fields you want to return
                milkRecords: filteredRecords,
            };
        });

        const avgFat = recordCount > 0 ? totalFat / recordCount : 0;
        const avgSNF = recordCount > 0 ? totalSNF / recordCount : 0;

        // Return response
        return NextResponse.json({
            message: "Milk information fetched successfully",
            data: {
                owner,
                totalLiters: totalLiters.toFixed(2),
                avgFat: avgFat.toFixed(2), // Round to 2 decimals if required
                avgSNF: avgSNF.toFixed(2),
                totalRakkam: totalRakkam.toFixed(2),
                userData,
            },
        });
    } catch (error) {
        console.error("Error fetching milk information:", error);
        return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
    }
}
