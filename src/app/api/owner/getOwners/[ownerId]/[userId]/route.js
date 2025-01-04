import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request, { params }) {
  try {

    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }
    const user = await User.findOne({ _id: registerNo, createdBy: ownerId });

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
