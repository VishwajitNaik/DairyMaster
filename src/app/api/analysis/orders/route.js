import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Owner from '@/models/ownerModel';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import User from '@/models/userModel';
import * as d3 from 'd3';

connect();

export async function GET(req) {
    try {
        const ownerId = await getDataFromToken(req);
        if (!ownerId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.log("Owner ID:", ownerId);

        const owner = await Owner.findById(ownerId);
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Fetch all users created by this owner
        const users = await User.find({ createdBy: ownerId }).populate('userOrders');

        

        // Collect all userOrders across all users
        const orderData = users.reduce((acc, user) => {
            return acc.concat(user.userOrders); // Combine all orders from all users
        }, []);

        console.log("Order Data:", orderData);
        

        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter") || "daily"; // Default to daily

        let groupFunction;
        if (filter === "daily") {
            groupFunction = (d) => d3.timeFormat("%Y-%m-%d")(new Date(d.date));
        } else if (filter === "weekly") {
            groupFunction = (d) => d3.timeFormat("%Y-%W")(new Date(d.date)); // Week of the year
        } else if (filter === "monthly") {
            groupFunction = (d) => d3.timeFormat("%Y-%m")(new Date(d.date));
        } else if (filter === "yearly") {
            groupFunction = (d) => d3.timeFormat("%Y")(new Date(d.date));
        } else {
            return NextResponse.json({ error: "Invalid filter value" }, { status: 400 });
        }

        // Group data by selected filter period
        const groupedData = d3.groups(orderData, groupFunction);

        let trendData = [];

        groupedData.forEach(([period, records]) => {
            const totalOrders = records.length;
            const totalAmount = records.reduce((total, record) => total + record.rakkam, 0);
            const averageAmount = totalAmount / totalOrders;
            trendData.push({ period, totalOrders, totalAmount, averageAmount });
        });

        console.log("Trend Data:", trendData);
        

        return NextResponse.json({ trendData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching trend data:", error);
        return NextResponse.json({ error: "Failed to fetch trend data" }, { status: 500 });
    }
}
