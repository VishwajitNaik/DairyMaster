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

        // Validate all required fields except orderNo
        if (!registerNo || !date || !username || !milktype || !orderData || !rate) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Validate rate data type
        if (isNaN(rate)) {
            return NextResponse.json({ error: "Rate must be a valid number" }, { status: 400 });
        }

        // Convert rate to float
        const rateParsed = parseFloat(rate);

        // Fetch user and save order
        const user = await User.findOne({ registerNo, createdBy: ownerId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const newBillKapat = new BillKapat({
            registerNo,
            date,
            username,
            milktype,
            orderData,
            rate: rateParsed,
            createdBy: user._id,
        });

        const savedBillKapat = await newBillKapat.save();

        user.userBillKapat.push(newBillKapat._id);
        await user.save();

        return NextResponse.json({
            message: "Order record added successfully",
            data: savedBillKapat,
        });

    } catch (error) {
        console.error("Error adding Order record:", error);
        return NextResponse.json({ error: "Failed to add Order record" }, { status: 500 });
    }
}
