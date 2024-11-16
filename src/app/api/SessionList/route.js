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

        // Determine today's date
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Determine the current session based on the time of day
        const currentHour = new Date().getHours();
        const currentSession = currentHour < 12 ? "morning" : "evening";

        // Filter users based on milk records
        const usersWithoutMilkRecords = await Promise.all(
            owner.users.map(async (user) => {
                // Find the milk records for the user for today's date and session
                const milkRecords = await Milk.find({
                    createdBy: user._id,
                    date: { $gte: startOfDay, $lte: endOfDay },
                    session: currentSession
                });

                // If no milk records exist for the current date and session, include the user
                if (milkRecords.length === 0) {
                    return user;
                }
                return null;
            })
        );

        // Filter out any null values (users with milk records for the current session)
        const filteredUsers = usersWithoutMilkRecords.filter((user) => user !== null);

        // Return the users who don't have milk records for the current session
        return NextResponse.json({ data: filteredUsers }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
