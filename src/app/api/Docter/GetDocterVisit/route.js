import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import DocterVisit from "@/models/GetDocterVisit";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const reqBody = await request.json();

        const { username, Decises, AnimalType, date } = reqBody;

        // Validate input fields
        if (!username || !Decises || !AnimalType || !date) {
            return NextResponse.json({ error: "All fields are required, including date." }, { status: 400 });
        }

        // Find the owner by ID
        const owner = await Owner.findById(ownerId);
        if (!owner) {
            console.log("Owner not found", { ownerId });
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Create new DocterVisit entry
        const newDocterVisit = new DocterVisit({
            username,
            Decises,
            AnimalType,
            date, // Include the date field here
            createdBy: ownerId,
        });

        // Save the DocterVisit entry
        const savedDocterVisit = await newDocterVisit.save();

        // Add DocterVisit ID to the owner's document
        owner.DocterVisit.push(savedDocterVisit._id);
        await owner.save();

        return NextResponse.json({ message: "Doctor visit created successfully", data: savedDocterVisit }, { status: 201 });
    } catch (error) {
        console.log("Error creating DocterVisit", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
