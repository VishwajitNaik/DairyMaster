// // app/api/orders/[id]/route.js

// import { NextResponse } from 'next/server';
// import { connect } from '@/dbconfig/dbconfig';
// import Order from '@/models/userOrders'; // Ensure this path is correct

// connect();

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const userId = searchParams.get('userId');

// try {
//   const OrderData = await Order.find({ createdBy: userId }).populate('createdBy', 'registerNo name'); // Ensure this matches the field in the Order schema

//   const totalAmount = await Order.aggregate([
//     { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
//     { $group: { _id: null, total: { $sum: '$rakkam' } } },
//   ]);

//   return NextResponse.json({
//     message: "Orders records fetched successfully",
//     data: OrderData,
//     totalAmount: totalAmount
//   })
// } catch (error) {
  
// }
// }
