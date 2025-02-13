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
        const milkData = owner.userMilk ?? []; // Ensure it's an Array
        
        

        if (!Array.isArray(milkData) || milkData.length === 0) {
            return NextResponse.json({ trendData: [] }, { status: 200 });
        }

        // Step 4: Define grouping function
        let groupFunction;
        if (filter === "daily") {
            groupFunction = (d) => d3.timeFormat("%Y-%m-%d")(new Date(d.date));
        } else if (filter === "10days") {  // Match the exact filter name from the request
            groupFunction = (d) => {
                const date = new Date(d.date);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2-digit month
                const period = Math.floor((date.getDate() - 1) / 10) + 1; // 1st-10th, 11th-20th, 21st-end
        
                return `${year}-${month}-P${period}`;
            };
        } else if (filter === "monthly") {
            groupFunction = (d) => d3.timeFormat("%Y-%m")(new Date(d.date));
        } else if (filter === "yearly") {
            groupFunction = (d) => d3.timeFormat("%Y")(new Date(d.date));
        } else {
            return NextResponse.json({ error: "Invalid filter type" }, { status: 400 });
        }

        // Step 5: Group data using `d3.rollup()`
        const groupedData = d3.rollup(
            milkData,
            (records) => ({
                totalLiters: d3.sum(records, (d) => d.liter),
                totalAmount: d3.sum(records, (d) => d.rakkam)
            }),
            groupFunction
        );

        let trendData = [];
        let previous = null;

        // Step 6: Process grouped data
        groupedData.forEach((values, period) => {
            let growthRateLiters = null;
            let growthRateAmount = null;

            if (previous) {
                growthRateLiters = previous.totalLiters > 0
                    ? (((values.totalLiters - previous.totalLiters) / previous.totalLiters) * 100).toFixed(2)
                    : null;

                growthRateAmount = previous.totalAmount > 0
                    ? (((values.totalAmount - previous.totalAmount) / previous.totalAmount) * 100).toFixed(2)
                    : null;
            }

            trendData.push({
                period,
                totalLiters: values.totalLiters,
                totalAmount: values.totalAmount,
                growthRateLiters,
                growthRateAmount
            });

            previous = values;
        });

        return NextResponse.json({ trendData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching milk data:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
