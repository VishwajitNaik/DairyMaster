import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/MilkModel";
import { getDataFromToken } from "@/helpers/getDataFromToken"; // Adjust the import path as necessary
import User from "@/models/userModel";

connect();

export async function GET(request) {
  try {
    // Get user ID from token using the helper function
    const userId = await getDataFromToken(request);
    console.log(userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

        // Find all users created by the owner
        const milkRecords = await User.find({ createdBy: userId }).populate('milkRecords');

        if (!milkRecords) {
          return NextResponse.json({ error: "No users found" }, { status: 404 });
        }

    // Fetch milk records for the logged-in user
    // const  = await Milk.find({ createdBy: userId });

    return NextResponse.json({ milkRecords });

  } catch (error) {
    console.error("Error fetching milk records:", error);
    return NextResponse.json({ error: "Fetching Error: " + error.message }, { status: 500 });
  }
}
