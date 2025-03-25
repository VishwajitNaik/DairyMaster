import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import VikriMilk from "@/models/vikriMilk";
import Owner from "@/models/ownerModel";
import VikriUser from "@/models/sthanikVikri";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request) {
    try {
        // Fetch ownerId from token
        const ownerId = await getDataFromToken(request);
        if (!ownerId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse request body
        const { date, session, registerNo, milk, liter, dar, rakkam } = await request.json();
        if (!date || !session || !registerNo || !milk || !liter || !dar || !rakkam) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Find VikriUser
        const vikriUser = await VikriUser.findOne({ registerNo, createdBy: ownerId });
        if (!vikriUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find Owner
        const owner = await Owner.findById(ownerId);
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Check if VikriMilk record already exists
        const currentDate = new Date(date);
        const existingRecord = await VikriMilk.findOne({
            createdBy: vikriUser._id,
            session,
            milk,
            date: currentDate,
        });

        if (existingRecord) {
            return NextResponse.json({ error: "Vikri Milk record already exists" }, { status: 400 });
        }

        // Create new VikriMilk record
        const vikriMilkRecord = new VikriMilk({
            registerNo,
            session,
            milk,
            liter,
            dar,
            rakkam,
            date: currentDate,
            createdBy: vikriUser._id,
        });

        await vikriMilkRecord.save();

        owner.VikrUseriMilk.push(vikriMilkRecord._id);
        await owner.save();

        vikriUser.vikriMilk.push(vikriMilkRecord._id);
        await vikriUser.save();

        return NextResponse.json(
            { message: "Vikri Milk record added successfully", data: vikriMilkRecord },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error adding Vikri Milk record:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}