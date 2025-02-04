import { getDataFromToken } from "@/helpers/getUserDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import BillStorage from "@/models/BillStorage";
import User from "@/models/userModel";

connect();

export async function POST(request) {
    try {
        const userId = await getDataFromToken(request);

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { registerNo, name } = user;

        const userBill = await BillStorage.find({ registerNo, name });

        return NextResponse.json({ userBill }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
