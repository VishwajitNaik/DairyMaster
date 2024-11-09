import { connect } from "@/dbconfig/dbconfig";
import Sabhasad from "@/models/sabhasad";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { selectDairy, phone, password } = reqBody;

        console.log(phone);

        // Check if the user exists
        const sabhasad = await Sabhasad.findOne({ phone });
        console.log(sabhasad);

        if (!sabhasad) {
            console.log(`User with phone number ${phone} not found`);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Validate password
        const isPasswordValid = await bcryptjs.compare(password, sabhasad.password);
        console.log("is password Vaild : " ,isPasswordValid);

        if (!isPasswordValid) {
            console.log(`Invalid password for user with phone number ${phone}`);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Create a JWT token
        const sabhasadToken = jwt.sign({ userId: sabhasad._id }, "sabhasadSecretKey", { expiresIn: '1h' });

        console.log("Sabhasad Token : " ,sabhasadToken);

        // Set the token in a cookie
        const response = NextResponse.json({
            message: "User logged in successfully",
            token: sabhasadToken,
            user: {
                _id: sabhasad._id,
                phone: sabhasad.phone,
            },
        });

        response.cookies.set({
            name: 'SabhasadToken', // Unique cookie name for user token
            value: sabhasadToken,
            httpOnly: true, // Ensure the cookie is only accessible by the server
            maxAge: 60 * 60, // 1 hour
            path: '/', // Cookie available to all paths
            secure: process.env.NODE_ENV === 'production', // Cookie only sent over HTTPS in production
        });

        return response;

    } catch (error) {
        console.error("Error during user login:", error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
