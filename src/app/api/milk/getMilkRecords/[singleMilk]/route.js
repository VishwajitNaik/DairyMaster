// routes/api/milk/getMilkRecords.js

import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Milk from '@/models/milkModel';

connect();

export async function GET(request, {params}) {
  const { searchParams } = new URL(request.url);
  const startDate = new Date(searchParams.get('startDate'));
  const endDate = new Date(searchParams.get('endDate'));

  // Set endDate to the end of the selected day
  endDate.setHours(23, 59, 59, 999);

  try {
    const milkRecords = await Milk.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('createdBy', 'registerNo name');

    console.log(milkRecords);

    return NextResponse.json({
      message: "Milk records fetched successfully",
      data: milkRecords,
    });
  } catch (error) {
    console.error("Error fetching milk records:", error);
    return NextResponse.json({ error: "Failed to fetch milk records" }, { status: 500 });
  }
}
