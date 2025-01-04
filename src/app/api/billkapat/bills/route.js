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

    // Define variables for results
    const results = [];

    for (const user of users) {
      // Fetch milk records for the date range
      const milkRecords = await Milk.find({
        createdBy: user._id,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });

      // Calculate total liters and total rakkam
    const totalLiters = milkRecords.reduce((total, record) => total + record.liter, 0);

    // Calculate the total milk liters for buffalo ("म्हैस ")
      const totalBuffLiter = milkRecords
      .filter(record => record.milk === "म्हैस ") // Filter records for buffalo milk
      .reduce((total, record) => total + record.liter, 0); // Sum the liters

    // Calculate the total milk liters for cow ("गाय ")  
      const totalCowLiter = milkRecords
      .filter(record => record.milk === "गाय ") // Filter records for cow milk
      .reduce((total, record) => total + record.liter, 0); // Sum the liters
      const totalRakkam = Math.floor(milkRecords.reduce((total, record) => total + record.rakkam, 0));
    // calculate totatl buff Rakkam
      const totalBuffRakkam = milkRecords
      .filter(record => record.milk === "म्हैस ") // Filter records for buffalo milk
      .reduce((total, record) => total + record.rakkam, 0); // Sum the rakkam

    // calculate totatl cow Rakkam
      const totalCowRakkam = milkRecords
      .filter(record => record.milk === "गाय ") // Filter records for cow milk
      .reduce((total, record) => total + record.rakkam, 0); // Sum the rakkam

      const totalKapatRateMultiplybyTotalLiter = totalLiters * formattedTotalKapatRate;

      // Then, format the result to one decimal place
      const formattedResult = parseFloat(totalKapatRateMultiplybyTotalLiter.toFixed(1));

      // Fetch bill kapat records for the user filtered by date range
      const billKapatRecords = await BillKapat.find({
        createdBy: user._id,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });

      const totalBillKapat = billKapatRecords.reduce((total, record) => total + record.rate, 0);
      // calculate total buff bill kapat
      const totalBuffBillKapat  = billKapatRecords
      .filter(record => record.milktype === "म्हैस ") // Filter records for buffalo milk
      .reduce((total, record) => total + record.rate, 0); // Sum the rakkam

      // calculate total cow bill kapat
      const totalCowBillKapat  = billKapatRecords
      .filter(record => record.milktype === "गाय ") // Filter records for cow milk
      .reduce((total, record) => total + record.rate, 0); // Sum the rakkam
      

      // Calculate net payment
      const netPayment = Math.floor(totalRakkam - totalKapatRateMultiplybyTotalLiter - totalBillKapat);

      // Add results to array
      results.push({
        registerNo: user.registerNo,
        user: user.name,
        totalLiters,
        totalBuffLiter,
        totalCowLiter,
        totalBuffRakkam,
        totalCowRakkam,
        totalBuffBillKapat,
        totalCowBillKapat,
        totalRakkam,
        totalKapatRateMultiplybyTotalLiter, // This value remains unchanged
        totalBillKapat,
        netPayment
      });
    }

    // Sort the results by registerNo
    results.sort((a, b) => a.registerNo - b.registerNo); // Sorts in ascending order

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Error generating bills:", error);
    return NextResponse.json({ error: "Failed to generate bills" }, { status: 500 });
  }
}
