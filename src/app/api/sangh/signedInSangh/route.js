import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Sangh from "@/models/SanghModel";
import { getDataFromToken } from "@/helpers/getSanghFormToken"; // Helper function to decode token and get user info

// Establish a database connection
connect();

export async function GET(request) {
    try {
        // Extract token from request headers (assuming JWT authentication)
        const token = request.headers.get("Authorization")?.split(" ")[1];
        console.log("sangh token : ", token);
        if (!token) {
            return NextResponse.json({ error: "Authentication token is missing" }, { status: 401 });
        }

        // Use a helper function to extract user data from the token
        const { userId } = await getDataFromToken(token);
        if (!userId) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        // Fetch the Sangh associated with the logged-in user
        const sangh = await Sangh.findOne({ ownerId: userId });
        if (!sangh) {
            return NextResponse.json({ error: "Sangh not found for the logged-in user" }, { status: 404 });
        }

        // Return the fetched Sangh data
        return NextResponse.json({ data: sangh }, { status: 200 });

    } catch (error) {
        console.error("Error fetching Sangh:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}