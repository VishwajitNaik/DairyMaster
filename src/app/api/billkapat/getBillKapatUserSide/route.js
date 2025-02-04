import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import BillKapat from "@/models/BillKapat";
import mongoose from 'mongoose';

connect();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  // Validate userId
  if (!userId) {
    return NextResponse.json({ error: "Missing userId query parameter" }, { status: 400 });
  }

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  try {
    // Fetch all BillKapat records for the given userId
    const billKapatRecords = await BillKapat.find({
      createdBy: userId,
    }).populate("createdBy", "registerNo name");

    return NextResponse.json({
      message: "Bill Kapat fetched successfully",
      data: billKapatRecords,
    });
  } catch (error) {
    console.error("Error fetching Bill Kapat records:", error);
    return NextResponse.json({ error: "Failed to fetch Bill Kapat records" }, { status: 500 });
  }
}