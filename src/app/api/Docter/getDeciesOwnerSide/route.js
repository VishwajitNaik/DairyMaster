import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import Decies from "@/models/Decieses";
import Owner from "@/models/ownerModel.js";
import mongoose from "mongoose";
connect();

export async function GET(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const owner = await Owner.findById(ownerId);
        

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }
        // Convert owner.sangh to Mongoose ObjectId
        const sanghId = new mongoose.Types.ObjectId(owner.sangh); // Use 'new' here

        const decieses = await Decies.find({ createdBy: sanghId });

        console.log("decieses", decieses);
        

        if (!decieses || decieses.length === 0) {
            return NextResponse.json({ message: "No Decies found" }, { status: 402 });
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
