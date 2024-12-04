import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import AddKapatOption from '@/models/AddKapatOption';
import Sangh from '@/models/SanghModel';
import { getDataFromToken } from '@/helpers/getSanghFormToken';

connect();


export async function POST(request) {
    try {
        const SanghId = await getDataFromToken(request);
        const reqBody = await request.json();

        const {date, KapatType, kapatCode, kapatName , kapatRate} = reqBody;

        if (!date || !KapatType || !kapatCode || !kapatName || (KapatType === 'Sthir Kapat' && !kapatRate)) {
            return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
        }

        const sangh = await Sangh.findById(SanghId);

        if (!sangh) {
            return NextResponse.json({ error: "Sangh not found" }, { status: 404 });    
        }

        const newKapat = new AddKapatOption({
            date,
            KapatType,
            kapatCode,
            kapatName,
            kapatRate: KapatType === 'Sthir Kapat' ? kapatRate : undefined,
            createdBy: SanghId,
        });
        
        const savedKapat = await newKapat.save();

        sangh.Kapat.push(savedKapat._id);
        await sangh.save();

        return NextResponse.json({ 
            message: "Kapat record added successfully",
            data: savedKapat
         }, { status: 200 });


    } catch (error) {
        console.error("Error adding Kapat record:", error);
        return NextResponse.json({ error: "Failed to add Kapat record" }, { status: 500 });
    }
}