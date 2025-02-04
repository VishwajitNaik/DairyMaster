import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig"; // Ensure your DB connection is working
import Owner from "@/models/ownerModel"; // Import Owner model
import { getDataFromToken } from "@/helpers/getSanghFormToken"; // Import function to extract data from token

// Ensure DB connection
connect();

export async function GET(request) {
    try {
        const sanghId = await getDataFromToken(request); // Extract Sangh ID from the token
        if (!sanghId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        console.log("Sangh ID:", sanghId);
        

        const startDate = new Date();
        const endDate = new Date();

        startDate.setHours(0, 0, 0, 0); // Start of the day
        endDate.setHours(23, 59, 59, 999); // End of the day

        // Fetch the owner and populate userMilk
        const owner = await Owner.findOne({ sangh: sanghId }).populate("userMilk");

        console.log("Owner:", owner.userMilk);
        if (!owner) {
            return NextResponse.json({ error: "Owner not found for the provided Sangh ID" }, { status: 404 });
        }

        const { userMilk } = owner; // Access the milk records directly from the owner's populated field

        // Variables for total milk, average fat, and average SNF
        let totalLiters = 0;
        let totalFat = 0;
        let totalSNF = 0;
        let totalRecords = 0;

        // Calculate total milk (liters), total fat, and total SNF for records within the date range
        const filteredMilkRecords = userMilk.filter(record => {
            const recordDate = new Date(record.date);
            recordDate.setHours(0, 0, 0, 0); // Normalize record date to remove time
            return recordDate >= startDate && recordDate <= endDate;
        });
        
        console.log("Filtered Milk Records:", filteredMilkRecords);

        filteredMilkRecords.forEach(record => {
            totalLiters += record.liter || 0; // Add liters of milk
            totalFat += record.fat || 0; // Add fat
            totalSNF += record.snf || 0; // Add SNF
            totalRecords += 1; // Count the number of records
        });

        // Calculate averages for fat and SNF
        const avgFat = totalRecords > 0 ? totalFat / totalRecords : 0;
        const avgSNF = totalRecords > 0 ? totalSNF / totalRecords : 0;

        // Return the milk information for the owner
        return NextResponse.json({
            message: "Milk information fetched successfully",
            data: {
                owner: {
                    _id: owner._id,
                    name: owner.name, // Assuming 'name' field exists in Owner model
                },
                totalLiters,
                avgFat,
                avgSNF,
                milkRecords: filteredMilkRecords.map(record => ({
                    _id: record._id,
                    date: record.date,
                    liter: record.liter,
                    fat: record.fat,
                    snf: record.snf,
                })),
            },
        });

    } catch (error) {
        console.error("Error fetching milk information:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


