import User from "@/models/userModel";
import Milk from "@/models/MilkModel";
import BillKapat from "@/models/BillKapat";
import Sthirkapat from '@/models/sthirkapat';
import Owner from '@/models/ownerModel';
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

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 });
    }

    const users = await User.find({ createdBy: ownerId }).populate('selectedKapat');

    const results = [];

    for (const user of users) {
      const milkRecords = await Milk.find({
        createdBy: user._id,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });

      const totalLiters = milkRecords.reduce((total, record) => total + record.liter, 0).toFixed(1);
      
      const totalBuffLiter = milkRecords.filter(record => record.milk === "म्हैस ").reduce((total, record) => total + record.liter, 0);
      const totalCowLiter = milkRecords.filter(record => record.milk === "गाय ").reduce((total, record) => total + record.liter, 0);
      const totalRakkam = milkRecords.reduce((total, record) => total + record.rakkam, 0).toFixed(1);
      const totalBuffRakkam = milkRecords.filter(record => record.milk === "म्हैस ").reduce((total, record) => total + record.rakkam, 0);
      const totalCowRakkam = milkRecords.filter(record => record.milk === "गाय ").reduce((total, record) => total + record.rakkam, 0);

      const totalKapatRate = user.selectedKapat.reduce((total, kapat) => total + kapat.kapatRate, 0);
      const totalKapatRateMultiplybyTotalLiter = parseFloat((totalLiters * totalKapatRate).toFixed(1));

      const billKapatRecords = await BillKapat.find({
        createdBy: user._id,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });

      const totalBillKapat = billKapatRecords.reduce((total, record) => total + record.rate, 0);
      const totalBuffBillKapat = billKapatRecords.filter(record => record.milktype === "म्हैस ").reduce((total, record) => total + record.rate, 0);
      const totalCowBillKapat = billKapatRecords.filter(record => record.milktype === "गाय ").reduce((total, record) => total + record.rate, 0);

      const netPayment = (totalRakkam - totalKapatRateMultiplybyTotalLiter - totalBillKapat).toFixed(1);

      const totalKapat = (totalKapatRateMultiplybyTotalLiter + totalBillKapat).toFixed(1);

      results.push({
        registerNo: user.registerNo,
        user: user.name,
        usId: user._id,
        totalLiters,
        totalBuffLiter,
        totalCowLiter,
        totalBuffRakkam,
        totalCowRakkam,
        totalBuffBillKapat,
        totalCowBillKapat,
        totalKapat,
        totalRakkam,
        totalKapatRateMultiplybyTotalLiter,
        totalBillKapat,
        netPayment
      });
    }

    results.sort((a, b) => a.registerNo - b.registerNo);

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Error generating bills:", error);
    return NextResponse.json({ error: "Failed to generate bills" }, { status: 500 });
  }
}
