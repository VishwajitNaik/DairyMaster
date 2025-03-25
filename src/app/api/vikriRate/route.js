import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import VikriRate from "@/models/VikriRateModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request) {
    try {
        const OwnerId = await getDataFromToken(request);

        if (!OwnerId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const reqBody = await request.json();
        const { VikriRateBuff, VikriRateCow } = reqBody;

        if(!VikriRateBuff || !VikriRateCow) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const VikriRateData = { VikriRateBuff: parseFloat(VikriRateBuff), VikriRateCow: parseFloat(VikriRateCow), createdBy: OwnerId };

        // store data 
        const newVikriRate = new VikriRate(VikriRateData);
        const savedVikriRate = await newVikriRate.save();

        return NextResponse.json({ message: "VikriRate added successfully", data: savedVikriRate });
        


    } catch (error) {
        console.error("Error adding Domy to queue:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}