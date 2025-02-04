import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Orders from "@/models/OwnerOrders";
import Owner from "@/models/ownerModel";

// Ensure the database is connected
connect();

export async function GET(request) {
    try {
        // Extract Sangh ID from the token
        const SanghId = await getDataFromToken(request);
        if (!SanghId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        console.log("SanghId:", SanghId);

        // Set date range for today's orders
        const startDate = new Date();
        const endDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Start of the day
        endDate.setHours(23, 59, 59, 999); // End of the day

        // Find the owner associated with the Sangh ID
        const owner = await Owner.findOne({ sangh: SanghId });
        if (!owner) {
            console.error("Owner not found for Sangh:", SanghId);
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        console.log("Owner details - Sangh ID:", owner.sangh, "Owner ID:", owner._id);

        // Fetch Accepted Orders within the date range
        const AcceptedOrders = await Orders.find({
            createdBy: owner._id,
            status: ["Accepted", "Completed"],
        }).sort({ createdAt: 1 });

        console.log("AcceptedOrders:", AcceptedOrders);

        // Calculate the total accepted amount
        const totalAmount = AcceptedOrders.reduce((acc, order) => {
            return acc + order.rate;
        }, 0);
        console.log("Total Accepted amount:", totalAmount);

        // Return the fetched data and calculated total
        return NextResponse.json(
            { data: AcceptedOrders, totalAmount },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching AcceptedOrders:", error.message);
        return NextResponse.json(
            { error: "Error fetching AcceptedOrders", details: error.message },
            { status: 500 }
        );
    }
}
