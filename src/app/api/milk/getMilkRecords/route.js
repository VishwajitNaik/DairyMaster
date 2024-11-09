// routes/api/milk/getMilkRecords.js

import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Milk from '@/models/milkModel';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const startDate = new Date(searchParams.get('startDate'));
  const endDate = new Date(searchParams.get('endDate'));

  // Set startDate to the beginning of the selected day
  startDate.setHours(0, 0, 0, 0);

  // Set endDate to the end of the selected day
  endDate.setHours(23, 59, 59, 999);

  try {
    // Optional: Try to get the user ID from the token if available
    const tokenUserId = getDataFromToken(request);

    let milkRecords;

    if (userId || tokenUserId) {
      // Fetch records for the specific user (either from query or token) within the date range
      milkRecords = await Milk.find({
        createdBy: userId || tokenUserId, // Use userId from query or token
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }).populate('createdBy', 'registerNo name');
    } else {
      // If no userId or tokenUserId, fetch all records within the date range
      console.log("No user specified; fetching all records.");
      milkRecords = await Milk.find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }).populate('createdBy', 'registerNo name');
    }

    return NextResponse.json({
      message: 'Milk records fetched successfully',
      data: milkRecords,
    });
  } catch (error) {
    console.error('Error fetching milk records:', error);
    return NextResponse.json({ error: 'Failed to fetch milk records' }, { status: 500 });
  }
}
