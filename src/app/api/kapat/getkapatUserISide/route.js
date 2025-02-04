import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getUserDataFromToken";
import Sthirkapat from "@/models/sthirkapat";
import mongoose from "mongoose";

connect();

export async function GET(request) {
    try {
        // Step 1: Get the token from the request and decode it
        const tokenUserId = await getDataFromToken(request);
        console.log("Decoded Token:", tokenUserId);

        // Step 2: If no user ID from the token, return Unauthorized
        if (!tokenUserId) {
            console.log("No tokenUserId found, Unauthorized access");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Step 3: Log tokenUserId to verify it
        console.log("tokenUserId:", tokenUserId);

        // Step 4: Check if the database is connected
        console.log("Database connected:", mongoose.connection.readyState); // Should be 1 if connected (connected state)

        // Step 5: Query the User collection with the decoded user ID and populate the selectedKapat field
        const user = await User.findOne({ _id: tokenUserId }).populate("selectedKapat");

        // Step 6: Log the user fetched from the database
        console.log("User query result:", user);

        // Step 7: If no user is found, return a "User not found" error
        if (!user) {
            console.log("No user found with ID:", tokenUserId); // Log if user is not found
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Step 8: If user found, log the user data with populated selectedKapat
        console.log("User data with populated selectedKapat:", user.selectedKapat);

        // Step 9: Return the populated 'selectedKapat' data or an empty array if not populated
        return NextResponse.json({
            message: "Kapat fetched successfully",
            data: user.selectedKapat, // You can also return the full user data if needed
        });

    } catch (error) {
        // Step 10: Catch any errors and log them for debugging
        console.error("Error fetching kapat:", error);
        return NextResponse.json({ error: "Failed to fetch kapat" }, { status: 500 });
    }
}
