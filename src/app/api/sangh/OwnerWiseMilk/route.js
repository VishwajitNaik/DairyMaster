import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig"; 
import MakeMilk from "@/models/MakeMilk";

connect();

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const startDate = new Date(searchParams.get('startDate')); // Convert to Date
    const endDate = new Date(searchParams.get('endDate'));     // Convert to Date

    // Set start and end date for the query
    startDate.setHours(0, 0, 0, 0);     // Start of the day
    endDate.setHours(23, 59, 59, 999);  // End of the day

    try {
        const tokenOwnerId = getDataFromToken(request); // Get owner ID from token
        let milkRecords;

        if (ownerId || tokenOwnerId) {
            // Fetch records for the specific user (either from query or token) within the date range
            milkRecords = await MakeMilk.find({
                createdBy: ownerId || tokenOwnerId, // Use ownerId from query or token
                date: {
                    $gte: startDate,
                    $lte: endDate,
                },
            }).populate('createdBy', 'registerNo ownerName');
        } else {
            // If no ownerId or tokenOwnerId, fetch all records within the date range
            console.log('No owner specified; fetching all records.');
            milkRecords = await MakeMilk.find({
                date: {
                    $gte: startDate,
                    $lte: endDate,
                },
            }).populate('createdBy', 'registerNo ownerName');
        }

        // get the total amount of all the milk records for perticular owner in the given date range
        const totalAmount = milkRecords.reduce((acc, record) => acc + record.amount, 0);
        console.log('Total amount', totalAmount);

        return NextResponse.json({ 
            message: 'Milk records fetched successfully',
            data: milkRecords,
            totalAmount,
        });
       
    } catch (error) {
        console.error('Error fetching milk records:', error);
        return NextResponse.json({ error: 'Failed to fetch milk records' }, { status: 500 });       
    }
}
