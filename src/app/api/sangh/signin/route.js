import { connect } from "mongoose"
import Sangh from "@/models/SanghModel"
import { NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import Jwt  from "jsonwebtoken"

connect();


export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        const sangh = await Sangh.findOne({ email });
        if(!sangh){
            return NextResponse.json({error: "Sangh doesnot exists"})
        } 
        console.log(sangh);

        //check if password is correct
        const validPassword = await bcryptjs.compare(password, sangh.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const tokenData = {
            id: sangh._id,
            SanghName: sangh.SanghName,
            email: sangh.email,
        };

        console.log(tokenData);

        const token = Jwt.sign(tokenData, "sanghSecurityKey", {expiresIn:"1y"})

        const response = NextResponse.json({
            message: "Login success...",
            success: true,
        })

        response.cookies.set("sanghToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60,
            path: "/",
        });

        return response;

    } catch (error) {
        console.error(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}