import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
    try {
        // Extract query parameters for startDate and endDate from the URL
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Retrieve owner ID from the token
        const ownerId = await getDataFromToken(request);

        // Find the owner and populate userMilk records
        const owner = await Owner.findById(ownerId)
            .populate({
                path: "userMilk",
                match: {
                    // Filter milk records by date range if startDate and endDate are provided
                    date: {
                        ...(startDate && { $gte: new Date(startDate) }),
                        ...(endDate && { $lte: new Date(endDate) }),
                    },
                },
            });

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "Milk records fetched successfully",
            data: owner.userMilk, // Returns filtered milk records
        });
    } catch (error) {
        console.log("Error fetching milk records:", error);
        return NextResponse.json({ error: "Failed to fetch milk records" }, { status: 500 });
    }
}
