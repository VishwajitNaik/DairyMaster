import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import Order from "@/models/OwnerOrders.js"; // Import the Order model (adjust the path as necessary)

// Connect to the database
connect();

export async function POST(request) {
    try {
        // Extract the data from the request body
        const { orderId, truckNo, driverMobNo } = await request.json();
        
        // Get the user from the token (if necessary)
        const user = await getDataFromToken(request);
        
        // Find the order in the database by its ID and update it
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { 
                status: "Accepted", 
                truckNo: truckNo,
                driverMobNo: driverMobNo 
            },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return NextResponse.json({ message: "Order not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Order accepted successfully.", data: updatedOrder }, { status: 200 });
    } catch (error) {
        console.error("Error in order acceptance:", error.message);
        return NextResponse.json({ message: "Failed to accept order.", error: error.message }, { status: 500 });
    }
}
