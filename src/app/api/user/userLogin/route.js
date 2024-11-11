import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ error: "Phone number and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      console.log(`User with phone number ${phone} not found`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`User found: ${JSON.stringify(user)}`);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password comparison result: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log(`Invalid password for user with phone number ${phone}`);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create a JWT token
    const userToken = jwt.sign({ userId: user._id }, process.env.USER_TOKEN_SECRETE, { expiresIn: '1h' });

    // Set the token in a cookie
    const response = NextResponse.json({
      message: "User logged in successfully",
      token: userToken,
      user: {
        _id: user._id,
        phone: user.phone,
      },
    });

    response.cookies.set({
      name: 'userToken', // Unique cookie name for user token
      value: userToken,
      httpOnly: true, // Ensure the cookie is only accessible by the server
      maxAge: 60 * 60, // 1 hour
      path: '/', // Cookie available to all paths
      secure: process.env.NODE_ENV === 'production', // Cookie only sent over HTTPS in production
    });

    return response;

  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json({ error: "Login Error: " + error.message }, { status: 500 });
  }
}
