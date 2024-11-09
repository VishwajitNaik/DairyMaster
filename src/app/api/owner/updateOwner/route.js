// pages/api/owner/updateOwner.js
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";

connect();

export async function PUT(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const updatedData = await request.json(); // Get updated data from request body

        const updatedOwner = await Owner.findByIdAndUpdate(ownerId, updatedData, { new: true });

        if (!updatedOwner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        return NextResponse.json({ data: updatedOwner }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
