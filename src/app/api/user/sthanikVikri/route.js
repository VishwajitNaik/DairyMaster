import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig.js";
import SthanikVikri from "@/models/sthanikVikri";
import Owner from "@/models/ownerModel";
import bcrypt from "bcryptjs";

connect();

export async function POST(request) {

    try {
        const ownerId = getDataFromToken(request);
        console.log("Owner Id:", ownerId);

        if (!ownerId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const reqBody = await request.json();
        const { registerNo, name, milk, phone, email, password } = reqBody;

        if (!registerNo || !name || !milk || !phone || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const owner = await Owner.findOne({ _id: ownerId });
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        const newSthanikVikri = new SthanikVikri({
            registerNo,
            name,
            milk,
            phone,
            email,
            password: hashedPassword,
            createdBy: owner._id,
        });

        const savedSthanikVikri = await newSthanikVikri.save();

        return NextResponse.json({ 
            message: "vikri user created successfully...", 
            data: savedSthanikVikri }, { status: 201 
        });

    } catch (error) {
        console.error("Error creating vikri user:", error);
        return NextResponse.json({ error: "Error creating vikri user" }, { status: 500 });
    }

}
