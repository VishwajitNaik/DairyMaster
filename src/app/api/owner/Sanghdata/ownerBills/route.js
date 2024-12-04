import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";
import savedOwnerBills from "@/models/SanghBillStorage";

connect();

export async function POST(request) {
  try {
    // Authenticate the owner
    const ownerId = await getDataFromToken(request);
    
    // Fetch the owner's details from the database
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    const { registerNo, ownerName } = owner;

    // Fetch bills based on owner registerNo and ownerName
    const ownerBills = await savedOwnerBills.find({
      registerNo: registerNo, // Compare using registerNo
      ownerName: ownerName,   // Compare using ownerName
    });

    // Return the filtered bills
    return NextResponse.json({ ownerBills }, { status: 200 });
  } catch (error) {
    console.error("Error fetching owner bills:", error.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
