import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/MilkModel";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const { searchParams } = new URL(request.url);
        
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (!startDate || !endDate) {
            return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 });
        }

        const owner = await Owner.findById(ownerId).populate({
            path: "userMilk",
            match: {
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                }
            },
            options: { sort: { registerNo: 1 } }
        });

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        const milkRecords = owner.userMilk;

        // Calculate totals and averages
        const totalLiters = milkRecords.reduce((sum, record) => sum + (record.liter || 0), 0);
        const totalRakkam = milkRecords.reduce((sum, record) => sum + (record.rakkam || 0), 0);
        const avgFat = milkRecords.length ? (milkRecords.reduce((sum, record) => sum + (record.fat || 0), 0) / milkRecords.length).toFixed(2) : 0;
        const avgSNF = milkRecords.length ? (milkRecords.reduce((sum, record) => sum + (record.snf || 0), 0) / milkRecords.length).toFixed(2) : 0;
        const avgRate = milkRecords.length ? (milkRecords.reduce((sum, record) => sum + (record.dar || 0), 0) / milkRecords.length).toFixed(2) : 0;

        return NextResponse.json({
            message: "Milk records fetched successfully",
            data: milkRecords,
            totals: {
                totalLiters: totalLiters.toFixed(2),
                avgFat: avgFat,
                avgSNF: avgSNF,
                avgRate: avgRate,
                totalRakkam: totalRakkam.toFixed(2)
            }
        });

    } catch (error) {
        console.error("Error fetching milk records:", error);
        return NextResponse.json({ error: "Failed to fetch milk records" }, { status: 500 });
    }
}
