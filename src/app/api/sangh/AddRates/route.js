import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import Rates from "@/models/RatesSangh.js";

connect();

export async function POST(request) {
    try {
        const sanghId = await getDataFromToken(request);

        if (!sanghId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const reqBody = await request.json();
        const {HighFatB, HighRateB, LowFatB, LowRateB, HighFatC, HighRateC, LowFatC, LowRateC} = reqBody;

        if(!HighFatB || !HighRateB || !LowFatB || !LowRateB || !HighFatC || !HighRateC || !LowFatC || !LowRateC){
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newRates = new Rates({
            HighFatB,
            HighRateB,
            LowFatB,
            LowRateB,
            HighFatC,
            HighRateC,
            LowFatC,
            LowRateC,
            createdBy: sanghId,
        });

        const savedRates = await newRates.save();

        return NextResponse.json({
            message: "Rates created successfully...",
            data: savedRates
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}