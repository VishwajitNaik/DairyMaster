import { connect } from "@/dbconfig/dbconfig";
import StoreBill from "@/models/SanghBillStorage";
import Sangh from "@/models/SanghModel";
import { getDataFromToken } from "@/helpers/getSanghFormToken";

// Establish database connection
connect();

export async function POST(request) {
    try {
        const body = await request.json();
        console.log("Request body:", JSON.stringify(body, null, 2));

        const SanghId = await getDataFromToken(request);
        console.log("SanghId from token:", SanghId);

        const { bills, startDate, endDate } = body;

        // Input validation
        if (!bills || bills.length === 0) {
            console.error("No bills provided in request body");
            return new Response(JSON.stringify({ error: "No bills to save" }), { status: 400 });
        }
        if (!startDate || !endDate) {
            console.error("Start date or end date missing");
            return new Response(
                JSON.stringify({ error: "Start date and end date are required" }),
                { status: 400 }
            );
        }
        if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
            console.error("Invalid date format detected");
            return new Response(
                JSON.stringify({ error: "Invalid date format" }),
                { status: 400 }
            );
        }

        // Validate Sangh
        const owner = await Sangh.findById(SanghId);
        if (!owner) {
            console.error("Owner not found with id:", SanghId);
            return new Response(JSON.stringify({ error: "Owner not found" }), { status: 404 });
        }

        console.log("Owner validation passed");

        // Map bills to match schema, add missing fields: ownerName and registerNo
        const billsWithDetails = bills.map((bill) => ({
            ownerId: SanghId, // Assuming SanghId is the ownerId
            sanghId: SanghId,
            ownerName: bill.ownerName || owner.name, // Add ownerName if missing from request
            registerNo: bill.registerNo, // Ensure registerNo is sent from frontend
            milkData: {
                totalLiters: bill.totalLiters,
                buffTotalLiters: bill.buffTotalLiters,
                buffTotalRakkam: bill.buffTotalRakkam,
                cowTotalLiters: bill.cowTotalLiters,
                cowTotalRakkam: bill.cowTotalRakkam,
            },
            extraRates: {
                totalBuffExtraRate: bill.totalBuffExtraRate,
                totalCowExtraRate: bill.totalCowExtraRate,
                buffExtraRate: bill.buffExtraRate || 0, // Set defaults if missing
                cowExtraRate: bill.cowExtraRate || 0,
            },
            kapatDetails: {
                totalKapat: bill.totalKapat,
                totalKapatRateMultiplybyTotalLiter: bill.totalKapatRateMultiplybyTotalLiter,
                kapatRatePerLiter: bill.kapatRatePerLiter || 0, // Default
            },
            dateRange: {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
            netPayment: bill.netPayment,
            totalRakkam: bill.totalRakkam,
        }));

        // Save bills to database
        const savedBills = await StoreBill.insertMany(billsWithDetails);
        console.log("Bills saved successfully:", savedBills);

        return new Response(
            JSON.stringify({ message: "Bills saved successfully", savedBills }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving bills:", error.message || error);
        return new Response(
            JSON.stringify({
                error: "Internal server error",
                details: error.message || "Unknown error occurred",
            }),
            { status: 500 }
        );
    }
}
