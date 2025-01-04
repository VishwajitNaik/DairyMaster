import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import Decies from "@/models/Decieses";

connect();

export async function POST(request) {
    try {
        const sanghId = await getDataFromToken(request);

        if (!sanghId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const reqBody = await request.json()
        const { Decieses } = reqBody;


        if (!Decieses) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newDecies = new Decies({
            Decieses,
            createdBy: sanghId,
        });

        const savedDecies = await newDecies.save();

        return NextResponse.json({
            message: "Decies added sucessfully",
            data: savedDecies
        });
    

    } catch (error) {
        console.error("Error adding Decies:", error);
        return NextResponse.json({ error: "Error adding Decies" }, { status: 500 });    
    }
}