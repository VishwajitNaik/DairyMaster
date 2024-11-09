import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import Owner from '@/models/ownerModel';
import Sthirkapat from '@/models/sthirkapat';

connect();

export async function GET(request) {
    try {
        const ownerId = await getDataFromToken(request);

        const owner = await Owner.findById(ownerId);

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        // Fetch all Sthirkapat records created by the owner and filter by KapatType = "Sthir Kapat"
        const sthirkapatRecords = await Sthirkapat.find({
            createdBy: ownerId
        });

        // Calculate the total of kapatRate for Sthir Kapat
        const totalKapatRate = sthirkapatRecords.reduce((total, record) => total + (record.kapatRate || 0), 0);

        return NextResponse.json({
            message: "Sthirkapat records fetched successfully.",
            totalKapatRate,
            data: sthirkapatRecords,
        });

    } catch (error) {
        console.error("Error fetching Sthirkapat records:", error);
        return NextResponse.json({ error: "Failed to fetch Sthirkapat records" }, { status: 500 });
    }
}
