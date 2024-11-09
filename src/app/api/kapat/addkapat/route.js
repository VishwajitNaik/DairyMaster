import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import Owner from '@/models/ownerModel';
import Sthirkapat from '@/models/sthirkapat';

connect();

export async function POST(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const reqBody = await request.json();

        const { date, KapatType, kapatCode, kapatName, kapatRate } = reqBody;

        if (!date || !KapatType || !kapatCode || !kapatName || (KapatType === 'Sthir Kapat' && !kapatRate)) {
            return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
        }

        const owner = await Owner.findById(ownerId);

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }

        const newKapat = new Sthirkapat({
            date,
            KapatType,
            kapatCode,
            kapatName,
            kapatRate: KapatType === 'Sthir Kapat' ? kapatRate : undefined,
            createdBy: ownerId,
        });

        const savedKapat = await newKapat.save();

        // You might need to add this Kapat to the owner's record, if there's a relationship.
        owner.Kapat.push(savedKapat._id);
        await owner.save();

        return NextResponse.json({
            message: "Kapat created successfully.",
            data: savedKapat,
        });

    } catch (error) {
        console.error("Error adding Kapat record:", error);
        return NextResponse.json({ error: "Failed to add Kapat record" }, { status: 500 });
    }
}
