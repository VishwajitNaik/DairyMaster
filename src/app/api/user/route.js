import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const {username} = reqBody
        console.log(reqBody);

        const newUser = new User({
            username
        })
        
        const saveduser = await newUser.save();

        return NextResponse.json({
            message : "User created succ..",
            data: saveduser,
        })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}