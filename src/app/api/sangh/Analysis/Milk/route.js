import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helpers/getSanghFormToken";
import Sangh from "@/models/SanghModel";
import * as d3 from "d3";

connect();

export async function GET(request) {
    try {
        const sanghId = await getDataFromToken(request);

        if (!sanghId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const sangh = await Sangh.findById(sanghId).populate("milkRecords");
        console.log("Sangh:", sangh);

        if (!sangh) {
            return NextResponse.json({ error: "Sangh not found" }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get("filter") || "daily";
        const milkRecords = sangh.milkRecords;

        // Separate cow and buff records
        const cowRecords = milkRecords.filter((record) => record.milkType === "cow");
        const buffRecords = milkRecords.filter((record) => record.milkType === "buff");
   

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

        // Group data separately for cow and buff
        const groupedCowData = d3.groups(cowRecords, groupFunction);
        const groupedBuffData = d3.groups(buffRecords, groupFunction);
        // Function to compute trend data
        const computeTrendData = (groupedData) => {
            let trendData = [];

            groupedData.forEach(([period, records], index) => {
                const totalLiters = d3.sum(records, (d) => d.milkLiter);
                const totalAmount = d3.sum(records, (d) => d.amount);

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

            return trendData;
        };

        // Compute trend data separately
        const cowTrendData = computeTrendData(groupedCowData);
        const buffTrendData = computeTrendData(groupedBuffData);

        console.log("Cow Trend Data:", cowTrendData);
        console.log("Buff Trend Data:", buffTrendData);

        return NextResponse.json({ cowTrendData, buffTrendData }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
