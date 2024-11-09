import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import Milk from '@/models/MilkModel';
import User from '@/models/userModel';
import Owner from '@/models/ownerModel';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function GET(request) {
  try {

    const ownerId = await getDataFromToken(request);

    if (!ownerId) {
        return NextResponse.json({ error: "Owner ID not found in token" }, { status: 400 });
    }

    // Find the owner by ID and populate the 'users' field
    const owner = await Owner.findById(ownerId).populate('users');

    if (!owner) {
        return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    // Fetch all users created by the owner
    const users = await User.find({ createdBy: ownerId }).select('_id');
    const userIds = users.map(user => user._id);

    // Fetch the latest milk record for these users
    const lastRecord = await Milk.findOne({ createdBy: { $in: userIds } })
      .sort({ date: -1 })
      .select('fat snf');

    // Check if record exists
    if (!lastRecord) {
      return NextResponse.json({ error: 'No previous session found for users under this owner.' }, { status: 404 });
    }

    return NextResponse.json({ data: lastRecord });
  } catch (error) {
    console.error("Error fetching last session data:", error);
    return NextResponse.json({ error: "Failed to fetch last session data" }, { status: 500 });
  }
}
