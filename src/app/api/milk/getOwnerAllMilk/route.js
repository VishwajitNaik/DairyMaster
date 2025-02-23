import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/MilkModel";
import User from "@/models/userModel";
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

        const users = await User.find({ createdBy: ownerId }).populate({
            path: "milkRecords",
            match: {
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                }
            }
        });

        const milkRecords = users.flatMap(user => user.milkRecords).sort((a, b) => a.registerNo - b.registerNo);

        const totalLiters = milkRecords.reduce((sum, record) => sum + (record.liter || 0), 0);
        const totalbuffLiter = milkRecords.filter(record => record.milk === "म्हैस ").reduce((sum, record) => sum + (record.liter || 0), 0);
        const totalcowLiter = milkRecords.filter(record => record.milk === "गाय ").reduce((sum, record) => sum + (record.liter || 0), 0);
        const totalRakkam = milkRecords.reduce((sum, record) => sum + (record.rakkam || 0), 0);
        const avgBuffFat = milkRecords.length ? (milkRecords.filter(record => record.milk === "म्हैस ").reduce((sum, record) => sum + (record.fat || 0), 0) / milkRecords.length).toFixed(2) : 0;
        const avgCowFat = milkRecords.length ? (milkRecords.filter(record => record.milk === "गाय ").reduce((sum, record) => sum + (record.fat || 0), 0) / milkRecords.length).toFixed(2) : 0;
        const avgBuffSNF = milkRecords.length ? (milkRecords.filter(record => record.milk === "म्हैस ").reduce((sum, record) => sum + (record.snf || 0), 0) / milkRecords.length).toFixed(2) : 0;
        const avgCowSNF = milkRecords.length ? (milkRecords.filter(record => record.milk === "गाय ").reduce((sum, record) => sum + (record.snf || 0), 0) / milkRecords.length).toFixed(2) : 0;
        const avgRate = milkRecords.length ? (milkRecords.reduce((sum, record) => sum + (record.dar || 0), 0) / milkRecords.length).toFixed(2) : 0;

        return NextResponse.json({
            message: "Milk records fetched successfully",
            data: milkRecords,
            totals: {
                totalLiters: totalLiters.toFixed(2),
                avgBuffFat: avgBuffFat,
                avgCowFat: avgCowFat,
                avgBuffSNF: avgBuffSNF,
                avgCowSNF: avgCowSNF,
                avgRate: avgRate,
                totalRakkam: totalRakkam.toFixed(2),
                totalbuffLiter: totalbuffLiter.toFixed(2),
                totalcowLiter: totalcowLiter.toFixed(2),
            }
        });

    } catch (error) {
        console.error("Error fetching milk records:", error);
        return NextResponse.json({ error: "Failed to fetch milk records" }, { status: 500 });
    }
}
