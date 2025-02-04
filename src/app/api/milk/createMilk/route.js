require("dotenv").config();
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/MilkModel";
import User from "@/models/userModel";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";


connect();


// ✅ Milk Entry API
export async function POST(request) {
  try {
    const ownerId = await getDataFromToken(request);
    console.log("OwnerId: ", ownerId);

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

    // ✅ Check if a milk entry already exists
    const currentDate = new Date(date);
    let milkRecord = await Milk.findOne({
      createdBy: user._id || registerNo,
      session,
      milk,
      date: currentDate,
    });

    if (milkRecord) {
      return NextResponse.json({
        message: "Milk record for this session and date is already available.",
        alert: "Milk record for this session and date is already available.",
        data: milkRecord,
      });
    } else {
      // ✅ Create a new milk entry
      milkRecord = new Milk({
        registerNo,
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
        message: "Milk information stored successfully & SMS sent",
        data: milkRecord,
      });
    }

  } catch (error) {
    console.error("Error storing milk information:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
