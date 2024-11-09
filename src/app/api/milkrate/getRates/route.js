// app/api/milkrate/getrates/route.js

import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Rate from '@/models/rateModel';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function GET(request) {
    try {
        // Validate and get user from token
        const ownerId = await getDataFromToken(request);

        if (!ownerId) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        // Fetch all rate records
        const rates = await Rate.find();

        if (!rates) {
            return NextResponse.json({ error: "No rates found" }, { status: 404 });
        }

        return NextResponse.json({ data: rates }, { status: 200 });
    } catch (error) {
        console.error("Error fetching rates:", error.message);
        return NextResponse.json({ error: "Error fetching rates", details: error.message }, { status: 500 });
    }
}
