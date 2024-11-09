import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/milkModel";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const owner = await Owner.findById(ownerId).populate('userMilk'); // Populating the userMilk field

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Determine today's date
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Determine the current session based on the time of day
        const currentHour = new Date().getHours();
        const currentSession = currentHour < 12 ? "morning" : "evening";

        // Filter userMilk for today's records with the current session
        const todaySessionMilkRecords = owner.userMilk.filter(milk => {
            const milkDate = new Date(milk.date);
            return (
                milkDate >= startOfDay &&
                milkDate <= endOfDay &&
                milk.session === currentSession
            );
        });

        // Calculate totalLiter, average fat, and average snf
        const totalLiter = todaySessionMilkRecords.reduce((sum, record) => sum + record.liter, 0);
        const averageFat = todaySessionMilkRecords.reduce((sum, record) => sum + record.fat, 0) / todaySessionMilkRecords.length || 0;
        const averageSnf = todaySessionMilkRecords.reduce((sum, record) => sum + record.snf, 0) / todaySessionMilkRecords.length || 0;

        console.log("Today's Milk Records for Current Session:", todaySessionMilkRecords);
        console.log("Total Liter:", totalLiter, "Average Fat:", averageFat, "Average SNF:", averageSnf);

        return NextResponse.json({
            message: "Today's milk records for current session fetched successfully",
            milkRecords: todaySessionMilkRecords,
            totalLiter,
            averageFat,
            averageSnf
        });
    } catch (error) {
        console.log("Error fetching today's milk records:", error);
        return NextResponse.json({ error: "Failed to fetch today's milk records" }, { status: 500 });
    }
}
