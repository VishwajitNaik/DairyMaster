import Order from "@/models/userOrders";
import Advance from "@/models/advanceModel";
import BillKapat from "@/models/BillKapat";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request, context) {
    try {
        const ownerId = await getDataFromToken(request);
        const { userId } = await context.params;
        console.log("ownerId", ownerId);
        

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await User.findOne({ _id: userId, createdBy: ownerId });


        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userOrders = await Order.find({ createdBy: user._id }).select("rakkam date").lean();
        console.log("userOrders", userOrders);
        

        const totalRakkam = userOrders.reduce((total, order) => total + (parseFloat(order.rakkam) || 0), 0);

        const billKapatRecords = await BillKapat.find({ createdBy: user._id, orderData: { $ne: "उच्चल" } }).select('rate date').lean();
        console.log("billKapatRecords", billKapatRecords);
        

        const totalBillKapat = billKapatRecords.reduce((total, record) => total + (parseFloat(record.rate) || 0), 0);

        const advanceCuts = await Advance.find({ createdBy: user._id });

        const totalAdvance = advanceCuts.reduce((total, record) => total + (parseFloat(record.rakkam) || 0), 0);

        // Calculate net payment
        const netPayment = Math.floor(totalRakkam - totalBillKapat - totalAdvance);
        console.log("net payment ", netPayment);
        


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
