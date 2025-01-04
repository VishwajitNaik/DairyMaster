import { getDataFromToken } from "@/helpers/getSanghFormToken.js";
import { NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import Decies from "@/models/Decieses";
import mongoose from "mongoose";
connect();

export async function GET(request) {
    try {
        const sanghId = await getDataFromToken(request);

        if (!sanghId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const decieses = await Decies.find({ createdBy: sanghId });

        if (!decieses || decieses.length === 0) {
            return NextResponse.json({ message: "No Decies found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Decies fetched successfully",
            data: decieses,
        });
    } catch (error) {
        console.error("Error fetching Decies:", error);
        return NextResponse.json({ error: "Error fetching Decies" }, { status: 500 });
    }
}
