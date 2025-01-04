import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig.js";
import TagType from "@/models/TagType";

connect();

export async function POST(req, res) {
    try {
        const sanghId = await getDataFromToken(req);

        if (!sanghId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const reqBody = await req.json()
        const { TagTypeName } = reqBody;

        if (!TagTypeName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newTagType = new TagType({
            TagType: TagTypeName,
            createdBy: sanghId,
        });

        const savedTagType = await newTagType.save();

        return NextResponse.json({
            message: "Tag Type added sucessfully",
            data: savedTagType
        });

    } catch (error) {
        console.error("Error adding Tag Type:", error);
        return NextResponse.json({ error: "Error adding Tag Type" }, { status: 500 });
    }
}