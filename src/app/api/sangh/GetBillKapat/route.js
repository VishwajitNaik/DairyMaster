import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import BillKapat from "@/models/OwnerKapat";
import Owner from "@/models/ownerModel";

// Ensure database connection
connect();

export async function GET(request) {
    try {
        // Extract Sangh ID from the token
        const SanghId = await getDataFromToken(request);
        if (!SanghId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        console.log("SanghId:", SanghId);

        // Find the owner and populate ownerBillKapat records
        const owner = await Owner.findOne({ sangh: SanghId }).populate("ownerBillKapat");
        if (!owner) {
            console.error("Owner not found for Sangh:", SanghId);
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        console.log("Owner details:", {
            sanghId: owner.sangh,
            ownerId: owner._id,
            ownerBillKapat: owner.ownerBillKapat,
        });

        // Return the populated ownerBillKapat records
        return NextResponse.json(
            { data: owner.ownerBillKapat },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching BillKapat:", error.message);
        return NextResponse.json(
            { error: "Error fetching BillKapat", details: error.message },
            { status: 500 }
        );
    }
}
