import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import DocterVisit from "@/models/GetDocterVisit";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Ensure database is connected
connect();
// POST route to create a new Doctor Visit entry
export async function POST(request) {
    try {
        console.log("Received POST request");

        const ownerId = await getDataFromToken(request);

        // Parse request body
        const reqBody = await request.json();

        const { username, Decises, AnimalType, date } = reqBody;

        // Validate input fields
        if (!username || !Decises || !AnimalType || !date) {
            return NextResponse.json({ error: "All fields are required, including date." }, { status: 400 });
        }

        // Find the owner by ID
        const owner = await Owner.findById(ownerId);
        if (!owner) {
            console.log("Owner not found:", ownerId);
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Create new Doctor Visit entry
        const newDocterVisit = new DocterVisit({
            username,
            Decises,
            AnimalType,
            date,
            createdBy: ownerId,
        });

        // Save to database
        const savedDocterVisit = await newDocterVisit.save();

        // Add the visit to the owner's record
        owner.DocterVisit.push(savedDocterVisit._id);
        await owner.save();

        return NextResponse.json(
            { message: "Doctor visit created successfully", data: savedDocterVisit },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST /api/Docter/GetDocterVisit:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
