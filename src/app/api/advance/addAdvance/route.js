// route file (e.g., /api/advance/addAdvance/route.js)
import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Advance from '@/models/advanceModel';  // Ensure this is the correct path
import { getDataFromToken } from '@/helpers/getDataFromToken';
import User from '@/models/userModel';

connect();

export async function POST(request) {
  try {
    const ownerId = await getDataFromToken(request);
    const reqBody = await request.json();

    const { registerNo, date, orderNo, username, milktype, rakkam } = reqBody;

    // Validate all required fields except orderNo
    if (!registerNo || !date || !username || !milktype || !rakkam) {
      return NextResponse.json({ error: "All fields except orderNo are required" }, { status: 400 });
    }

    // Validate rakkam data type
    if (isNaN(rakkam)) {
      return NextResponse.json({ error: "Rakkam must be a valid number" }, { status: 400 });
    }

    // Convert rakkam to float
    const rakkamParsed = parseFloat(rakkam);

    // Fetch user and save order
    const user = await User.findOne({ registerNo, createdBy: ownerId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newAdvance = new Advance({
      date,
      orderNo,
      username,
      milktype,
      rakkam: rakkamParsed,
      createdBy: user._id,
    });

    const savedAdvance = await newAdvance.save();

    user.userAdvance.push(savedAdvance._id);
    await user.save();

    return NextResponse.json({
      message: "Advance record added successfully",
      data: savedAdvance,
    });
  } catch (error) {
    console.error("Error adding Advance record:", error);
    return NextResponse.json({ error: "Failed to add Advance record" }, { status: 500 });
  }
}
