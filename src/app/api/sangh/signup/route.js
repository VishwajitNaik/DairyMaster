// /pages/api/sangh/signup.js
import mongoose from "mongoose";
import { connect } from "../../../../dbconfig/dbconfig";
import Sangh from "../../../../models/SanghModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { SanghName, email, phone, password } = reqBody;

        const existingSangh = await Sangh.findOne({ email });

        if (existingSangh) {
            return NextResponse.json({ error: "Sangh already Exists" }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // create a new Sangh 
        const newSangh = new Sangh({
            SanghName,
            email,
            phone,
            password: hashPassword,
        });

        const saveSangh = await newSangh.save();

        return NextResponse.json({
            message: "Sangh Signed Up successfully",
            success: true,
            saveSangh,
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
