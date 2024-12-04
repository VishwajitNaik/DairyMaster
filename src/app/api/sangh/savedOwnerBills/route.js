import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import BillStorage from "@/models/SanghBillStorage";

connect();

export async function GET(request) {
    try {
        const sanghId = await getDataFromToken(request);
        console.log("Authenticated Sangh Id:", sanghId);

        if (!sanghId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const filter = { sanghId: sanghId };
        console.log("Filter:", filter);

        // Only apply the date range filter if both startDate and endDate are provided
        if (startDate && endDate) {
            filter['dateRange.startDate'] = { $gte: new Date(startDate) };
            filter['dateRange.endDate'] = { $lte: new Date(endDate) };
        }

        const bills = await BillStorage.find(filter);
        console.log("Bills:", bills);
        

        return NextResponse.json({ data: bills }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
