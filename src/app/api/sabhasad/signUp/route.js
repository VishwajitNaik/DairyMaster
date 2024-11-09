import { connect } from "@/dbconfig/dbconfig";
import Sabhasad from "@/models/sabhasad";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { registerNo, name, selectDairy, milk, phone, bankName, accountNo, aadharNo, password } = reqBody;

        console.log("Request Body:", reqBody);

        // Ensure all required fields are present
        if (!registerNo || !name || !selectDairy || !milk || !phone || !bankName || !accountNo || !aadharNo || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check for existing sabhasad
        const existingSabhasad = await Sabhasad.findOne({ registerNo });
        if (existingSabhasad) {
            return NextResponse.json({ error: "Sabhasad with this register number already exists" }, { status: 400 });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new sabhasad instance
        const newSabhasad = new Sabhasad({
            registerNo,
            name,
            selectDairy,
            milk,
            phone,
            bankName,
            accountNo,
            aadharNo,
            password: hashedPassword,
            // Do not include createdBy here
        });

        // Save the new sabhasad to the DB
        const savedSabhasad = await newSabhasad.save();

        return NextResponse.json({
            message: "Sabhasad created successfully...",
            data: savedSabhasad,
        });

    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error creating sabhasad:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
