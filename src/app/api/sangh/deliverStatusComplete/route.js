import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Orders from '@/models/OwnerOrders';

connect();

export async function PATCH(request) {
    try {
        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        const updatedOrder = await Orders.findByIdAndUpdate(
            orderId,
            { status: "Completed" },  // Update the status to "Completed"
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Order completed successfully", data: updatedOrder }, { status: 200 });
    } catch (error) {
        console.error("Error completing order:", error.message);
        return NextResponse.json({ error: "Error completing order", details: error.message }, { status: 500 });
    }
}
