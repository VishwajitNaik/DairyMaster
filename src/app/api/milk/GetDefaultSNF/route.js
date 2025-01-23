import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig';
import DefaultSNF from '@/models/DefaultSNF';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect();

export async function GET(request) {
    try {
        // Extract ownerId from token
        const ownerId = await getDataFromToken(request);        
        const defaultSNF = await DefaultSNF.findOne({ createdBy: ownerId });

        if (!defaultSNF) {        
            return NextResponse.json({ error: 'Default SNF not found' }, { status: 404 });
        }

        return NextResponse.json({ data: defaultSNF }, { status: 200 });
    } catch (error) {
        console.error('Error fetching default SNF:', error);        
        return NextResponse.json({ error: 'Failed to fetch default SNF' }, { status: 500 });
    }
}