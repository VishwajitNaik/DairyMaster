import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import BillKapat from '@/models/BillKapat';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import User from '@/models/userModel';

connect();

export async function POST(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const reqBody = await request.json();

        const { registerNo, date, username, milktype, orderData, rate } = reqBody;

        // ✅ Validate required fields
        if (!registerNo || !date || !username || !milktype || !orderData || !rate) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // ✅ Validate rate data type
        if (isNaN(rate)) {
            return NextResponse.json({ error: "Rate must be a valid number" }, { status: 400 });
        }

        // ✅ Convert rate to float
        const rateParsed = parseFloat(rate);

        // ✅ Fetch user
        const user = await User.findOne({ registerNo, createdBy: ownerId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ✅ Insert new BillKapat record with insertOne
        const newBillKapat = {
            registerNo,
            date,
            username,
            milktype,
            orderData,
            rate: rateParsed,
            createdBy: user._id,
        };

        const result = await BillKapat.collection.insertOne(newBillKapat);

        // ✅ Update user's BillKapat array
        await User.updateOne({ _id: user._id }, { $push: { userBillKapat: result.insertedId } });

        return NextResponse.json({
            message: "कपात विवरण सफलतापूर्वक केले..",
            data: { ...newBillKapat, _id: result.insertedId },
        });

    } catch (error) {
        console.error("Error adding Order record:", error.message);
        return NextResponse.json({ error: "Failed to add Order record", details: error.message }, { status: 500 });
    }
}
