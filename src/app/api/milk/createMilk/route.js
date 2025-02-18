require("dotenv").config();
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/MilkModel";
import User from "@/models/userModel";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Redis from 'ioredis';  

const redis = new Redis();

connect();

export async function POST(request) {
  try {
    const ownerId = await getDataFromToken(request);
    const { registerNo, session, milk, liter, fat, snf, dar, rakkam, date } = await request.json();

    if (!registerNo || !session || !milk || !liter || !fat || !snf || !dar || !rakkam || !date) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ registerNo, createdBy: ownerId });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const owner = await Owner.findById(ownerId);
    if (!owner) return NextResponse.json({ error: "Owner not found" }, { status: 404 });

    const currentDate = new Date(date);
    let milkRecord = await Milk.findOne({ createdBy: user._id, session, milk, date: currentDate });

    if (milkRecord) {
      return NextResponse.json({
        alert: `दूध डाटा इस सेशन और दिन में पहले से ही उपलब्ध है. लिटर ${milkRecord.liter} \n फॅट ${milkRecord.fat} \n  SNF ${milkRecord.snf} \n दर ${milkRecord.dar} \n रक्कम ${milkRecord.rakkam}`,
        data: milkRecord,
      });
    } else {
      const newMilkRecord = {
        registerNo, session, milk, liter, fat, snf, dar, rakkam, createdBy: user._id, date: currentDate
      };

      const milkRecordKey = `milkRecord:${newMilkRecord.registerNo}:${newMilkRecord.session}:${newMilkRecord.date}`;

      // Store the record in Redis with a 3-hour expiration
      await redis.setex(milkRecordKey, 3 * 3600, JSON.stringify(newMilkRecord));
    

      await redis.lpush('milkQueue', JSON.stringify(newMilkRecord));
      return NextResponse.json({ message: "दूध डाटा सेव झाला..", data: newMilkRecord });
    }
  } catch (error) {
    console.error("Error storing milk information:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function bulkInsertFromRedis() {
  const data = [];
  let item;
  while ((item = await redis.rpop('milkQueue'))) {
    try {
      const parsedItem = JSON.parse(item);
      if (parsedItem.registerNo && parsedItem.createdBy) {
        data.push(parsedItem);
      }
    } catch (e) {
      console.error("Error parsing item from Redis queue:", e);
    }
  }
  if (data.length > 0) {
    const insertedRecords = await Milk.insertMany(data);
    for (const record of insertedRecords) {
      await User.updateOne({ _id: record.createdBy }, { $push: { milkRecords: record._id } });
    }
    console.log('Bulk insert completed with userMilk and milkRecords populated');
  }
}

setInterval(bulkInsertFromRedis, 60000);
