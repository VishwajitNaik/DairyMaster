import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import SanghRate from "@/models/RatesSangh";
import { getDataFromToken } from "@/helpers/getSanghFormToken";

connect();

export async function GET(request) {
    try {
        const sanghId = await getDataFromToken(request);
        console.log("Authenticated Sangh Id:", sanghId);

        if (!sanghId) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const rates = await SanghRate.find({ createdBy: sanghId });
        console.log("Rates:", rates);

        if (!rates || rates.length === 0) {
            return NextResponse.json({ error: "No rates found" }, { status: 404 });
        }

        return NextResponse.json({ data: rates }, { status: 200 });
    } catch (error) {
        console.error("Error fetching rates:", error);
        return NextResponse.json({ error: "Error fetching rates", details: error.message }, { status: 500 });
    }
}
