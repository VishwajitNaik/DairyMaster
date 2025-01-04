import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import BillKapat from "@/models/BillKapat";
import mongoose from "mongoose";

connect();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");

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

  try {
    // Fetch all BillKapat records within the date range
    const billKapatRecords = await BillKapat.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("createdBy", "registerNo name");

    // Group records by user
    const groupedData = billKapatRecords.reduce((acc, record) => {
      const userId = record.createdBy._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          registerNo: record.createdBy.registerNo,
          name: record.createdBy.name,
          records: [],
        };
      }
      acc[userId].records.push(record);
      return acc;
    }, {});

    return NextResponse.json({
      message: "Bill Kapat data fetched successfully",
      data: Object.values(groupedData), // Convert object to array for easier handling
    });
  } catch (error) {
    console.error("Error fetching Bill Kapat data:", error);
    return NextResponse.json({ error: "Failed to fetch Bill Kapat data" }, { status: 500 });
  }
}
