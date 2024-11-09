import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Sthirkapat from '@/models/sthirkapat';

connect();

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const deletedRecord = await Sthirkapat.findByIdAndDelete(id);

    if (!deletedRecord) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Record deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
