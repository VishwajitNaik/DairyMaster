// app/api/orders/[id]/route.js

import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Order from '@/models/userOrders'; // Ensure this path is correct

connect();

export async function GET(request, { params }) {
  const { id } = params; // User ID from URL

  try {
    const orders = await Order.find({ userId: id }).populate('createdBy', 'registerNo name'); // Adjust fields as needed

    if (!orders.length) {
      return NextResponse.json({ message: 'No orders found for this user' });
    }

    return NextResponse.json({
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
