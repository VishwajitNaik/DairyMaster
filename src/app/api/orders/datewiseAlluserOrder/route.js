import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Order from "@/models/userOrders";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
    const OwnerId = await getDataFromToken(request);
    const startDate = request.nextUrl.searchParams.get("startDate");
    const endDate = request.nextUrl.searchParams.get("endDate");
    try {
        const users = await User.find({ createdBy: OwnerId }).sort({ registerNo: 1 });

        // Fetch all orders for the users
        const orders = await Order.find({
            createdBy: { $in: users.map(user => user._id) },
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        }).populate({
            path: "createdBy",
            select: "registerNo name",
        });

        const totalOrders = await Order.aggregate([
            {
                $match: {
                    createdBy: { $in: users.map(user => user._id) },
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                },
            },
        ]);

        return NextResponse.json({ data: orders, totalOrders: totalOrders[0]?.totalOrders || 0 });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}