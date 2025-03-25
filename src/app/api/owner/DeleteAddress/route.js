import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Owner from '@/models/ownerModel';
import AddAddress from '@/models/AddAddress';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function DELETE(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const { searchParams } = new URL(request.url);
        const addressId = searchParams.get("addressId"); // Get addressId from query params

        if (!addressId) {
            return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
        }

        // Find the address
        const address = await AddAddress.findOne({ _id: addressId, createdBy: ownerId });
        if (!address) {
            return NextResponse.json({ error: "Address not found or unauthorized" }, { status: 404 });
        }

        // Remove the address from the Owner's Address array
        await Owner.updateOne(
            { _id: ownerId },
            { $pull: { Address: addressId } }
        );

        // Delete the address
        await AddAddress.findByIdAndDelete(addressId);

        return NextResponse.json({ message: "Address deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
