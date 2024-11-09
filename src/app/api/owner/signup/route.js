import { connect } from "../../../../dbconfig/dbconfig"; // Import the database configuration and connection setup
import Owner from "../../../../models/ownerModel"; // Import the Owner model
import { NextResponse } from "next/server"; // Import NextResponse for API route responses
import bcryptjs from "bcryptjs"; // Import bcryptjs for password hashing
import { sendEmail } from "@/helpers/mailer"; // Import the sendEmail helper function for email verification
import Sangh from "@/models/SanghModel";
import { getDataFromToken } from "@/helpers/getSanghFormToken";

// Ensure the database is connected
connect();

export async function POST(request) {
  try {
    const sanghId = await getDataFromToken(request);
    console.log("Authenticated Sangh ID:", sanghId);

    if (!sanghId) {
      return NextResponse.json({ error: "Authentication failed: No Sangh ID found." }, { status: 401 });
    }

        // Step 2: Fetch the Sangh document using the Sangh ID
    const sangh = await Sangh.findById(sanghId);
    if (!sangh) {
      return NextResponse.json({ error: "Sangh not found." }, { status: 404 });
    }
    console.log("Authenticated Sangh Name:", sangh.SanghName);

    const reqBody = await request.json();
    const { ownerName, dairyName, phone, email, password, registerNo } = reqBody;
    console.log("Received request body:", reqBody);

    // Check if the owner already exists
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return NextResponse.json({ error: "Owner already exists" }, { status: 400 });
    }

        // Optional: Check for unique registerNo or other unique fields
    const existingRegisterNo = await Owner.findOne({ registerNo });
    if (existingRegisterNo) {
      return NextResponse.json({ error: "Register No already in use." }, { status: 400 });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    console.log("Creating new owner with data:", {
      registerNo,
      ownerName,
      dairyName,
      sangh : sangh._id,
      phone,
      email,
      password: hashPassword,
    });

    // Create a new owner
    const newOwner = new Owner({
      registerNo,
      ownerName,
      dairyName,
      sangh : sangh._id,
      phone,
      email,
      password: hashPassword,
    });

    // Save the new owner
    const savedOwner = await newOwner.save();
    console.log("Saved owner:", savedOwner);

    // Send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedOwner._id });

    return NextResponse.json({
      message: "Owner signed up successfully",
      success: true,
      savedOwner :  {
        _id: savedOwner._id,
        registerNo: savedOwner.registerNo,
        ownerName: savedOwner.ownerName,
        dairyName: savedOwner.dairyName,
        sangh: sangh.SanghName, // Return Sangh's name instead of ObjectId
        phone: savedOwner.phone,
        email: savedOwner.email,
        isVerified: savedOwner.isVerified,
        isAdmin: savedOwner.isAdmin,
        // Exclude sensitive fields like password
      },
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
