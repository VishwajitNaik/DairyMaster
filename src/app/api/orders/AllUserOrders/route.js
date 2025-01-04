import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Order from "@/models/userOrders";
import BillKapat from "@/models/BillKapat";

connect();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");

  // Validate and parse dates
  let startDate, endDate;
  try {
    startDate = new Date(startDateStr);
    endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  try {
    // Fetch orders
    const orders = await Order.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate({
      path: "createdBy",
      select: "registerNo name"
    });

    // Fetch Bill Kapat data
    const billKapats = await BillKapat.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate({
      path: "createdBy",
      select: "registerNo name",
    });

    // Group orders and Bill Kapat data by user
    const groupedData = {};

    // Process orders
    orders.forEach((order) => {
      const user = order.createdBy;
      if (!user) return; // Skip if user is missing
      if (!groupedData[user._id]) {
        groupedData[user._id] = {
          registerNo: user.registerNo,
          username: user.name,
          totalOrders: 0,
          totalBillKapat: 0,
          remainingAmount: 0,
        };
      }
      groupedData[user._id].totalOrders += order.rakkam;
    });

    // Process Bill Kapat data
    billKapats.forEach((record) => {
      const user = record.createdBy;
      if (!user) return; // Skip if user is missing
      if (!groupedData[user._id]) {
        groupedData[user._id] = {
          registerNo: user.registerNo,
          username: user.username,
          totalOrders: 0,
          totalBillKapat: 0,
          remainingAmount: 0,
        };
      }
      groupedData[user._id].totalBillKapat += record.rate;
    });

    // Calculate remaining amount
    Object.keys(groupedData).forEach((userId) => {
      const userData = groupedData[userId];
      userData.remainingAmount = userData.totalOrders - userData.totalBillKapat;
    });

    return NextResponse.json({ data: Object.values(groupedData) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
