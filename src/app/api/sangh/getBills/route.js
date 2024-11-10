import User from "@/models/userModel";
import Milk from "@/models/MilkModel";
import BillKapat from "@/models/BillKapat";
import Sthirkapat from '@/models/sthirkapat';
import Owner from '@/models/ownerModel'; 
import { NextResponse } from "next/server";
import { getSanghDataFromToken } from "../../../../helpers/getSanghFormToken";
import Sangh from "@/models/SanghModel";

export async function POST(request) {
    try {
        const { email, startDate, endDate } = await request.json();

        // Find the owner by email
        const owner = await Owner.findById({id:_id});
        console.log("Owner", owner);
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Validate startDate and endDate
        if (!startDate || !endDate) {
            return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 });
        }

        // Fetch all users under the owner
        const users = await User.find({ createdBy: ownerId });

        // Fetch Sthirkapat records for the owner to calculate total kapat rate
        const sthirkapatRecords = await Sthirkapat.find({
            createdBy: ownerId,
            KapatType: "Sthir Kapat"
        });

        // Calculate total kapat rate
        const totalKapatRate = sthirkapatRecords.reduce((total, record) => total + (record.kapatRate || 0), 0);
        const formattedTotalKapatRate = totalKapatRate.toFixed(1);

        const results = [];

        for (const user of users) {
            // Fetch milk records within date range
            const milkRecords = await Milk.find({
                createdBy: user._id,
                date: { $gte: new Date(startDate), $lte: new Date(endDate) }
            });

            const totalLiters = Math.floor(milkRecords.reduce((total, record) => total + (record.liter || 0), 0));
            const totalRakkam = Math.floor(milkRecords.reduce((total, record) => total + (record.rakkam || 0), 0));

            const totalKapatRateMultiplybyTotalLiter = totalLiters * parseFloat(formattedTotalKapatRate);

            // Fetch BillKapat records within date range
            const billKapatRecords = await BillKapat.find({
                createdBy: user._id,
                date: { $gte: new Date(startDate), $lte: new Date(endDate) }
            });

            const totalBillKapat = billKapatRecords.reduce((total, record) => total + (record.rate || 0), 0);

            const netPayment = Math.floor(totalRakkam - totalKapatRateMultiplybyTotalLiter - totalBillKapat);

            results.push({
                user: user.name,
                totalLiters,
                totalRakkam,
                totalKapatRateMultiplybyTotalLiter,
                totalBillKapat,
                netPayment
            });
        }

        return NextResponse.json({ data: results });
    } catch (error) {
        console.error("Error generating bills:", error);
        return NextResponse.json({ error: "Failed to generate bills" }, { status: 500 });
    }
}
