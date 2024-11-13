import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig"; 
import MakeMilk from "@/models/MakeMilk";
import Owner from "@/models/ownerModel";

export async function GET(request) {
    try {
        await connect();

        const sanghId = await getDataFromToken(request);

        // Validate the SanghId
        if (!sanghId) {
            console.log("Invalid or missing token");
            return NextResponse.json(
                { error: 'Invalid or missing token' },
                { status: 401 }
            );
        }

        // Find the owner by sanghId
        const owner = await Owner.findOne({ sangh: sanghId });
        if (!owner) {
            console.log("Owner not found for SanghId:", sanghId);
            return NextResponse.json(
                { error: "Owner not found." },
                { status: 404 }
            );
        }

        // Fetch all milk records for the owner
        const milkRecords = await MakeMilk.find({ createdBy: owner._id });

        // Check if there are no records found
        if (milkRecords.length === 0) {
            return NextResponse.json({
                message: "No milk records found for this owner.",
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "Milk records retrieved successfully.",
            data: milkRecords
        }, { status: 200 });

    } catch (error) {
        console.error("Error retrieving milk records:", error.message);
        return NextResponse.json({
            error: "Error retrieving milk records.",
            details: error.message,
        }, { status: 500 });
    }
}
