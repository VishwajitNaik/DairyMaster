import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import MakeMilk from "@/models/MakeMilk";
import Owner from "@/models/ownerModel";

export async function GET(request) {
    try {
        // Connect to the database
        await connect();

        // Extract token and validate it
        const sanghId = await getDataFromToken(request);
        if (!sanghId) {
            console.error("Invalid or missing token:", request.headers.get("Authorization"));
            return NextResponse.json(
                { error: "Invalid or missing token." },
                { status: 401 }
            );
        }

        // Extract query parameters from the URL
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Validate the date range inputs
        if (!startDate || !endDate) {
            console.error("Missing or invalid date parameters:", { startDate, endDate });
            return NextResponse.json(
                { error: "Both startDate and endDate are required and must be valid dates." },
                { status: 400 }
            );
        }

        // Find the owner by Sangh ID
        const owner = await Owner.findOne({ sangh: sanghId });
        if (!owner) {
            console.error("Owner not found for SanghId:", sanghId);
            return NextResponse.json(
                { error: "Owner not found." },
                { status: 404 }
            );
        }

        // Fetch milk records within the date range for the owner
        const milkRecords = await MakeMilk.find({
            createdBy: owner._id,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        });

        // Separate records by session and milk type
        const MorningMilkRecords = milkRecords.filter(record => record.session === "morning");
        const EveningMilkRecords = milkRecords.filter(record => record.session === "evening");

        const CowMorningMilkRecords = MorningMilkRecords.filter(record => record.milkType === "cow");
        const BuffaloMorningMilkRecords = MorningMilkRecords.filter(record => record.milkType === "buff");
        const CowEveningMilkRecords = EveningMilkRecords.filter(record => record.milkType === "cow");
        const BuffaloEveningMilkRecords = EveningMilkRecords.filter(record => record.milkType === "buff");

        // Return response with milk records
        return NextResponse.json({
            message: milkRecords.length
                ? "Milk records retrieved successfully."
                : "No milk records found for this date range.",
            data: milkRecords,
            CowMorningMilkRecords,
            BuffaloMorningMilkRecords,
            CowEveningMilkRecords,
            BuffaloEveningMilkRecords,
        }, { status: 200 });

    } catch (error) {
        console.error("Error retrieving milk records:", error.message);
        return NextResponse.json(
            { error: "Error retrieving milk records.", details: error.message },
            { status: 500 }
        );
    }
}
