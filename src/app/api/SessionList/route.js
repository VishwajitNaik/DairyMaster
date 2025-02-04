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

        // Adjust to UTC to fix AWS timezone issues
        const isProduction = process.env.NODE_ENV === "production";

        const today = new Date();
        const startOfDay = isProduction 
            ? new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0)) 
            : new Date(today.setHours(0, 0, 0, 0));
        
        const endOfDay = isProduction 
            ? new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59)) 
            : new Date(today.setHours(23, 59, 59, 999));
        

        // Determine session based on AWS UTC time
        const currentHour = today.getUTCHours(); // Use UTC hours to avoid AWS issues
        const currentSession = currentHour < 12 ? "morning" : "evening";

        // Sequential fetching to avoid overload
        const filteredUsers = [];
        for (const user of owner.users) {
            const milkRecords = await Milk.find({
                createdBy: user._id,
                date: { $gte: startOfDay, $lte: endOfDay },
                session: currentSession
            }).read('primary'); // Ensures fresh data from primary DB node

            if (milkRecords.length === 0) {
                filteredUsers.push(user);
            }
        }

        return NextResponse.json({ data: filteredUsers }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
