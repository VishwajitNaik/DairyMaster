import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import AddAddress from '@/models/AddAddress';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function GET(request) {
    try {
        const ownerId = await getDataFromToken(request);

        // Fetch addresses created by the owner
        const Address = await AddAddress.find({ createdBy: ownerId });

        if (!Address || Address.length === 0) {
            return NextResponse.json({ error: "No addresses found for this owner" }, { status: 404 });
        }

        return NextResponse.json(
            {
                message: "Addresses fetched successfully",
                data: Address, // Return all addresses for the owner
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
