import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig'; // Import your DB configuration
import ExtraRate from '@/models/ExtraRateModel'; // Adjust the path if necessary
import { getDataFromToken } from '@/helpers/getSanghFormToken'; // Helper to fetch Sangh data from the token

// Connect to the database
connect();

// POST route to add a new ExtraRate record
export async function POST(request) {
    try {
        // Extract Sangh ID from the token
        const SanghId = await getDataFromToken(request);

        // Parse the JSON body of the request
        const reqBody = await request.json();

        const { BuffRate, CowRate } = reqBody;

        // Validate required fields
        if (!BuffRate || !CowRate) {
            return NextResponse.json(
                { error: "Both BuffRate and CowRate are required." },
                { status: 400 }
            );
        }

        // Create a new ExtraRate document
        const newExtraRate = new ExtraRate({
            BuffRate,
            CowRate,
            createdBy: SanghId,
        });

        // Save the new document to the database
        await newExtraRate.save();

        return NextResponse.json(
            { message: "ExtraRate added successfully.", data: newExtraRate },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding ExtraRate:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// GET route to fetch all ExtraRate records for the authenticated Sangh
export async function GET(request) {
    try {
        // Extract Sangh ID from the token
        const SanghId = await getDataFromToken(request);

        // Fetch ExtraRate records for the Sangh
        const extraRates = await ExtraRate.find({ createdBy: SanghId });

        return NextResponse.json(
            { message: "ExtraRates fetched successfully.", data: extraRates },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching ExtraRates:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
      // Extract the rate ID from the request URL
      const url = new URL(request.url);
      const rateId = url.searchParams.get("id");
  
      if (!rateId) {
        return NextResponse.json(
          { message: "Rate ID is required for deletion" },
          { status: 400 }
        );
      }
  
      // Verify the user making the request
      const sanghId = await getDataFromToken(request);
  
      // Find and delete the rate by ID
      const deletedRate = await ExtraRate.findOneAndDelete({
        _id: rateId,
        createdBy: sanghId,
      });
  
      if (!deletedRate) {
        return NextResponse.json(
          { message: "Rate not found or unauthorized action" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "Rate deleted successfully", data: deletedRate },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting rate:", error.message);
      return NextResponse.json(
        { message: "Failed to delete the rate", error: error.message },
        { status: 500 }
      );
    }
  }
