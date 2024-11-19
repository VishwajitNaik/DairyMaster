import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
    try {
        // Extract query parameters for startDate, endDate, page, and limit from the URL
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const page = parseInt(searchParams.get("page")) || 1; // Default to page 1 if not provided
        const limit = parseInt(searchParams.get("limit")) || 1; // Default to 1 record per page for testing

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Retrieve owner ID from the token
        const ownerId = await getDataFromToken(request);

        // Find the owner and populate userMilk records with pagination and filtering by date range
        const owner = await Owner.findById(ownerId)
            .populate({
                path: "userMilk",
                match: {
                    // Filter milk records by date range if startDate and endDate are provided
                    date: {
                        ...(startDate && { $gte: new Date(startDate) }),
                        ...(endDate && { $lte: new Date(endDate) }),
                    },
                },
                options: {
                    skip: skip, // Skip the records for the current page
                    limit: limit, // Limit to 1 record per page
                }
            });

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Get total milk records to calculate total pages
        const totalRecords = await Owner.countDocuments({
            _id: ownerId,
            "userMilk.date": {
                ...(startDate && { $gte: new Date(startDate) }),
                ...(endDate && { $lte: new Date(endDate) }),
            },
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalRecords / limit);

        return NextResponse.json({
            message: "Milk records fetched successfully",
            data: owner.userMilk,
            totalPages: totalPages, // Add totalPages to the response
        });
    } catch (error) {
        console.log("Error fetching milk records:", error);
        return NextResponse.json({ error: "Failed to fetch milk records" }, { status: 500 });
    }
}
