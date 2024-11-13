// app/api/owner/getOwnerName.js
import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Owner from '@/models/ownerModel';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function GET(request) {
  try {
    const ownerId = await getDataFromToken(request); // Get owner ID from token

    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID not found in token' }, { status: 400 });
    }

    // Find the owner by ID
    const owner = await Owner.findById(ownerId).select('dairyName').lean(); // Assuming the owner's name field is 'ownerName'
    

    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    return NextResponse.json({ ownerName: owner.dairyName });
  } catch (error) {
    console.error("Error fetching owner name:", error);
    return NextResponse.json({ error: 'Failed to fetch owner name' }, { status: 500 });
  }
}
