import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Owner from '@/models/ownerModel';
import AddAddress from '@/models/AddAddress';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function POST(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const reqBody = await request.json();
        const { Address, PinCode } = reqBody;

        if (!Address || !PinCode) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const owner = await Owner.findById(ownerId);
        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Find any existing address for this owner (regardless of PinCode)
        const existingAddress = await AddAddress.findOne({ createdBy: ownerId });

        if (existingAddress) {
            // Always update the existing address instead of creating a new one
            existingAddress.Address = Address;
            existingAddress.PinCode = PinCode; // Update PinCode if it's different
            const updatedAddress = await existingAddress.save();

            return NextResponse.json(
                {
                    message: "Address updated successfully",
                    data: updatedAddress,
                },
                { status: 200 }
            );
        }

        // If no address exists, create a new one
        const newAddress = new AddAddress({
            Address,
            PinCode,
            createdBy: ownerId,
        });

        const savedAddress = await newAddress.save();
        owner.Address = [savedAddress._id]; // Ensure only one address ID is stored
        await owner.save();

        return NextResponse.json(
            {
                message: "New address added successfully",
                data: savedAddress,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
