import Owner from "@/models/ownerModel";
import OwnerMilk from "@/models/MakeMilk";
import OnwerKapat from "@/models/OwnerKapat";
import OwnerKapatOption from "@/models/AddKapatOption";
import Sangh from "@/models/SanghModel";
import { NextResponse } from "next/server";
import ExtraRate from '@/models/ExtraRateModel'; // Adjust the path if necessary
import { getDataFromToken } from "@/helpers/getSanghFormToken";


export async function POST(request) {
  try {
    const SanghId = await getDataFromToken(request);
    const { startDate, endDate } = await request.json();

    const sangh = await Sangh.findById(SanghId);
    if (!sangh) {
      return NextResponse.json({ error: "Sangh not found" }, { status: 404 });
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    // Convert startDate and endDate to Date objects and log
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Retrieve owners for the Sangh
    const owners = await Owner.find({ sangh: SanghId });

    // Get Sthir Kapat records
    const sthirkapatRecords = await OwnerKapatOption.find({
      createdBy: SanghId,
      KapatType: "Sthir Kapat",
    });

    // Calculate total Kapat rate
    const totalKapatRate = sthirkapatRecords.reduce(
      (total, record) => total + (record.kapatRate || 0),
      0
    );
    const formattedTotalKapatRate = parseFloat(totalKapatRate.toFixed(1)); // Round to 1 decimal place

    const results = [];

    // Loop through owners to calculate milk details and payments
    for (const owner of owners) {
      const ownerMilk = await OwnerMilk.find({
        createdBy: owner._id,
        date: { $gte: startDateObj, $lte: endDateObj },
      });

      // Calculate total liters and total rakkam
      const totalLiters = Math.floor(
        ownerMilk.reduce((total, record) => total + (record.milkLiter || 0), 0)
      );

      // buffelow total liters and total rakkam
      const buffOwnerMilk = await OwnerMilk.find({
        createdBy: owner._id,
        date: { $gte: startDateObj, $lte: endDateObj },
        milkType: "buff",
      })

      const buffTotalLiters = Math.floor(
        buffOwnerMilk.reduce((total, record) => total + (record.milkLiter || 0), 0)
      );

      const buffTotalRakkam = Math.floor(
        buffOwnerMilk.reduce((total, record) => total + (record.amount || 0), 0)
      );

      // cow total liters and total rakkam
      const cowOwnerMilk = await OwnerMilk.find({
        createdBy: owner._id,
        date: { $gte: startDateObj, $lte: endDateObj },
        milkType: "cow",
      })

      const cowTotalLiters = Math.floor(
        cowOwnerMilk.reduce((total, record) => total + (record.milkLiter || 0), 0)
      );

      const cowTotalRakkam = Math.floor(
        cowOwnerMilk.reduce((total, record) => total + (record.amount || 0), 0)
      );

      const totalRakkam = Math.floor(
        ownerMilk.reduce((total, record) => total + (record.amount || 0), 0)
      );

      const extraRates = await ExtraRate.find({ createdBy: SanghId });

      // Ensure all calculations are performed with numbers
      const BuffExtraRate = extraRates.reduce(
        (total, record) => total + Number(record.BuffRate || 0),
        0
      );
      console.log("Buff Extra Rate:", BuffExtraRate.toFixed(2));
      
      const CowExtraRate = extraRates.reduce(
        (total, record) => total + Number(record.CowRate || 0),
        0
      );
      console.log("Cow Extra Rate:", CowExtraRate.toFixed(2));
      
      // Calculate total extra rate
      const totalExtraRate = (
        BuffExtraRate + CowExtraRate * totalLiters
      ).toFixed(2);

      console.log("Total Extra Rate:", totalExtraRate);

      const totalBuffExtraRate = (BuffExtraRate * buffTotalLiters).toFixed(2);
      console.log("total Buff Extra Rate: ", totalBuffExtraRate);

      const totalCowExtraRate = (CowExtraRate * cowTotalLiters).toFixed(2);
      console.log("total Cow Extra Rate: ", totalCowExtraRate);
      
      
      

      // Calculate total Kapat rate multiplied by total liters
      const totalKapatRateMultiplybyTotalLiter =
        totalLiters * formattedTotalKapatRate;
      const formatedResult = parseFloat(
        totalKapatRateMultiplybyTotalLiter.toFixed(1)
      );

      const ownerKapat = await OnwerKapat.find({
        createdBy: SanghId,
        registerNo: owner.registerNo,
        date: { $gte: startDateObj, $lte: endDateObj },
      });

      console.log("Owner Kapat:", ownerKapat);
      
      
      

      // Calculate total Kapat for the owner
      const totalKapat = ownerKapat.reduce(
        (total, record) => total + (record.rate || 0),
        0
      );

      // Calculate net payment after subtracting Kapat rate
      const netPayment = Math.floor(
        totalRakkam - totalKapatRateMultiplybyTotalLiter - totalKapat
      );

      // Push the result to the final results array
      results.push({
        registerNo: owner.registerNo,
        ownerName: owner.ownerName,
        totalLiters,
        buffTotalLiters,
        buffTotalRakkam,
        cowTotalLiters,
        cowTotalRakkam,
        totalBuffExtraRate,
        totalCowExtraRate,
        totalRakkam,
        totalKapatRateMultiplybyTotalLiter,
        formatedResult,
        totalExtraRate,
        totalKapat,
        netPayment,
      });
    }

    // Sort results by total liters in descending order
    results.sort((a, b) => b.totalLiters - a.totalLiters);

    // Return the results
    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


