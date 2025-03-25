import { connect } from "mongoose";
import Owner from "../../../../models/ownerModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Jwt from "jsonwebtoken";

connect(); // Ensure proper DB connection handling

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Find owner by email first
    const owner = await Owner.findOne({ email });

    if (!owner) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, owner.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Create token data
    const tokenData = {
      id: owner._id,
      ownerName: owner.ownerName,
      email: owner.email,
    };

    // Create token
    const ownerToken = Jwt.sign(tokenData, process.env.OWNER_TOKEN_SECRETE, { expiresIn: "1d" });

    const response = NextResponse.json({
      message: "Login Successful...",
      success: true,
    });

    // Set token in cookies
    response.cookies.set("ownerToken", ownerToken, { // Unique cookie name for owner token
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 1 day
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Error logging in owner:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
