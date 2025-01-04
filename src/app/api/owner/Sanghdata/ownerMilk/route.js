import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import OwnerMilk from "@/models/MakeMilk"; // Import the OwnerMilk model

connect();

export async function GET(request) {
    try {
        // Retrieve the owner ID from the token (if needed)
        const ownerId = await getDataFromToken(request);

        // Extract date range from query parameters (startDate and endDate)
        const { startDate, endDate, milkType } = request.nextUrl.searchParams;

        // Base query to fetch milk records created by the owner
        const query = {
            createdBy: ownerId,
        };

        // If startDate and endDate are provided, filter records by date range
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        // If a milkType is provided, filter records by milkType (cow or buffalo)
        if (milkType) {
            query.milkType = milkType; // Filtering based on milkType (cow or buffalo)
        }

        // Find the milk records of the owner using the ownerId and date range
        const ownerMilkRecords = await OwnerMilk.find(query).populate("createdBy", "ownerName dairyName phone email");

        const MorningMilkRecords = ownerMilkRecords.filter((record) => record.session === "morning");
        const EveningMilkRecords = ownerMilkRecords.filter((record) => record.session === "evening");
        

        // If no records found, return 404 response
        if (!ownerMilkRecords || ownerMilkRecords.length === 0) {
            return NextResponse.json({ message: "No records found." }, { status: 404 });
        }

        // Separate the records into Cow and Buffalo milk categories (only if milkType was not filtered)
        const CowMorningMilkRecords = MorningMilkRecords.filter((record) => record.milkType === "cow");
        const CowEveningMilkRecords = EveningMilkRecords.filter((record) => record.milkType === "cow");
        const BuffaloMorningMilkRecords = MorningMilkRecords.filter((record) => record.milkType === "buff");
        const BuffaloEveningMilkRecords = EveningMilkRecords.filter((record) => record.milkType === "buff");

        console.log("Cow Morning Milk Records:", CowMorningMilkRecords); // Debugging line
        console.log("Cow Evening Milk Records:", CowEveningMilkRecords); // Debugging line
        console.log("Buffalo Morning Milk Records:", BuffaloMorningMilkRecords); // Debugging line
        console.log("Buffalo Evening Milk Records:", BuffaloEveningMilkRecords); // Debugging line
        

        // Return the milk records as the response
        return NextResponse.json({
            data: ownerMilkRecords,
            CowMorningMilkRecords,
            CowEveningMilkRecords,
            BuffaloMorningMilkRecords,
            BuffaloEveningMilkRecords
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching milk records" }, { status: 500 });
    }
}
