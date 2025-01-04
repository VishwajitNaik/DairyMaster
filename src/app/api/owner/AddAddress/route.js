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

        const { Address, PinCode, createdBy } = reqBody;

        if (!Address || !PinCode || !createdBy) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const owner = await Owner.findById(ownerId);

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Ensure Address field exists and is an array
        if (!Array.isArray(owner.Address)) {
            owner.Address = [];
        }

        // Check if an address with the same PinCode already exists
        const existingAddress = await AddAddress.findOne({
            createdBy: ownerId,
            PinCode,
        });

        if (existingAddress) {
            // Update the existing address
            existingAddress.Address = Address; // Update the Address field
            const updatedAddress = await existingAddress.save();

            return NextResponse.json(
                {
                    message: "Address updated successfully",
                    data: updatedAddress,
                },
                { status: 200 }
            );
        }

        // Create a new address if no matching address exists
        const newAddress = new AddAddress({
            Address,
            PinCode,
            createdBy: ownerId,
        });

        const savedAddress = await newAddress.save();

        owner.Address.push(savedAddress._id); // Safely push the new address ID
        await owner.save();

        return NextResponse.json(
            {
                message: "Address added successfully",
                data: savedAddress,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
