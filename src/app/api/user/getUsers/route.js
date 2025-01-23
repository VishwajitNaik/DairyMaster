import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";
import User from "@/models/userModel";

// Connect to the database
connect();

export async function GET(request) {
    try {
        // Get the owner ID from the token
        const ownerId = await getDataFromToken(request);

        if (!ownerId) {
            return NextResponse.json({ error: "Owner ID not found in token" }, { status: 400 });
        }

        // Find the owner by ID and populate the 'users' field
        const owner = await Owner.findById(ownerId).populate('users');

        

        const user = await User.find({ createdBy: ownerId }).sort({ registerNo: 1 });
        console.log("user", user);
        

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Return the owner data along with the populated 'users' field
        return NextResponse.json({ data: user }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
