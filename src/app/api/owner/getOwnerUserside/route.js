import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";

connect();

export async function GET(request) {
    try {
        // Retrieve the owner ID from the token (if needed)
        
        // Fetch all owners from the database
        const owners = await Owner.find({}); // Find all owners

        return NextResponse.json({ data: owners }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch owners:", error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
