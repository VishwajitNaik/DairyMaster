import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import TagType from "@/models/TagType";

connect();

export async function GET(req) {
    try {
        // Retrieve the authenticated sangh ID from the token
        const sanghId = await getDataFromToken(req);

        if (!sanghId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        // Fetch all TagType records created by this sanghId
        const tagTypes = await TagType.find({ createdBy: sanghId });

        return NextResponse.json({
            message: "Tag Types fetched successfully",
            data: tagTypes
        });

    } catch (error) {
        console.error("Error fetching Tag Types:", error);
        return NextResponse.json({ error: "Error fetching Tag Types" }, { status: 500 });
    }
}
