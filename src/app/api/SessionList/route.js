import { getDataFromToken } from "../../../helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";
import Milk from "@/models/MilkModel"; // Assuming you have a Milk model to query milk records

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
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Adjust time for AWS timezone issues
        const isProduction = process.env.NODE_ENV === "production";

        const today = new Date();
        const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0));
        const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));

        // Determine session based on UTC time
        const currentHour = today.getUTCHours(); // Use UTC time to avoid AWS time differences
        const currentSession = currentHour < 12 ? "morning" : "evening";

        // Get all milk records for today and current session
        const allMilkRecords = await Milk.find({
            createdBy: { $in: owner.users.map(user => user._id) },
            date: { $gte: startOfDay, $lte: endOfDay },
            session: currentSession
        });

        // Create a Set of user IDs who have already taken milk
        const takenMilkUserIds = new Set(allMilkRecords.map(record => record.createdBy.toString()));

        // Filter users who have NOT taken milk
        const filteredUsers = owner.users.filter(user => !takenMilkUserIds.has(user._id.toString()));

        return NextResponse.json({ data: filteredUsers }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
