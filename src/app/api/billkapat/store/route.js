// Necessary imports
import { connect } from '@/dbconfig/dbconfig';
import StoreBill from '@/models/BillStorage';
import Sangh from '@/models/SanghModel';
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

        if (!bills || bills.length === 0) {
            return new Response(JSON.stringify({ error: 'No bills to save' }), { status: 400 });
        }

        const owner = await Owner.findById(ownerId);

        if (!owner) {
            return new Response(JSON.stringify({ error: 'Owner not found' }), { status: 404 });
        }

        // Add ownerId, startDate, and endDate to each bill
        const billsWithDetails = bills.map(bill => ({
            ...bill,
            createdBy: ownerId,
            startDate: new Date(startDate),   // Convert startDate to Date object
            endDate: new Date(endDate),      // Convert endDate to Date object
        }));

        console.log("Bills with details", billsWithDetails);

        const savedBills = await StoreBill.insertMany(billsWithDetails);
        console.log("Saved Bills", savedBills);

        savedBills.forEach(bill => {
            owner.storedBills.push(bill._id);
        });

        await owner.save();

        return new Response(JSON.stringify({ message: 'Bills saved successfully', data: savedBills }), { status: 200 });
    } catch (error) {
        console.error('Error saving bills:', error);
        return new Response(JSON.stringify({ error: 'Failed to save bills' }), { status: 500 });
    }
}
