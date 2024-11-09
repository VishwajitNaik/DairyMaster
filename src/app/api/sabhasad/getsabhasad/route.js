import { getDataFromSabhasadToken } from "@/helpers/getSabhsadToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Sabhasad from "@/models/sabhasad";

connect();

export async function GET(request) {
    try {
        const authorizationHeader = request.headers.get("authorization");
        let sabhsadId;

        if (authorizationHeader) {
            // Token is provided, validate it
            sabhsadId = await getDataFromSabhasadToken(request);
            console.log("Sabhasad ID from token:", sabhsadId);
        } else {
            console.log("No token provided. Proceeding without authentication.");
        }

        // Fetch all sabhsad data regardless of token presence
        const sabhsad = await Sabhasad.find({});

        return NextResponse.json({ data: sabhsad }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch sabhsad:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
