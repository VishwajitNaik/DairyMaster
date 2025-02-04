import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import OwnerKapat from "@/models/AddKapatOption";
import { getDataFromToken } from "@/helpers/getSanghFormToken";
import Sangh from "@/models/SanghModel";

// Establish a database connection
connect();

export async function GET(request) {
    try {
        const sanghId = await getDataFromToken(request);

        const sangh = await Sangh.findById(sanghId);
        if (!sangh) {
            return NextResponse.json({ error: "Sangh not found" }, { status: 404 });
        }

        const ownerkapatRecords = await OwnerKapat.find({ createdBy: sanghId });
        
        if(ownerkapatRecords.length === 0) {
            return NextResponse.json({ message: "No records found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Owner kapat records fetched successfully.",
            data: ownerkapatRecords,
        });

    } catch (error) {
        console.error("Error fetching Sthirkapat records:", error);
        return NextResponse.json({ error: "Failed to fetch Sthirkapat records" }, { status: 500 });
    }
}

