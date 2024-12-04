import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import OwnerKapat from '@/models/OwnerKapat';
import { getDataFromToken } from '@/helpers/getSanghFormToken';
import Owner from '@/models/ownerModel';

// Establish a database connection
connect();

export async function POST(request) {
    try {
        // Get the Sangh ID from the token (this should match the logged-in user's Sangh)
        const SanghId = await getDataFromToken(request);

        // Parse the request body
        const reqBody = await request.json();
        const { registerNo, date, username, orderData, rate } = reqBody;

        // Validate required fields
        if (!registerNo || !date || !username || !orderData || !rate) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate that the rate is a number
        if (isNaN(rate)) {
            return NextResponse.json(
                { error: "Rate must be a valid number" },
                { status: 400 }
            );
        }

        // Convert rate to a float
        const rateParsed = parseFloat(rate);

        // Find the owner associated with the register number and match the Sangh ID
        const owner = await Owner.findOne({ registerNo, sangh: SanghId });

        // If no owner is found, return an error
        if (!owner) {
            return NextResponse.json(
                { error: "Owner not found for the given Sangh ID" },
                { status: 404 }
            );
        }

        console.log("Owner found:", owner);

        // Create a new OwnerKapat document
        const ownerKapat = new OwnerKapat({
            owner: owner._id,
            registerNo,
            date,
            username,
            orderData,
            rate: rateParsed,
            createdBy: SanghId,
        });

        // Save the document to the database
        const savedOrder = await ownerKapat.save();

        owner.Kapat.push(ownerKapat._id);
        await owner.save();

        owner.ownerBillKapat.push(ownerKapat._id);
        await owner.save();

        // Return a success response
        return NextResponse.json(
            {
                message: "Order saved successfully",
                data: savedOrder,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error saving order:", error.message);
        return NextResponse.json(
            {
                error: "Error saving order",
                details: error.message,
            },
            { status: 500 }
        );
    }
}


