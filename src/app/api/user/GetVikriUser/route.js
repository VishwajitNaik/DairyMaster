import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig.js";
import Owner from "@/models/ownerModel";

connect();

export async function GET(request) {
    try {
        const ownerId = getDataFromToken(request);

        if (!ownerId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const owner = await Owner.findById(ownerId)
            .populate({
                path: 'SthanikVikriuser',
                options: {
                    sort: { registerNo: 1 }
                },
            });

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        const vikriUsers = owner.SthanikVikriuser;

        return NextResponse.json({ data: vikriUsers }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch vikri users:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}