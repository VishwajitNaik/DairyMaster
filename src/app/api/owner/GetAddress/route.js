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

        return NextResponse.json(
            {
                message: "Addresses fetched successfully",
                data: Address || [], // Return an empty array if no addresses are found
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
