import Order from "@/models/userOrders";
import Advance from "@/models/advanceModel";
import BillKapat from "@/models/BillKapat";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const { startDate, endDate } = await request.json();

        // Fetch all users created by the owner
        const users = await User.find({ createdBy: ownerId });

        if (!users || users.length === 0) {
            return NextResponse.json({ error: "No users found" }, { status: 404 });
        }

        // Initialize an array to hold totals for each user
        const userTotals = await Promise.all(
            users.map(async (user) => {
                const userOrders = await Order.find({
                    createdBy: user._id,
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                });

                const totalRakkam = userOrders.reduce(
                    (total, order) => total + (parseFloat(order.rakkam) || 0),
                    0
                );

                const billKapatRecords = await BillKapat.find({
                    createdBy: user._id,
                    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
                });

                const totalBillKapat = billKapatRecords.reduce(
                    (total, record) => total + (parseFloat(record.rate) || 0),
                    0
                );

                const advanceCuts = await Advance.find({
                    createdBy: user._id,
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                });

                const totalAdvance = advanceCuts.reduce(
                    (total, record) => total + (parseFloat(record.rakkam) || 0),
                    0
                );

                // Calculate net payment for the user
                const netPayment = Math.floor(totalRakkam - totalBillKapat - totalAdvance);

                return {
                    userId: user._id,
                    username: user.username,
                    totalRakkam,
                    totalBillKapat,
                    totalAdvance,
                    netPayment,
                };
            })
        );

        return NextResponse.json(userTotals);
    } catch (error) {
        console.error("Error fetching aggregate user totals:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
