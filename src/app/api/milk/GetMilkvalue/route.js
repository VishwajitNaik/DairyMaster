import { NextResponse } from "next/server";
import Milk from "@/models/MilkModel";
import User from "@/models/userModel";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { getValue } from "@/dbconfig/redis";

export async function GET(request) {
  try {
    const ownerId = await getDataFromToken(request);
    const { searchParams } = new URL(request.url);
    const registerNo = searchParams.get("registerNo");
    const session = searchParams.get("session");
    const milk = searchParams.get("milk");
    const date = searchParams.get("date");

    if (!registerNo || !session || !milk || !date) {
      return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `milk:${registerNo}:${session}:${milk}:${date}`;
    const cachedData = await getValue(cacheKey);
    

    if (cachedData) {
      const milkRecord = JSON.parse(cachedData);
      return NextResponse.json({
        message: "Milk data retrieved from cache",
        data: milkRecord,
      });
    }

    // Fetch user and milk record from DB if not in cache
    const user = await User.findOne({ registerNo, createdBy: ownerId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const milkRecord = await Milk.findOne({ createdBy: user._id, session, milk, date: new Date(date) });
    if (!milkRecord) {
      return NextResponse.json({ error: "Milk data not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Milk data retrieved successfully",
      data: milkRecord,
    });
  } catch (error) {
    console.error("Error fetching milk information:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
