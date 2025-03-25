import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Ucchal from "@/models/ucchalModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Owner from "@/models/ownerModel";

connect();

export async function DELETE(request) {
  try {
    // ✅ Get owner ID from token
    const ownerId = await getDataFromToken(request);
    if (!ownerId) {
      return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
    }

    // ✅ Get ucchal ID from query
    const { searchParams } = new URL(request.url);
    const ucchalId = searchParams.get('id');
    if (!ucchalId) {
      return NextResponse.json({ error: 'Ucchal ID is required' }, { status: 400 });
    }

    // ✅ Find and delete the Ucchal record
    const deletedUcchal = await Ucchal.findByIdAndDelete(ucchalId);
    if (!deletedUcchal) {
      return NextResponse.json({ error: 'Ucchal record not found' }, { status: 404 });
    }

    // ✅ Remove the deleted record from owner's ucchal array
    const owner = await Owner.findByIdAndUpdate(
      ownerId,
      { $pull: { ucchal: ucchalId } },
      { new: true }
    );

    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Ucchal deleted successfully', amount: deletedUcchal.rakkam }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete ucchal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
