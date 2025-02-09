import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel"; // Assuming this is the model for the owner
import { getDataFromToken } from '@/helpers/getDataFromToken';
import * as d3 from "d3";

connect();

export async function GET(req) {
    try {
        // Step 1: Extract ownerId from token
        const ownerId = await getDataFromToken(req);
        if (!ownerId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Step 2: Fetch the owner's data
        const owner = await Owner.findById(ownerId).populate('userMilk'); // Fetch owner with userMilk data
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter") || "daily"; // Default to daily
        console.log("Filter:", filter, "Owner ID:", ownerId);

        // Step 3: Fetch all milk data from the owner's userMilk array
        const milkData = owner.userMilk; // Milk data is stored in the `userMilk` array

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

        // Step 4: Group data by selected time period
        const groupedData = d3.groups(milkData, groupFunction);

        let trendData = [];

        // Step 5: Calculate total liters, total amount, growth rate for each period
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
        console.error("Error fetching milk data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
