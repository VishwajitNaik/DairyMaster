import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Visit from "@/models/GetDocterVisit";

connect();

export async function PATCH(request) {
    try {
        const { visitId } = await request.json();

        if (!visitId) {
            return NextResponse.json({ error: "Visit ID is required" }, { status: 400 });
        }

        const updatedVisit = await Visit.findByIdAndUpdate(
            visitId,
            { status: "Accepted" },  // Update the status to "Visited"
            { new: true }
        );

        if (!updatedVisit) {
            return NextResponse.json({ error: "Visit not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Visit accepted successfully", data: updatedVisit }, { status: 200 });

    } catch (error) {
        console.log("Error accepting visit:", error.message);
        return NextResponse.json({ error: "Error accepting visit", details: error.message }, { status: 500 });
    }
}