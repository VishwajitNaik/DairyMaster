import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig'; // Make sure DB connection is correctly set up
import User from '@/models/userModel'; // Assuming User model has a reference to selectedKapat

connect();

export async function GET(request) {
  const url = new URL(request.url); // Parse the URL to get query params
  const userId = url.searchParams.get('userId'); // Get userId from query parameters

  try {
    // Find the user by ID and populate selectedKapat field
    const user = await User.findOne({ _id: userId }).populate('selectedKapat');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the selectedKapat for the user
    return NextResponse.json({
      message: 'Selected Kapat fetched successfully',
      data: user.selectedKapat, // Return the populated selectedKapat
    });
  } catch (error) {
    console.error('Error fetching selectedKapat:', error);
    return NextResponse.json({ error: 'Failed to fetch selectedKapat' }, { status: 500 });
  }
}
