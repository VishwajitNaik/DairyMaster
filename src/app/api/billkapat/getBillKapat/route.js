import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import BillKapat from "@/models/BillKapat";
import mongoose from 'mongoose';

connect();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");

  // Validate parameters
  if (!userId || !startDateStr || !endDateStr) {
    return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  }

  // Validate and parse dates
  let startDate, endDate;
  try {
    startDate = new Date(startDateStr);
    endDate = new Date(endDateStr);
    
    // Ensure dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  try {
    const billKapatRecords = await BillKapat.find({
      createdBy: userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("createdBy", "registerNo name");

    console.log("Fetched Bill Kapat Records:", billKapatRecords);

    return NextResponse.json({
      message: "Bill Kapat fetched successfully",
      data: billKapatRecords,
    });
  } catch (error) {
    console.error("Error fetching Bill Kapat records:", error);
    return NextResponse.json({ error: "Failed to fetch Bill Kapat records" }, { status: 500 });
  }
}
