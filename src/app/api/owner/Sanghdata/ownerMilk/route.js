import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel"; // Ensure this path is correct for your Owner model
import OwnerMilk from "@/models/MakeMilk"; // Import the OwnerMilk model

connect();

export async function GET(request) {
    try {
        // Retrieve the owner ID from the token (if needed)
        const ownerId = await getDataFromToken(request);
        console.log(ownerId);

        // Find the milk records of the owner using the ownerId
        const ownerMilkRecords = await OwnerMilk.find({ createdBy: ownerId }).populate("createdBy", "ownerName dairyName phone email"); // Use .populate() to populate the owner info

        // console.log("Owner Milk Records:", ownerMilkRecords);
        

        if (!ownerMilkRecords) {
            return NextResponse.json({ message: "No records found." }, { status: 404 });
        }

        // Return the milk records as the response
        return NextResponse.json({data: ownerMilkRecords});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching milk records" }, { status: 500 });
    }
}
