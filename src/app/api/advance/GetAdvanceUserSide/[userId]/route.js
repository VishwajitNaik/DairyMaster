import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Advance from '@/models/advanceModel';

connect()

export async function GET(request, {params}){
    const { id } = params;

    try {
        const advance = await Advance.find({ userId: id }).populate('createdBy', 'registerNo name');
        if (!advance.length) {
            return NextResponse.json({ message: 'No Advance found for this user' });
        }

        return NextResponse.json({
            message: 'Advance fetched successfully',
            data: advance,
        });
    } catch (error) {
        console.error('Error fetching Advance:', error);
        return NextResponse.json({ error: 'Failed to fetch Advance' }, { status: 500 });
      }
}