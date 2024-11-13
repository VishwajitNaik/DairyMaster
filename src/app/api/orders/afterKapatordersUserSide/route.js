import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Order from '@/models/userOrders'; // Ensure this path is correct

connect();

export async function GET(request, {params}) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const startDate = new Date(searchParams.get('startDate'));
  const endDate = new Date(searchParams.get('endDate'));

  // Set endDate to the end of the selected day
  endDate.setHours(23, 59, 59, 999);

  try {
    const OrderRecord = await Order.find({
      createdBy: userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate('createdBy', 'registerNo name'); // Ensure this matches the field in the Order schema


    return NextResponse.json({
      message: "orders records fetched successfully",
      data: OrderRecord,
    });
  } catch (error) {
    console.error("Error fetching Orders records:", error);
    return NextResponse.json({ error: "Failed to fetch milk records" }, { status: 500 });
  }
}
