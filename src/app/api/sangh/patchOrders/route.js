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
            { status: "Accepted" },  // Update the status to "Accepted"
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Order accepted successfully", data: updatedOrder }, { status: 200 });
    } catch (error) {
        console.error("Error accepting order:", error.message);
        return NextResponse.json({ error: "Error accepting order", details: error.message }, { status: 500 });
    }
}
