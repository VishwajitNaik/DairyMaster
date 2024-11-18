import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import BillStorage from "@/models/BillStorage";

connect();

export async function GET(request) {
    try {
        // Get user data from token (authentication)
        const ownerId = await getDataFromToken(request);
        
        if (!ownerId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        // Get the startDate and endDate from query parameters
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Create a filter object for MongoDB
        const filter = { createdBy: ownerId };

        if (startDate && endDate) {
            filter.startDate = { $gte: new Date(startDate) };
            filter.endDate = { $lte: new Date(endDate) };
        }

        // Find all bills created by the owner with optional date filter
        const bills = await BillStorage.find(filter);

        return NextResponse.json({ data: bills }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
