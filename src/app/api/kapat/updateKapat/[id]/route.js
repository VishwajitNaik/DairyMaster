import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Sthirkapat from '@/models/sthirkapat';

connect();

export async function PUT(request, { params }) {
  const { id } = params;
  const updatedData = await request.json(); // Get updated data from request body

  try {
    const updatedRecord = await Sthirkapat.findByIdAndUpdate(id, updatedData, { new: true });
    
    if (!updatedRecord) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updatedRecord }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
