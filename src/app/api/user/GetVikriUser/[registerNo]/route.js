import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/sthanikVikri";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request, { params }) {
    try {
        const authorizationHeader = request.headers.get("authorization");
        let ownerId;

        if(authorizationHeader) {
            ownerId = await getDataFromToken(authorizationHeader);
        
        }else {
            console.log("No token provided. Proceeding without authentication.");
        }

        const { registerNo } = await params;

        if (!registerNo) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        console.time("findUser");

        let user;
        if(ownerId) {
            user = await User.findOne({ _id: registerNo, createdBy: ownerId }).select("name registerNo milk");
        } else {
            user = await User.findOne({ _id: registerNo }).select("name registerNo milk");
        }

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.timeEnd("findUser");

        return NextResponse.json({
            message: "User found",
            data: user
        })

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}