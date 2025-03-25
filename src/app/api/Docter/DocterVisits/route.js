import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import DocterVisit from "@/models/GetDocterVisit";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
    try {
        const ownerId = await getDataFromToken(request);

        const owner = await Owner.findById(ownerId);
        if (!owner) {
            console.log("Owner not found:", ownerId);
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        const visits = await DocterVisit.find({ createdBy: ownerId });
        return NextResponse.json({ data: visits }, { status: 200 });


    } catch (error) {
        console.error("Error in GET /api/Docter/DocterVisits:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}