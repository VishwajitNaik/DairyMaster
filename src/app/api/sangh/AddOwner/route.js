import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import SanghOnwer from "@/models/sanghAddOwner.js";

// Connect to the database
connect();

export async function POST(request) {
    try {
        const sanghId = await getDataFromToken(request);

        if (!sanghId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const reqBody = await request.json();
        const { registerNo, DairyName } = reqBody;  // Ensure registerNo is used here

        if (!registerNo || !DairyName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newOwnerRegNo = new SanghOnwer({
            registerNo,
            DairyName,
            createdBy: sanghId,
        });

        const savedSanghOnwer = await newOwnerRegNo.save();

        return NextResponse.json({
            message: "User created successfully...",
            data: savedSanghOnwer
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
