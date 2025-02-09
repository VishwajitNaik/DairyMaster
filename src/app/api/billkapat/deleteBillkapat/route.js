import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import BillKapat from '@/models/BillKapat';
import Owner from '@/models/ownerModel';
import User from '@/models/userModel';

connect();

export async function DELETE(request, { params }) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: "Order record ID is required" }, 
                { status: 400 }
            );
        }

        // Find and delete the Order record by ID
        const deletedOrder = await BillKapat.findByIdAndDelete(id);

            // Remove the reference to the deleted milk record from the Owner model
            await Owner.updateMany(
                { ownerBillKapat: id }, // Find owners who have this milk record in their ownerBillKapat array
                { $pull: { ownerBillKapat: id } } // Remove the milk record from the userMilk array
            );

            await User.updateMany(
                { userBillKapat: id }, // Find owners who have this milk record in their userMilk array
                { $pull: { userBillKapat: id } } // Remove the milk record from the userMilk array
            );

        if (!deletedOrder) {    
            return NextResponse.json(
                { error: "Order record not found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Order record deleted successfully" },
            { status: 200 }
        );


    } catch (error) {
        console.error("Error deleting Order record:", error);
        return NextResponse.json(
            { error: "Failed to delete Order record" }, 
            { status: 500 });
    }
}

