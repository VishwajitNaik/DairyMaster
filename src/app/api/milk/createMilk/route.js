import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/MilkModel";
import User from "@/models/userModel";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request) {
  try {
    const ownerId = await getDataFromToken(request);
    console.log("OnwerId: ",ownerId);
    const { registerNo, session, milk, liter, fat, snf, dar, rakkam, date } = await request.json();

    if (!registerNo || !session || !milk || !liter || !fat || !snf || !dar || !rakkam || !date) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ registerNo, createdBy: ownerId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const owner = await Owner.findById(ownerId);

    if (!owner) { 
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    // Use the original date without resetting the time
    const currentDate = new Date(date);

    // Check if a record already exists for the given session and date
    let milkRecord = await Milk.findOne({
      createdBy: user._id,
      session,
      milk,
      date: currentDate
    });

    console.log(milkRecord);
    if (milkRecord) {
      // If a record already exists, return the message and the existing milk data
      return NextResponse.json({
        message: "Milk record for this session and date is already available.",
        alert: "Milk record for this session and date is already available.",
        data: milkRecord,
      });
    } else {
      // Create a new record if none exists
      milkRecord = new Milk({
        session,
        milk,
        liter,
        fat,
        snf,
        dar,
        rakkam,
        createdBy: user._id,
        date: currentDate,
      });

      await milkRecord.save();

      user.milkRecords.push(milkRecord._id);
      await user.save();

      owner.userMilk.push(milkRecord._id);
      await owner.save();


      return NextResponse.json({
        message: "Milk information stored successfully",
        data: milkRecord,
      });
    }

  } catch (error) {
    console.error("Error storing milk information:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
