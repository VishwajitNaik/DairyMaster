import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";
import User from "@/models/userModel";

connect();

export async function GET(request, { params }) {
    try {
        const { ownerId } = params;
        console.log(ownerId);

        if (!ownerId) {
            return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
        }

        const owner = await Owner.findOne({ _id: ownerId });

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Fetch users created by the owner
        const ownerCreatedUsers = await User.find({ createdBy: ownerId }).populate('milkRecords'); // Populate milkRecords

        console.log(ownerCreatedUsers);

        // Extract milk records for each user
        const usersWithMilkRecords = ownerCreatedUsers.map(user => ({
            ...user.toObject(),
            milkRecords: user.milkRecords // This will include milk records with detailed information
        }));

        return NextResponse.json({
            message: "Owner fetched successfully",
            data: owner,
            userData: usersWithMilkRecords, // Include users with their milk records
        });

    } catch (error) {
        console.error("Error fetching owner:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
