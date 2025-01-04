import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import MakeMilk from "@/models/MakeMilk";
import Owner from "@/models/ownerModel";

export async function POST(request) {
    try {
        // Connect to the database
        await connect();

        // Extract Sangh ID from the token
        const sanghId = await getDataFromToken(request);

        if (!sanghId) {
            console.log("Invalid or missing token");
            return NextResponse.json(
                { error: "Invalid or missing token" },
                { status: 401 }
            );
        }

        // Parse the request body
        const reqBody = await request.json();
        console.log("Request Body:", reqBody);

        const {
            registerNo,
            sampleNo,
            session,
            dairyName,
            quality,
            milkType,
            milkKG,
            milkLiter,
            smelLiter,
            fat,
            snf,
            rate,
            amount,
            senedCen,
            acceptedCen,
            smeledCen,
            bhesalType,
            precotion,
            date,
        } = reqBody;

        // Validate required fields
        if (
            !registerNo ||
            !sampleNo ||
            !session ||
            !dairyName ||
            !quality ||
            !milkType ||
            !milkKG ||
            !milkLiter ||
            !fat ||
            !snf ||
            !rate ||
            !amount ||
            !senedCen ||
            !acceptedCen ||
            !smeledCen ||
            !bhesalType ||
            !precotion ||
            !date
        ) {
            console.log("Missing fields in request body");
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        // Find the owner by Sangh ID and register number
        const owner = await Owner.findOne({ sangh: sanghId, registerNo });

        if (!owner) {
            console.log("Owner not found for SanghId:", sanghId);
            return NextResponse.json(
                { error: "Owner not found." },
                { status: 404 }
            );
        }

        const currentDate = new Date(date);

        // Check if a milk record for the same session, date, and milk type already exists
        const existingMilkRecord = await MakeMilk.findOne({
            createdBy: owner._id || registerNo,
            session,
            milkType,
            date: currentDate,
        });
        

        if (existingMilkRecord) {
            return NextResponse.json(
                {
                    message: "Milk record for this session and date already exists.",
                    alert: "Duplicate entry! A record for this session and date already exists.",
                    data: existingMilkRecord,
                },
                { status: 200 }
            );
        }

        console.log("Existing Milk Record:", existingMilkRecord);
        

        // Create a new milk record
        const newMilkRecord = new MakeMilk({
            registerNo,
            sampleNo,
            session,
            milkType,
            quality,
            milkKG,
            milkLiter,
            smelLiter,
            fat,
            snf,
            rate,
            amount,
            senedCen,
            acceptedCen,
            smeledCen,
            bhesalType,
            precotion,
            dairyName,
            createdBy: owner._id,
            date: currentDate,
        });

        // Save the new record
        await newMilkRecord.save();

        // Update the owner's milk records
        owner.OwnerMilkRecords.push(newMilkRecord._id);
        await owner.save();

        console.log("New Milk Record Created:", newMilkRecord);
        return NextResponse.json(
            {
                message: "Successfully added milk entry.",
                data: newMilkRecord,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding milk entry:", error.message);
        return NextResponse.json(
            {
                error: "Error storing milk record.",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
