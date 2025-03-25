import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import VikriMilk from "@/models/vikriMilk";
import User from "@/models/sthanikVikri";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
    try {
        const ownerId = await getDataFromToken(request);
        console.log("ownerId", ownerId);
        
        if (!ownerId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (!startDate || !endDate) {
            return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
        }

        // ✅ Find all users created by the ownerId
        const users = await User.find({ createdBy: ownerId });
        if (!users.length) {
            return NextResponse.json({ error: "No users found" }, { status: 404 });
        }

        // ✅ Extract user IDs
        const userIds = users.map(user => user._id);

        // ✅ Find all VikriMilk created by these users
        const vikriMilk = await VikriMilk.find({
            createdBy: { $in: userIds },
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).populate('createdBy', 'registerNo');

        console.log("vikriMilk", vikriMilk);

        return NextResponse.json({ data: vikriMilk }, { status: 200 });
    } catch (error) {
        console.error("Error fetching Vikri Milk records:", error);
        return NextResponse.json({ error: "Failed to fetch Vikri Milk records" }, { status: 500 });
    }
}
