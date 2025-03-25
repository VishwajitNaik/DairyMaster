import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import Visits from "@/models/GetDocterVisit.js";

connect();

export async function POST(request) {
    try {
        const { visitId, visitDate, visitTime } = await request.json();

        const user = await getDataFromToken(request);

        const updatedVisit = await Visits.findByIdAndUpdate(
            visitId,
            {
                status: "Accepted",
                visitDate,
                visitTime,
            },
            { new: true }
        );

        if (!updatedVisit) {
            return NextResponse.json({ message: "Visit not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Visit accepted successfully.", data: updatedVisit }, { status: 200 });


    } catch (error) {
        console.error("Error in visit acceptance:", error.message);
        return NextResponse.json({ message: "Failed to accept visit.", error: error.message }, { status: 500 });
    }
}