import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import BillKapat from "@/models/BillKapat";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

connect();

export async function POST(request) {
    try {
        const { startDate, endDate } = await request.json();

        const OwnerId = await getDataFromToken(request);

        const user = await User.find({ createdBy: OwnerId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find all users created by the OwnerId
        const billKapatRecords = await BillKapat.find({
            createdBy: { $in: user.map(user => user._id) }, // Match createdBy with userIds of the fetched users
            orderData: "उच्चल",
        }).populate("createdBy", "registerNo name");

        return NextResponse.json({ data: billKapatRecords }, { status: 200 });
    } catch (error) {
        console.error("Error fetching Bill Kapat records:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
