import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/Milk";
import * as d3 from "d3";

connect();

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const filter = searchParams.get("filter") || "daily"; // Default is daily

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Fetch only the logged-in user's milk data
        const milkData = await Milk.find({ createdBy: userId }).sort({ date: 1 });

        let groupFunction;
        if (filter === "daily") {
            groupFunction = (d) => d3.timeFormat("%Y-%m-%d")(new Date(d.date));
        } else if (filter === "weekly") {
            groupFunction = (d) => d3.timeFormat("%Y-%W")(new Date(d.date)); // Week of the year
        } else if (filter === "monthly") {
            groupFunction = (d) => d3.timeFormat("%Y-%m")(new Date(d.date));
        } else if (filter === "yearly") {
            groupFunction = (d) => d3.timeFormat("%Y")(new Date(d.date));
        }

        // Group by selected period
        const groupedData = d3.groups(milkData, groupFunction);

        let trendData = [];

        groupedData.forEach(([period, records], index) => {
            const totalLiters = d3.sum(records, (d) => d.liter);
            const totalAmount = d3.sum(records, (d) => d.rakkam);

            let growthRateLiters = 0;
            let growthRateAmount = 0;

            if (index > 0) {
                const prev = trendData[index - 1];
                growthRateLiters = ((totalLiters - prev.totalLiters) / prev.totalLiters) * 100;
                growthRateAmount = ((totalAmount - prev.totalAmount) / prev.totalAmount) * 100;
            }

            trendData.push({
                period,
                totalLiters,
                totalAmount,
                growthRateLiters: index > 0 ? growthRateLiters.toFixed(2) : null,
                growthRateAmount: index > 0 ? growthRateAmount.toFixed(2) : null,
            });
        });

        return NextResponse.json({ trendData }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
