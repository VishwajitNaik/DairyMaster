import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Ucchal from "@/models/ucchalModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import Owner from "@/models/ownerModel";

connect();

export async function POST(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const owner = await Owner.findById(ownerId);
        if (!owner) {
            console.error("Owner not found:", ownerId);
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        const reqBody = await request.json();
        const { registerNo, date, username, rakkam } = reqBody;

        // ✅ Validate all required fields
        if (!registerNo || !date || !username || !rakkam) {
            console.error("Missing required fields:", { registerNo, date, username, rakkam });
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // ✅ Validate data types
        if (isNaN(rakkam)) {
            return NextResponse.json({ error: "Rakkam must be a valid number" }, { status: 400 });
        }

        const user = await User.findOne({ registerNo, createdBy: ownerId });

        if (!user) {
            console.error("User not found:", { registerNo, ownerId });
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ✅ Create new Ucchal record
        const newUcchal = new Ucchal({
            registerNo,
            date: new Date(date),
            username,
            rakkam,
            createdBy: user._id,
        });
        
        // ✅ Save the record using `.save()` (NOT `.insertOne()`)
        const result = await newUcchal.save();
// ✅ Update Owner's ucchal array
await Owner.findByIdAndUpdate(
    ownerId,
    { $push: { ucchal: result._id } }
);

// ✅ Update User's ucchal array
await User.findByIdAndUpdate(
    user._id,
    { $push: { ucchal: result._id } }
);

        return NextResponse.json({ message: "Ucchal entry added successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error storing ucchal information:", error.message);
        return NextResponse.json({ error: "Failed to store ucchal information" }, { status: 500 });
    }
}
