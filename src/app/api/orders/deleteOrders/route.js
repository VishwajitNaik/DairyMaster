import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Orders from '@/models/userOrders';
import Owner from '@/models/ownerModel';
import User from "@/models/userModel";

connect();

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Find and delete the order by ID
    const deletedOrder = await Orders.findByIdAndDelete(id);

    await Owner.updateMany(
      { userOrders: id },
      { $pull: { userOrders: id } }
    )

    await User.updateMany(
      { userOrders: id },
      { $pull: { userOrders: id } }
    )

    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Order deleted successfully' },
      { status: 200 }
    );


  } catch (error) {
    console.log("Failed to delete order:", error.message);
    return NextResponse.json(
      { success: false, message: 'Failed to delete order' },
      { status: 500 }
    );
    
  }
}
