import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";

connect();

export async function GET(request) {
    try {
        // Retrieve the owner ID from the token
        const ownerId = await getDataFromToken(request);
        
        // Fetch the specific owner from the database using the ownerId
        const owner = await Owner.findById(ownerId); // Find owner by ID

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        return NextResponse.json({ data: owner }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch owner profile:", error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
