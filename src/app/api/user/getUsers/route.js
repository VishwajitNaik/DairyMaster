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

        // Parsing query parameters from the request URL
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);  // Default to 1 if not present
        const pageSize = parseInt(url.searchParams.get('limit') || '10', 10);  // Default to 10 if not present

        // Find the owner by ID and populate the 'users' field
        const owner = await Owner.findById(ownerId)
            .populate({
                path: 'users',
                options: { 
                    sort: { registerNo: 1 },
                    skip: (page - 1) * pageSize,   // Skip the previous pages' results
                    limit: pageSize  // Limit the number of results per page
                },
            });


        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }


        // Get the populated users from the owner
        const users = owner.users;    

        // Get the total number of users (not just the current page's users)
        const totalUsers = await User.countDocuments({ createdBy: ownerId });
        console.log("totalUsers", totalUsers);
        

        // Return the owner data along with the populated 'users' field and pagination details
        return NextResponse.json({
            data: users,
            total: totalUsers,
            currentPage: page,
            pageSize: pageSize,
        }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
