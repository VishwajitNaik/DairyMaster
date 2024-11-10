import User from "@/models/userModel";
import Milk from "@/models/MilkModel";
import BillKapat from "@/models/BillKapat";
import Sthirkapat from '@/models/sthirkapat';
import Owner from '@/models/ownerModel'; // Make sure to import the Owner model
import { NextResponse } from "next/server";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";

export async function POST(request) {
  try {
    const ownerId = await getDataFromToken(request);
    const { startDate, endDate } = await request.json();
    console.log(ownerId);

    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    // Validate dates
    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 });
    }

    // Fetch all users
    const users = await User.find({ createdBy: ownerId });

    // Fetch kapat records for the owner and calculate total kapat rate
    const sthirkapatRecords = await Sthirkapat.find({
      createdBy: ownerId,
      KapatType: "Sthir Kapat"
    });

    const totalKapatRate = sthirkapatRecords.reduce((total, record) => total + (record.kapatRate || 0), 0);
    const formattedTotalKapatRate = parseFloat(totalKapatRate.toFixed(1)); // Round to 1 decimal place

    console.log(formattedTotalKapatRate); // Expected output: 92.4

    // Define variables for results
    const results = [];

    for (const user of users) {
      // Fetch milk records for the date range
      const milkRecords = await Milk.find({
        createdBy: user._id,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });

      // Calculate total liters and total rakkam
      const totalLiters = Math.floor(milkRecords.reduce((total, record) => total + record.liter, 0));
      const totalRakkam = Math.floor(milkRecords.reduce((total, record) => total + record.rakkam, 0));

      // // Calculate total kapat rate multiplied by total liters
      // const totalKapatRateMultiplybyTotalLiter = parseFloat(totalLiters.toFixed(1)) * parseFloat(formattedTotalKapatRate.toFixed(1));

      // console.log(totalKapatRateMultiplybyTotalLiter);
      // First, calculate total liters and total kapat rate, making sure you perform multiplication first
const totalKapatRateMultiplybyTotalLiter = totalLiters * formattedTotalKapatRate;

// Then, format the result to one decimal place
const formattedResult = parseFloat(totalKapatRateMultiplybyTotalLiter.toFixed(1));

console.log(formattedResult); // This should give you a clean output like 28.8 or 63.6


      // Fetch bill kapat records for the user filtered by date range
      const billKapatRecords = await BillKapat.find({
        createdBy: user._id,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });

      const totalBillKapat = billKapatRecords.reduce((total, record) => total + record.rate, 0);

      // Calculate net payment
      const netPayment = Math.floor(totalRakkam - totalKapatRateMultiplybyTotalLiter - totalBillKapat);

      // Add results to array
      results.push({
        registerNo: user.registerNo,
        user: user.name,
        totalLiters,
        totalRakkam,
        totalKapatRateMultiplybyTotalLiter, // This value remains unchanged
        totalBillKapat,
        netPayment
      });
    }

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Error generating bills:", error);
    return NextResponse.json({ error: "Failed to generate bills" }, { status: 500 });
  }
}
