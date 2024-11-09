// app/api/sangh/getMilkInfo/route.js
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig"; // Ensure your DB connection is working
import Owner from "@/models/ownerModel"; // Import Owner model
import User from "@/models/userModel"; // Import User model

// Ensure DB connection
connect();

export async function GET(request, { params }) {
    try {
        const { ownerId } = params; // Get ownerId from request params

        if (!ownerId) {
            return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
        }

        // Fetch owner data
        const owner = await Owner.findOne({ _id: ownerId });

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Fetch users created by the owner, including their milk records
        const ownerCreatedUsers = await User.find({ createdBy: ownerId }).populate('milkRecords');

        // Variables for total milk, average fat, and average SNF
        let totalLiters = 0;
        let totalFat = 0;
        let totalSNF = 0;
        let totalUsers = 0;

        // Calculate total milk (liters), total fat, and total SNF
        ownerCreatedUsers.forEach(user => {
            if (user.milkRecords && user.milkRecords.length > 0) {
                user.milkRecords.forEach(record => {
                    totalLiters += record.liter || 0; // Add liters of milk
                    totalFat += record.fat || 0; // Add fat
                    totalSNF += record.snf || 0; // Add SNF
                    totalUsers += 1; // Count the number of users
                });
            }
        });

        // Calculate averages for fat and SNF
        const avgFat = totalUsers > 0 ? totalFat / totalUsers : 0;
        const avgSNF = totalUsers > 0 ? totalSNF / totalUsers : 0;

        // Return the milk information for the owner
        return NextResponse.json({
            message: "Milk information fetched successfully",
            data: {
                owner,
                totalLiters,
                avgFat,
                avgSNF,
                userData: ownerCreatedUsers,
            }
        });

    } catch (error) {
        console.error("Error fetching milk information:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
