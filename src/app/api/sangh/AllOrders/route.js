import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Orders from '@/models/OwnerOrders'; // Order model
import Dairy from '@/models/ownerModel'; // Import your Dairy model

connect();

export async function GET() {
    try {
        // Fetch all orders and populate the dairyName from createdBy field
        const orders = await Orders.find().populate({
            path: 'createdBy', // Assuming createdBy is a reference to the Dairy model
            select: 'dairyName' // Only select the dairyName field
        });

        if (!orders || orders.length === 0) {
            return NextResponse.json({ message: "No orders found." }, { status: 404 });
        }

        // Map orders to include dairyName
        const ordersWithDairyName = orders.map(order => ({
            ...order._doc,
            dairyName: order.createdBy ? order.createdBy.dairyName : 'Unknown Dairy', // Get dairyName or set default
        }));

        return NextResponse.json({ data: ordersWithDairyName }, { status: 200 });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return NextResponse.json({ error: "Error fetching orders", details: error.message }, { status: 500 });
    }
}
