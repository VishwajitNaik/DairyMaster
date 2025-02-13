// Necessary imports
import { connect } from '@/dbconfig/dbconfig';
import StoreBill from '@/models/BillStorage';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import Owner from '@/models/ownerModel';

// Connect to the database
connect();

// Named export for the POST method
export async function POST(req) {
    try {
        const body = await req.json();
        const ownerId = await getDataFromToken(req);
        const { bills, startDate, endDate } = body; // Include startDate and endDate

        const owner = await Owner.findById(ownerId);

        if (!owner) {
            return new Response(JSON.stringify({ error: 'Owner not found' }), { status: 404 });
        }

        // Check if bills already exist for the owner within the given date range
        const existingBills = await StoreBill.find({
            createdBy: ownerId,
            startDate: { $gte: new Date(startDate) },
            endDate: { $lte: new Date(endDate) },
        });

        if (existingBills.length > 0) {
            return new Response(JSON.stringify({ 
                message: 'या तारखे मधील बिल सेव केले आहे', 
                data: existingBills 
            }), { status: 400 });
        }

        // Add ownerId, startDate, and endDate to each bill
        const billsWithDetails = bills.map(bill => ({
            ...bill,
            createdBy: ownerId,
            startDate: new Date(startDate),   
            endDate: new Date(endDate),      
        }));

        const savedBills = await StoreBill.insertMany(billsWithDetails);

        savedBills.forEach(bill => {
            owner.storedBills.push(bill._id);
        });

        await owner.save();

        return new Response(JSON.stringify({ 
            message: 'successfully! बील जतन केले  आहे', 
            data: savedBills 
        }), { status: 200 });

    } catch (error) {
        console.error('Error saving bills:', error);
        return new Response(JSON.stringify({ error: 'Failed to save bills' }), { status: 500 });
    }
}
