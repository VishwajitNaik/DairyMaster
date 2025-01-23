import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Advance from '@/models/advanceModel';
import mongoose from 'mongoose';

connect();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = new Date(searchParams.get('startDate'));
    const endDate = new Date(searchParams.get('endDate'));

    // Set endDate to include the entire day
    endDate.setHours(23, 59, 59, 999);

    try {
        // Fetch advance data within the date range
        const advanceData = await Advance.find({
            createdBy: userId,
            date: { $gte: startDate, $lte: endDate },
        }).populate('createdBy', 'registerNo name');

        // Aggregate total advance payments
        const totalAdvance = await Advance.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(userId) } }, // Use 'new' keyword
            { $group: { _id: null, total: { $sum: '$rakkam' } } }, // Sum 'rakkam' field
        ]);

        // Extract total from the aggregation result
        const totalAmount = totalAdvance.length > 0 ? totalAdvance[0].total : 0;
        

        return NextResponse.json({
            message: "Advance records fetched successfully",
            data: advanceData,
            totalAdvance: totalAmount,
        });
    } catch (error) {
        console.error("Error fetching Advance records:", error);
        return NextResponse.json({ error: "Failed to fetch advance records" }, { status: 500 });
    }
}
