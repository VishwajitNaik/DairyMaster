// app/api/milk/latest/route.js

import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Milk from '@/models/MilkModel';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId'); // Get userId from query parameters

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch the latest milk record for the given user ID
    const lastRecord = await Milk.findOne({ createdBy: userId })
      .sort({ date: -1 })
      .select('fat snf');

    // Check if record exists
    if (!lastRecord) {
      return NextResponse.json({ error: 'No previous session found for this user.' }, { status: 404 });
    }

    return NextResponse.json({ data: lastRecord });
  } catch (error) {
    console.error("Error fetching latest milk record:", error);
    return NextResponse.json({ error: "Failed to fetch latest milk record" }, { status: 500 });
  }
}
