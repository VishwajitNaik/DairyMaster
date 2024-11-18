import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import User from "../../../../models/userModel";
import Owner from "@/models/ownerModel";
import bcrypt from "bcryptjs";

connect();

export async function POST(request) {
    try {
        const ownerId = getDataFromToken(request);

        // Check if ownerId was successfully extracted
        if (!ownerId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const reqBody = await request.json();
        const { 
            registerNo, 
            name, 
            milk, 
            phone, 
            bankName, 
            accountNo, 
            aadharNo, 
            password, 
            selectedKapat // Capture selected Sthir Kapat options 
        } = reqBody;

        // Ensure all required fields are present
        if (!registerNo || !name || !milk || !phone || !bankName || !accountNo || !aadharNo || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!selectedKapat || !Array.isArray(selectedKapat) || selectedKapat.length === 0) {
            return NextResponse.json({ error: "Please select at least one Sthir Kapat option" }, { status: 400 });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const owner = await Owner.findById(ownerId);
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

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
            selectedKapat, // Store selected Sthir Kapat options in the user schema
        });

        // Save the new user to the DB
        const savedUser = await newUser.save();

        // Update owner's user list
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
