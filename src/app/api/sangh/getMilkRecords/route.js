import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Milk from '@/models/MakeMilk';
import { getDataFromToken } from '@/helpers/getSanghFormToken';
import Owner from '@/models/ownerModel';

connect();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Parse start and end dates from query params
    const startDate = startDateParam ? new Date(startDateParam) : new Date();
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Get Sangh ID from token
    const sanghId = await getDataFromToken(request);

    // Find the owner associated with the Sangh ID
    const owner = await Owner.findOne({ sangh: sanghId });
    if (!owner) {
      console.log('Owner not found for Sangh:', sanghId);
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Fetch Milk Records
    const milkRecords = await Milk.find({
      createdBy: owner._id, // Use the ObjectId from the owner document
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate('createdBy', 'registerNo name')
      .sort({ date: 1 });


    // Calculate the total amount
    const totalAmount = milkRecords.reduce((sum, record) => sum + (record.amount || 0), 0);

    return NextResponse.json({
      message: 'Milk records fetched successfully',
      data: milkRecords,
      totalAmount,
    });
  } catch (error) {
    console.error('Error fetching milk records:', error);
    return NextResponse.json({ error: 'Failed to fetch milk records' }, { status: 500 });
  }
}
