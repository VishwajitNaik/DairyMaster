// Backend route example - api/kapat/getKapatByIds.js
import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import User from '@/models/userModel';

connect();

export async function GET(request) {
  const { userId } = request.url.searchParams; // Extract userId from query params

  try {
    const user = await User.findOne({ _id: userId }).populate('selectedKapat');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Selected Kapat fetched successfully',
      data: user.selectedKapat, // Returning populated selectedKapat
    });
  } catch (error) {
    console.error('Error fetching selectedKapat:', error);
    return NextResponse.json({ error: 'Failed to fetch selectedKapat' }, { status: 500 });
  }
}
