import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Sangh from "@/models/SanghModel";

connect();

export async function GET(request) {
    try {
        // Commenting out token validation if not needed
        // const ownerId = await getDataFromToken(request);

        const sanghs = await Sangh.find({});
        return NextResponse.json({ data: sanghs }, { status: 200 });
    } catch (error) {
        console.error("Error fetching sanghs:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
