import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Advance from '@/models/advanceModel';
import mongoose from 'mongoose';

connect();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    console.log("user name", userId);
    

    try {
        // Fetch all advance data for the user without date range filter
        const advanceData = await Advance.find({
            createdBy: userId,
        }).populate('createdBy', 'registerNo name');

        // Aggregate total advance payments for the user
        const totalAdvance = await Advance.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: '$rakkam' } } },
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
