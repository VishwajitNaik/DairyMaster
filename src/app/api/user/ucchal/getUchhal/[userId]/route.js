import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import BillKapat from "@/models/BillKapat";
import Ucchal from "@/models/ucchalModel"; // ✅ Import Ucchal model
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request, context) {
    try {
        // ✅ Get Owner ID from token
        const OwnerId = await getDataFromToken(request);
        const { userId } = context.params;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // ✅ Fetch user with populated Ucchal data
        const user = await User.findOne({ _id: userId, createdBy: OwnerId })
            .populate({
                path: "ucchal",
                model: Ucchal, // ✅ Specify model name explicitly
                options: { sort: { date: -1 } } // ✅ Sort directly in populate
            });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ✅ Calculate total from Ucchal records
        const total = user.ucchal.reduce((sum, record) => sum + (parseFloat(record.rakkam) || 0), 0);
        console.log("total", total);
        

        // ✅ Fetch BillKapat records with "उच्चल" orderData
        const billKapatRecords = await BillKapat.find({ 
            createdBy: user._id, 
            orderData: "उच्चल" 
        }).select('rate date').lean();

        // ✅ Calculate total from BillKapat records
        const totalBillKapat = billKapatRecords.reduce((sum, record) => sum + (parseFloat(record.rate) || 0), 0);

        // ✅ Calculate net payment
        const netPayment = total - totalBillKapat;


        // ✅ Attach netPayment to user object
        user.netPayment = netPayment;

        return NextResponse.json({
            data: user.ucchal,
            total,
            totalBillKapat,
            billKapatRecords,
            netPayment
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
