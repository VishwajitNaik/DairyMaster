import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Orders from '@/models/OwnerOrders';
import Owner from "@/models/ownerModel";
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function POST(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const reqBody = await request.json();

        const { orderType, quantity, rate } = reqBody;

        if (!orderType || !quantity || !rate) {
            console.error("Missing required fields:");
            return NextResponse.json({ error: "All fields except orderNo are required" }, { status: 400 });
        }

        const owner = await Owner.findById(ownerId);
        
        if (!owner) {
            console.error("User not found:", { ownerId });
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const newOrder = new Orders({
            orderType,
            quantity,
            rate,
            createdBy: ownerId,
        });

        const savedOrder = await newOrder.save();

        // Check if 'Order' array exists, and initialize if not
        if (!Array.isArray(owner.Order)) {
            owner.Order = []; // Initialize the Order array if it's not defined
        }

        // Add the new order to the owner's order list
        owner.Order.push(savedOrder._id);
        await owner.save();

        return NextResponse.json({
            message: "Order created successfully.",
            data: savedOrder,
        });

    } catch (error) {
        console.error("Error storing order information:", error.message);
        return NextResponse.json({ error: "Error storing order information", details: error.message }, { status: 500 });
    }
}
