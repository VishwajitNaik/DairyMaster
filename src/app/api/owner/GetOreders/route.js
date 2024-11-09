import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import Owner from '@/models/ownerModel';
import Orders from '@/models/OwnerOrders';

connect();

export async function GET(request) {
    try {
        // Get the owner ID from the token
        const ownerId = await getDataFromToken(request);

        // Find the owner by ID
        const owner = await Owner.findById(ownerId);
        
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Fetch all orders created by the owner
        const orders = await Orders.find({ createdBy: ownerId });

        // Optionally, you can calculate total quantities or rates if needed
        const totalQuantity = orders.reduce((total, order) => total + (order.quantity || 0), 0);
        const totalRate = orders.reduce((total, order) => total + (order.rate || 0), 0);

        return NextResponse.json({
            message: "Orders fetched successfully.",
            totalQuantity,
            totalRate,
            data: orders,
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
