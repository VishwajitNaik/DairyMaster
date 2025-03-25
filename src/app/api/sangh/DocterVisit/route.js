import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import DocterVisit from "@/models/GetDocterVisit";
import Owner from "@/models/ownerModel";
import { getDataFromToken } from "@/helpers/getSanghFormToken";

connect();

export async function GET(request) {
    try {
        const sanghId = await getDataFromToken(request);

        const owner = await Owner.find({ sangh: sanghId });
        console.log("Owner:", owner);
        

        if(!owner) {
            console.log("Owner not found:", sanghId);
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        const visits = await DocterVisit.find({ createdBy: owner._id }).populate({ path: "createdBy", select: "dairyName" });

        if (!visits || visits.length === 0) {
            return NextResponse.json({ message: "No visits found." }, { status: 404 });
        }

        const visitsWithDairyName = visits.map(visit => ({
            ...visit._doc,
            dairyName: visit.createdBy ? visit.createdBy.dairyName : "Unknown Dairy",
        }));

        return NextResponse.json({ data: visitsWithDairyName }, { status: 200 });


    } catch (error) {
        console.error("Error in GET ", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}