import Order from "@/models/userOrders";
import Advance from "@/models/advanceModel";
import BillKapat from "@/models/BillKapat";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request, { params }) {
    try {
        const ownerId = await getDataFromToken(request);
        const { registerNo } = params;
        const { startDate, endDate } = await request.json();

        if (!registerNo) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await User.findOne({ _id: registerNo, createdBy: ownerId });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userOrders = await Order.find({
            createdBy: user._id,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        });

        const totalRakkam = userOrders.reduce((total, order) => total + (parseFloat(order.rakkam) || 0), 0);

        const billKapatRecords = await BillKapat.find({
            createdBy: user._id,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });

        const totalBillKapat = billKapatRecords.reduce((total, record) => total + (parseFloat(record.rate) || 0), 0);

        const advanceCuts = await Advance.find({
            createdBy: user._id,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        });

        const totalAdvance = advanceCuts.reduce((total, record) => total + (parseFloat(record.rakkam) || 0), 0);

        // Calculate net payment
        const netPayment = Math.floor(totalRakkam - totalBillKapat);

        return NextResponse.json({
            userOrders,
            advanceCuts,
            billKapatRecords,
            totalRakkam,
            totalAdvance,
            totalBillKapat,
            netPayment,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
