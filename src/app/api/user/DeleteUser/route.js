import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse, NextRequest } from "next/server";
import { connect } from "../../../../dbconfig/dbconfig";
import User from "@/models/userModel";
import Owner from "@/models/ownerModel";

connect();

export async function DELETE(request) {
    try {
        const ownerId = getDataFromToken(request);

        // Check if the token was valid and we got an ownerId
        if (!ownerId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        // Extract user id from the request URL
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Find the user by id and createdBy field
        const user = await User.findOne({ _id: userId, createdBy: ownerId });

        // If user does not exist or was not created by this owner, return 404
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        // Remove the reference to the deleted user from the Owner model
        await Owner.updateMany(
            { users: userId }, // Find owners who have this user in their user array
            { $pull: { users: userId } } // Remove the user from the user array
        );

        return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
