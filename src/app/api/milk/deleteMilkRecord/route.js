import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Milk from '@/models/MilkModel';

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

    // Return a success response
    return NextResponse.json(
      { success: true, message: 'Milk record deleted successfully' },
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
