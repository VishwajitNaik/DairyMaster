import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Order from "@/models/userOrders";
import Advance from "@/models/advanceModel";
import BillKapat from "@/models/BillKapat";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
  const ownerId = await getDataFromToken(request);

  try {
    const users = await User.find({ createdBy: ownerId }).sort({ registerNo: 1 });

    // Fetch all orders for the users
    const orders = await Order.find({
      createdBy: { $in: users.map(user => user._id) },

    }).populate({
      path: "createdBy",
      select: "registerNo name",
    });

    // Fetch all advances for the users
    const advances = await Advance.find({
      createdBy: { $in: users.map(user => user._id) },
    }).populate({
      path: "createdBy",
      select: "registerNo name",
    });

    // Fetch all Bill Kapat data for the users
    const billKapats = await BillKapat.find({
      createdBy: { $in: users.map(user => user._id) },
    }).populate({
      path: "createdBy",
      select: "registerNo name",
    });

    // Group orders, advances, and Bill Kapat data by user
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
          totalAdvances: 0,
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
          username: user.name,
          totalOrders: 0,
          totalBillKapat: 0,
          totalAdvances: 0,
          remainingAmount: 0,
        };
      }
      groupedData[user._id].totalBillKapat += record.rate;
    });

    // Process advances
    advances.forEach((record) => {
      const user = record.createdBy;
      if (!user) return; // Skip if user is missing
      if (!groupedData[user._id]) {
        groupedData[user._id] = {
          registerNo: user.registerNo,
          username: user.name,
          totalOrders: 0,
          totalBillKapat: 0,
          totalAdvances: 0,
          remainingAmount: 0,
        };
      }
      groupedData[user._id].totalAdvances += record.rakkam;
    });

    // Calculate remaining amount
    Object.keys(groupedData).forEach((userId) => {
      const userData = groupedData[userId];
      userData.remainingAmount = userData.totalOrders - userData.totalBillKapat - userData.totalAdvances;
    });

    const sortedData = Object.values(groupedData).sort((a, b) => a.registerNo - b.registerNo);

    return NextResponse.json({ data: Object.values(sortedData) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
