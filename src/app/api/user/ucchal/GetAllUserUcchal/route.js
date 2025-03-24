import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Owner from "@/models/ownerModel";


connect();

export async function GET(request) {
    try {
        const ownerId = await getDataFromToken(request);

    

        if (!ownerId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const owner = await Owner.findById(ownerId).populate('ucchal');


        const TotalUcchal = owner.ucchal.reduce((acc, curr) => acc + curr.rakkam, 0);

        if (!owner) {
            return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
        }

        return NextResponse.json({ data: owner.ucchal, TotalUcchal }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch ucchal:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
        
    }
}

