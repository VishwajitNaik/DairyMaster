import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Rate from '@/models/rateModel'; // Adjust the import path if needed
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function POST(request) {
    try {
        // Get owner ID from token
        const ownerId = await getDataFromToken(request);
        const reqBody = await request.json();

        const { HighFatB, HighRateB, LowFatB, LowRateB, HighFatC, HighRateC, LowFatC, LowRateC } = reqBody;

        // Validate required fields
        if (!HighFatB || !HighRateB || !LowFatB || !LowRateB || !HighFatC || !HighRateC || !LowFatC || !LowRateC) {
            console.error("Missing required fields:", { HighFatB, HighRateB, LowFatB, LowRateB, HighFatC, HighRateC, LowFatC, LowRateC });
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Create new rate document
        const newRate = new Rate({
            HighFatB,
            HighRateB,
            LowFatB,
            LowRateB,
            HighFatC,
            HighRateC,
            LowFatC,
            LowRateC,
            createdBy: ownerId, // Assuming the rate is associated with the owner
        });

        const savedRate = await newRate.save();

        return NextResponse.json({ message: "Rate stored successfully", data: savedRate }, { status: 201 });
    } catch (error) {
        console.error("Error storing rate information:", error.message);
        return NextResponse.json({ error: "Error storing rate information", details: error.message }, { status: 500 });
    }
}
