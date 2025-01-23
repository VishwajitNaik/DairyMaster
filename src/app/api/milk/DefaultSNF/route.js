import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import DefaultSNF from "@/models/DefaultSNF";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Establish database connection
connect();

export async function POST(request) {
    try {
        // Extract ownerId from token
        const ownerId = await getDataFromToken(request);

        // Parse request body
        const reqBody = await request.json();
        const { snf } = reqBody;

        // Validate required fields
        if (!snf) {
            return NextResponse.json(
                { error: "SNF संपादित करा " },
                { status: 400 }
            );
        }

        // Check if a DefaultSNF document already exists for the user
        const existingDefaultSNF = await DefaultSNF.findOne({ createdBy: ownerId });

        if (existingDefaultSNF) {
            // Update the existing document
            existingDefaultSNF.snf = snf;
            const updatedDefaultSNF = await existingDefaultSNF.save();

            return NextResponse.json({
                message: "Default SNF updated successfully",
                data: updatedDefaultSNF,
            });
        } else {
            // Create a new DefaultSNF document
            const newDefaultSNF = new DefaultSNF({
                snf,
                createdBy: ownerId,
            });

            // Save the new document to the database
            const savedDefaultSNF = await newDefaultSNF.save();

            return NextResponse.json({
                message: "Default SNF added successfully",
                data: savedDefaultSNF,
            });
        }
    } catch (error) {
        console.error("Error adding or updating default SNF:", error.message);
        return NextResponse.json(
            { error: "Error adding or updating default SNF" },
            { status: 500 }
        );
    }
}
