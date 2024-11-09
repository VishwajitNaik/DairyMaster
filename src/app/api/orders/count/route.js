// app/api/orders/getHighestOrderNo/route.js

import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Orders from '@/models/userOrders';

connect();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const registerNo = searchParams.get('registerNo');

    if (!registerNo) {
      return NextResponse.json({ error: 'Register number is required' }, { status: 400 });
    }

    console.log('Searching for registerNo:', registerNo);

    const highestOrder = await Orders.find({ registerNo })
      .sort({ orderNo: -1 })
      .limit(1)
      .select('orderNo');

    console.log("Order No:", highestOrder);

    if (!highestOrder.length) {
      return NextResponse.json({ orderNo: 0 });
    }

    return NextResponse.json({ orderNo: highestOrder[0].orderNo });
  } catch (error) {
    console.error('Error fetching highest orderNo:', error);
    return NextResponse.json({ error: 'Failed to fetch highest orderNo' }, { status: 500 });
  }
}
