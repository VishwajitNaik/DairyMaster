import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";

connect();  

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId"); 
        console.log("userId", userId);
        
        const user = await User.findOne({ _id: userId }).populate("selectedKapat");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({
            message: "Selected Kapat fetched successfully",
            data: user.selectedKapat,
        }); 

    } catch (error) {
        console.error("Error fetching selected Kapat:", error);
        return NextResponse.json({ error: "Failed to fetch selected Kapat" }, { status: 500 });
    }
}