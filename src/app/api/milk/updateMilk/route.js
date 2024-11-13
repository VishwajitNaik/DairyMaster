import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/MilkModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(req) {
  await connect();

  try {
    const ownerId = await getDataFromToken(req); // Use 'req' instead of 'request'
    const { registerNo, session, date, liter, fat, snf, dar, rakkam } = await req.json();

    if (!registerNo || !session || !date || !liter || !fat || !snf || !dar || !rakkam) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await User.findOne({ registerNo, createdBy: ownerId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use the original date without resetting the time
    const currentDate = new Date(date);
    currentDate.setUTCHours(0, 0, 0, 0); // Reset time to match only date part

    // Check if a record already exists for the given session and date
    let milkRecord = await Milk.findOne({
      createdBy: user._id,
      session,
      date: currentDate
    });


    // Declare updatedRecord outside the if-else block
    let updatedRecord;

    if (!milkRecord) {
      return NextResponse.json({
        message: "Milk record for this session and date is not available.",
        alert: "Milk record for this session and date is not available.",
        data: milkRecord,
      });
    } else {
      updatedRecord = await Milk.findOneAndUpdate(
        { createdBy: user._id, session, date: currentDate }, // Ensure date is handled correctly
        { liter, fat, snf, dar, rakkam },
        { new: true } // Return the updated record
      );
    }

    if (!updatedRecord) {
      return NextResponse.json({ message: 'Milk record not found' });
    }

    return NextResponse.json({ message: 'Milk record updated', record: updatedRecord });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update milk record', details: error.message }, { status: 500 });
  }
}
