import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import MakeMilk from "@/models/MakeMilk";

connect();

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url);
    const startDate = new Date(searchParams.get('startDate'));
    const endDate = new Date(searchParams.get('endDate'));

    // Set end date to the end of the day (23:59:59.999)
    endDate.setHours(23, 59, 59, 999);

    try {
        const makeMilkRecords = await MakeMilk.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('createdBy', 'registerNo ownerName');

        return NextResponse.json({
            message: "Milk records fetched successfully",
            data: makeMilkRecords
        });
    } catch (error) {
        console.error("Error fetching milk records:", error);
        return NextResponse.json({ error: "Failed to fetch milk records" }, { status: 500 });
    }
}
