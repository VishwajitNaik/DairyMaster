import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Orders from "@/models/OwnerOrders";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getSanghFormToken";

connect();

export async function GET(request) {
    try {
        // Get owner ID from token
        const sanghId = await getDataFromToken(request);

        // Find the owner using the `sangh` ID
        const owner = await Owner.findOne({ sangh: sanghId });
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Fetch orders and populate `createdBy` to get `dairyName`
        const orders = await Orders.find({ createdBy: owner._id })
            .populate({ path: "createdBy", select: "dairyName" });

        if (!orders || orders.length === 0) {
            return NextResponse.json({ message: "No orders found." }, { status: 404 });
        }

        // Map orders to ensure `dairyName` is included
        const ordersWithDairyName = orders.map(order => ({
            ...order._doc,
            dairyName: order.createdBy ? order.createdBy.dairyName : "Unknown Dairy",
        }));


        return NextResponse.json({ data: ordersWithDairyName }, { status: 200 });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return NextResponse.json({ error: "Error fetching orders", details: error.message }, { status: 500 });
    }
}
