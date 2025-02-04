import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Order from '@/models/userOrders'; // Ensure this path is correct
import mongoose from 'mongoose';

connect();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  console.log("userId", userId);
  

  try {
    if (!userId) {
      return NextResponse.json({
        message: "userId parameter is required"
      }, { status: 400 });
    }

    // Fetching the orders for the user
    const orderData = await Order.find({ createdBy: userId }).populate('createdBy', 'registerNo name');

    // Calculating the total amount
    const totalAmount = await Order.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$rakkam' } } },
    ]);

    console.log("Total Amount", totalAmount);
    
    const total = totalAmount.length > 0 ? totalAmount[0].total : 0;
    console.log("Total Amount", total);

    return NextResponse.json({
      message: "Orders records fetched successfully",
      data: orderData,
      totalAmount: total,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({
      message: "An error occurred while fetching the orders.",
      error: error.message,
    }, { status: 500 });
  }
}
