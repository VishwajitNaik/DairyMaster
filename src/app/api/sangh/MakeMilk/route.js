import { getDataFromToken } from "@/helpers/getSanghFormToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig"; 
import MakeMilk from "@/models/MakeMilk";
import Owner from "@/models/ownerModel";

export async function POST(request) {
    try {
        await connect();

        const sanghId = await getDataFromToken(request);

        // Validate the SanghId
        if (!sanghId) {
            console.log("Invalid or missing token");
            return NextResponse.json(
                { error: 'Invalid or missing token' },
                { status: 401 }
            );
        }

        // Parse the request body
        const reqBody = await request.json();
        console.log("Request Body:", reqBody);

        // Ensure the keys match the incoming request body
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
            date 
        } = reqBody;

        // Validate the required fields
        if (!registerNo || !sampleNo || !session || !dairyName || !quality || !milkType || !milkKG || !milkLiter || !fat || !snf || !rate || !amount || !senedCen || !acceptedCen || !smeledCen || !bhesalType || !precotion || !date) {
            console.log("Missing fields in request body");
            return NextResponse.json(
                { error: 'All fields are required.' },
                { status: 400 }
            );
        }

        // Find the owner by sanghId
        const owner = await Owner.findOne({ sangh: sanghId });
        if (!owner) {
            console.log("Owner not found for SanghId:", sanghId);
            return NextResponse.json(
                { error: "Owner not found." },
                { status: 404 }
            );
        }

        const currentDate = new Date(date);
        console.log("Parsed Date:", currentDate);

        // Check for existing milk records
        let ownerMilkRecord = await MakeMilk.findOne({
            createdBy: owner._id,
            session,
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
            date: currentDate
        });

        console.log("Existing Milk Record:", ownerMilkRecord);

        if (ownerMilkRecord) {
            return NextResponse.json({
                message: "Milk record for this session and date is already available.",
                data: ownerMilkRecord,
            }, { status: 200 });
        }

        // Create a new milk record
        ownerMilkRecord = new MakeMilk({
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
            date: currentDate
        });

        // Save the new record
        await ownerMilkRecord.save();
        console.log("New Milk Record Created:", ownerMilkRecord);

        // Update owner's milk records
        owner.OwnerMilkRecords.push(ownerMilkRecord._id);
        await owner.save();
        console.log("Updated Owner's Milk Records:", owner.OwnerMilkRecords);

        return NextResponse.json({
            message: "Successfully added milk entry.",
            data: ownerMilkRecord
        }, { status: 201 });

    } catch (error) {
        console.error("Error adding milk entry:", error.message);
        return NextResponse.json({
            error: "Error storing order information.",
            details: error.message,
        }, { status: 500 });
    }
}