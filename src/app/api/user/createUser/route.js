import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import User from "../../../../models/userModel";
import Owner from "@/models/ownerModel";
import bcrypt from "bcryptjs"

connect();

export async function POST(request) {
    try {
        const ownerId = getDataFromToken(request);
        console.log(ownerId);

        // Check if ownerId was successfully extracted
        if (!ownerId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const reqBody = await request.json();
        const { registerNo, name, milk, phone, bankName, accountNo, aadharNo, password } = reqBody;

        // Ensure all required fields are present
        if (!registerNo || !name || !milk || !phone || !bankName || !accountNo || !aadharNo || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

            // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const owner = await Owner.findById(ownerId)

        // Create a new user instance
        const newUser = new User({
            registerNo,
            name,
            milk,
            phone,
            bankName,
            accountNo,
            aadharNo,
            password: hashedPassword,
            createdBy: ownerId,
        });

        // Save the new user to the DB
        const savedUser = await newUser.save();

        owner.users.push(newUser._id);
        await owner.save();

        return NextResponse.json({
            message: "User created successfully...",
            data: savedUser
        });

    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error creating user:", error);

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
