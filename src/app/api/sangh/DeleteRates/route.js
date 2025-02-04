import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Rate from "@/models/RatesSangh";
import { getDataFromToken } from "@/helpers/getSanghFormToken";

connect();

export async function DELETE(request) {
    try {
        const sanghId = await getDataFromToken(request);

        if (!sanghId) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const url = new URL(request.url);
        const rateId = url.searchParams.get('id');

        if (!rateId) {
            return NextResponse.json({ error: "Rate ID not provided" }, { status: 400 });
        }

        const deletedRate = await Rate.findByIdAndDelete(rateId);

        if (!deletedRate) {
            return NextResponse.json({ error: "Rate not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Rate deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting rate:", error.message);
        return NextResponse.json({ error: "Error deleting rate", details: error.message }, { status: 500 });
    }
}