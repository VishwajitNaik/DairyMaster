import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/dbconfig/dbconfig";
import VikriRate from "@/models/VikriRateModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// ✅ Function to check and establish connection
const ensureDbConnection = async () => {
    if (mongoose.connection.readyState !== 1) {
        console.log("MongoDB not connected. Trying to reconnect...");
        await connect(); // Try to reconnect if not connected
    }
};

// ✅ GET Route - Fetch VikriRate Data
export async function GET(request) {
    try {
        // ✅ Ensure connection is established
        await ensureDbConnection();

        const OwnerId = await getDataFromToken(request);

        if (!OwnerId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        // Get all VikriRate entries created by the logged-in user
        const vikriRates = await VikriRate.find({ createdBy: OwnerId });

        return NextResponse.json({ data: vikriRates });
        
    } catch (error) {
        console.error("Error fetching VikriRate data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ✅ DELETE Route - Delete VikriRate by ID from Request Body
export async function DELETE(request) {
    try {
        // ✅ Ensure connection is established
        await ensureDbConnection();

        const OwnerId = await getDataFromToken(request);

        if (!OwnerId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const reqBody = await request.json(); // Get data from request body
        const { id } = reqBody;

        if (!id) {
            return NextResponse.json({ error: "Missing VikriRate ID" }, { status: 400 });
        }

        const deletedVikriRate = await VikriRate.findOneAndDelete({ _id: id, createdBy: OwnerId });

        if (!deletedVikriRate) {
            return NextResponse.json({ error: "VikriRate not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "VikriRate deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting VikriRate data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
