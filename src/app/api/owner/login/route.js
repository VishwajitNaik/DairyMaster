import { connect } from "mongoose";
import Owner from "../../../../models/ownerModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import Jwt from "jsonwebtoken";

connect(); // Make sure to use proper connection string and connection handling

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(reqBody);

    // Check if owner exists
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return NextResponse.json({ error: "Owner does not exist" }, { status: 400 });
    }
    console.log(`Owner found: ${JSON.stringify(owner)}`);

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, owner.password);
    console.log(`Password comparison result: ${validPassword}`);
    
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // Create token data
    const tokenData = {
      id: owner._id,
      ownerName: owner.ownerName,
      email: owner.email,
    };
    console.log(`Token data: ${JSON.stringify(tokenData)}`);

    // Create token
    const ownerToken = Jwt.sign(tokenData, "ownerSecretKey", { expiresIn: "1d" });

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
