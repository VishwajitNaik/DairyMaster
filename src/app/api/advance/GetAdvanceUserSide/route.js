import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Advance from '@/models/advanceModel';

connect();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = new Date(searchParams.get('startDate'));
    const endDate = new Date(searchParams.get('endDate'));
  
    // Set endDate to the end of the selected day
    endDate.setHours(23, 59, 59, 999);

    try {
        const advanceData = await Advance.find({
            createdBy: userId,
            date: {
              $gte: startDate,
              $lte: endDate,
            },
        }).populate('createdBy', 'registerNo name');

        console.log(advanceData);

        return NextResponse.json({
            message: "Advance records fetched successfully",
            data: advanceData,
        });

    } catch (error) {
        console.error("Error fetching Advance records:", error);
        return NextResponse.json({ error: "Failed to fetch advance records" }, { status: 500 });
    }
}
