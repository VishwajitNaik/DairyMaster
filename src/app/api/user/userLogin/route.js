import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import Owner from "@/models/ownerModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  try {
    const { phone, password, registerNo, milk } = await request.json();

    // Validate required fields
    if (!phone || !password || !registerNo || !milk) {
      return NextResponse.json(
        { error: "Phone, password, owner registerNo, and milk are required" },
        { status: 400 }
      );
    }

    // Find the owner using their registerNo
    const owner = await Owner.findOne({ registerNo });
    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    // Find the user based on phone, milk, and the owner's ID
    const user = await User.findOne({ phone, milk, createdBy: owner._id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create a JWT token
    const userToken = jwt.sign(
      { userId: user._id },
      process.env.USER_TOKEN_SECRETE,
      { expiresIn: "1h" }
    );

    // Set the token in a cookie
    const response = NextResponse.json({
      message: "User logged in successfully",
      token: userToken,
      user: {
        _id: user._id,
        phone: user.phone,
        milk: user.milk,
        name: user.name,
      },
    });

    response.cookies.set({
      name: "userToken",
      value: userToken,
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json({ error: "Login Error: " + error.message }, { status: 500 });
  }
}
