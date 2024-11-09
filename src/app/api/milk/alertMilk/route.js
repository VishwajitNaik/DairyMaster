import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/MilkModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// This should be a named export
export async function POST(req) {
  await connect();

  try {
    const { registerNo, session, date } = await req.json();

    // Find the milk record for the given registerNo, session, and date
    const existingRecord = await Milk.findOne({ registerNo, session, date });

    if (existingRecord) {
      return NextResponse.json({ message: 'Milk record already exists', record: existingRecord });
    }

    return NextResponse.json({ message: 'No milk record found' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check milk record', details: error.message }, { status: 500 });
  }
}
