import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/MilkModel";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import moment from "moment-timezone"; // Add this library for reliable timezone handling

connect();

export async function GET(request) {
    try {
        // Get the owner ID from the token
        const ownerId = await getDataFromToken(request);
        const owner = await Owner.findById(ownerId).populate("userMilk"); // Populate userMilk field
        
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Get today's date in the specified timezone
        const today = moment.tz(new Date(), "Asia/Kolkata"); // Replace with your preferred timezone
        const startOfDay = today.clone().startOf("day").toDate();
        const endOfDay = today.clone().endOf("day").toDate();

        // Determine the current session (morning or evening)
        const currentHour = today.hour();
        const currentSession = currentHour < 12 ? "morning" : "evening";

        console.log("Start of Day:", startOfDay);
        console.log("End of Day:", endOfDay);
        console.log("Current Hour:", currentHour);
        console.log("Current Session:", currentSession);

        // Filter userMilk for today's records with the current session
        const todaySessionMilkRecords = owner.userMilk.filter(milk => {
            const milkDate = moment.tz(new Date(milk.date), "Asia/Kolkata").toDate(); // Adjust milk.date to match the same timezone
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

        return NextResponse.json({
            message: "Today's milk records for the current session fetched successfully",
            milkRecords: todaySessionMilkRecords,
            totalLiter,
            averageFat: averageFat.toFixed(2), // Limit to 2 decimal places for better readability
            averageSnf: averageSnf.toFixed(2) // Limit to 2 decimal places for better readability
        });
    } catch (error) {
        console.error("Error fetching today's milk records:", error);
        return NextResponse.json({ error: "Failed to fetch today's milk records" }, { status: 500 });
    }
}
