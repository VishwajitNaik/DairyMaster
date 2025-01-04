import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";

// Connect to the database
connect();

export async function PUT(request) {
    try {
        // Get the owner ID from the token
        const ownerId = await getDataFromToken(request);

        if (!ownerId) {
            return NextResponse.json({ error: "Owner ID not found in token" }, { status: 400 });
        }

        // Parse the request body to get the updated user data
        const { userId, updatedData } = await request.json();

        if (!userId || !updatedData) {
            return NextResponse.json({ error: "User ID or updated data is missing" }, { status: 400 });
        }

        // Find the user by ID and update the fields
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        console.log("Updated User:", updatedUser);
        

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return the updated user data
        return NextResponse.json({ data: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Failed to update user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
