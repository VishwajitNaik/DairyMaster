import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Advance from '@/models/advanceModel'; 
import { getDataFromToken } from '@/helpers/getDataFromToken';
import User from '@/models/userModel';

connect();

export async function POST(request) {
  try {
    const ownerId = await getDataFromToken(request);
    const reqBody = await request.json();

    const { registerNo, date, orderNo, username, milktype, rakkam } = reqBody;

    // ✅ Validate all required fields
    if (!registerNo || !date || !username || !milktype || !rakkam) {
      return NextResponse.json({ error: "All fields except orderNo are required" }, { status: 400 });
    }

    // ✅ Validate rakkam data type
    if (isNaN(rakkam)) {
      return NextResponse.json({ error: "Rakkam must be a valid number" }, { status: 400 });
    }

    // ✅ Convert rakkam to float
    const rakkamParsed = parseFloat(rakkam);

    // ✅ Fetch user
    const user = await User.findOne({ registerNo, createdBy: ownerId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Insert new advance using `insertOne()`
    const newAdvance = {
      date : new Date(date),
      orderNo,
      username,
      milktype,
      rakkam: rakkamParsed,
      createdBy: user._id,
    };

    const result = await Advance.collection.insertOne(newAdvance);

    // ✅ Update user's advance list
    await User.updateOne({ _id: user._id }, { $push: { userAdvance: result.insertedId } });

    return NextResponse.json({
      message: "Advance record added successfully",
      data: { ...newAdvance, _id: result.insertedId },
    });

  } catch (error) {
    console.error("Error adding Advance record:", error.message);
    return NextResponse.json({ error: "Failed to add Advance record", details: error.message }, { status: 500 });
  }
}
