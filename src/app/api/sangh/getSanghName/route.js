import { NextResponse } from "next/server";
import {connect} from "@/dbconfig/dbconfig";
import Sangh from "@/models/SanghModel";
import { getDataFromToken } from "@/helpers/getSanghFormToken";

connect();

export async function GET(request) {
    try {
        const sanghId = await getDataFromToken(request);
        
        const sangh = await Sangh.findById(sanghId);
        if (!sangh) {
            return NextResponse.json({ error: "Sangh not found" }, { status: 404 });
        }

        console.log("Authenticated Sangh Name:", sangh.SanghName);

        return NextResponse.json({ data: sangh.SanghName }, { status: 200 });  
        
    } catch (error) {
        console.error("Error fetching Sthirkapat records:", error);
        return NextResponse.json({ error: "Failed to fetch Sthirkapat records" }, { status: 500 });
    }
}