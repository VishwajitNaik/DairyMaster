import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Milk from '@/models/MilkModel';
import Owner from '@/models/ownerModel'; // Import Owner model
import User from '@/models/userModel';

// Ensure the database is connected
connect();

export async function DELETE(req) {
  try {
    // Extract the record ID from the request URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Check if the ID is provided
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Milk record ID is required' },
        { status: 400 }
      );
    }

    // Attempt to delete the milk record by its ID
    const deletedRecord = await Milk.findByIdAndDelete(id);

    // Check if the record was found and deleted
    if (!deletedRecord) {
      return NextResponse.json(
        { success: false, message: 'Milk record not found' },
        { status: 404 }
      );
    }

    // Remove the reference to the deleted milk record from the Owner model
    await Owner.updateMany(
      { userMilk: id }, // Find owners who have this milk record in their userMilk array
      { $pull: { userMilk: id } } // Remove the milk record from the userMilk array
    );

    await User.updateMany(
      { milkRecords: id }, // Find users who have this milk record in their milkRecords array
      { $pull: { milkRecords: id } } // Remove the milk record from the milkRecords array
    );

    // Return a success response
    return NextResponse.json(
      { success: true, message: 'Milk record deleted and owner updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting milk record:', error);

    // Handle any errors that occur during the process
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
