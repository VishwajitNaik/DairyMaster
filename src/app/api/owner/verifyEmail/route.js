import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Owner from "@/models/ownerModel";

connect()

export async function POST(request) {
    try {
        const { token } = await request.json();

        const owner = await Owner.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        });

        if (!owner) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        owner.isVerified = true;
        owner.verifyToken = undefined;
        owner.verifyTokenExpiry = undefined;
        await owner.save();

        return NextResponse.json({ message: "Verified successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
