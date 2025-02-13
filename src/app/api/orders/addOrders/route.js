import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Orders from '@/models/userOrders';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import User from '@/models/userModel';

connect();

export async function POST(request) {
  try {
    const ownerId = await getDataFromToken(request);
    const reqBody = await request.json();
    const { registerNo, date, username, milktype, kharediData, rakkam } = reqBody;

    // ✅ Validate all required fields
    if (!registerNo || !date || !username || !milktype || !kharediData || !rakkam) {
      console.error("Missing required fields:", { registerNo, date, username, milktype, kharediData, rakkam });
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
      console.error("User not found:", { registerNo, ownerId });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Insert new order using `insertOne()`
    const newOrder = {
      registerNo,
      date,
      username,
      milktype,
      kharediData,
      rakkam: rakkamParsed,
      createdBy: user._id,
    };

    const result = await Orders.collection.insertOne(newOrder);

    // ✅ Update user's order list
    await User.updateOne({ _id: user._id }, { $push: { userOrders: result.insertedId } });

    return NextResponse.json(
      { message: "Order stored successfully", data: { ...newOrder, _id: result.insertedId } },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error storing order information:", error.message);
    return NextResponse.json({ error: "Error storing order information", details: error.message }, { status: 500 });
  }
}
