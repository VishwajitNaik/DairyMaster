import User from "@/models/userModel";
import Milk from "@/models/MilkModel";
import Owner from "@/models/ownerModel";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const { startDate, endDate, milkType } = await request.json();

        const owner = await Owner.findById(ownerId);

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Validate dates
        if (!startDate || !endDate) {
            return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
        }

        // Validate milk type
        if (!milkType) {
            return NextResponse.json({ error: "Milk type is required" }, { status: 400 });
        }

        const users = await User.find({ createdBy: ownerId }).select('_id registerNo');
        const userIds = users.map(user => user._id);

        // Fetch milk records within the date range and milk type
        const milkRecords = await Milk.find({
            createdBy: { $in: userIds },
            milk: milkType, // Filter by milk type
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        }).select("_id registerNo session milk liter fat snf dar rakkam createdBy date");

        if (!milkRecords.length) {
            return NextResponse.json({ error: "No milk records found" }, { status: 404 });
        }

        // Organize milk records by user
        const userMilkData = users.map(user => {
            const userRecords = milkRecords.filter(record => record.createdBy.toString() === user._id.toString());

            const milkDataByType = userRecords.reduce((acc, record) => {
                const milkType = record.milk;

                if (!acc[milkType]) {
                    acc[milkType] = [];
                }

                acc[milkType].push({
                    session: record.session,
                    liter: record.liter,
                    fat: record.fat,
                    snf: record.snf,
                    dar: record.dar,
                    rakkam: record.rakkam,
                    date: record.date,
                });

                return acc;
            }, {});

            return {
                userId: user._id,
                registerNo: user.registerNo,
                milkData: milkDataByType,
            };
        });

        return NextResponse.json({ userMilkData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching milk records:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
