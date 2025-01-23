import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request, { params }) {
  try {
    // Check if authorization header is present
    const authorizationHeader = request.headers.get("authorization");
    let ownerId;

    if (authorizationHeader) {
      // Token is provided, validate it
      ownerId = await getDataFromToken(request);
    } else {
      console.log("No token provided. Proceeding without authentication.");
    }

    const { registerNo } = await params;

    if (!registerNo) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Conditionally fetch user based on authentication
    let user;
    if (ownerId) {
      // Authenticated request - fetch user created by the owner, selecting specific fields
      user = await User.findOne({ _id: registerNo, createdBy: ownerId }).select("name registerNo milk selectedKapat");
    } else {
      // Non-authenticated request - fetch user regardless of creator, selecting specific fields
      user = await User.findOne({ _id: registerNo }).select("name registerNo milk selectedKapat");
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User fetched successfully",
      data: user,
    });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
