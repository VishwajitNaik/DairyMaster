import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import VikriMilk from "@/models/vikriMilk";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || searchParams.get('singleMilk'); // Fallback to 'singleMilk'
  const startDate = new Date(searchParams.get('startDate'));
  const endDate = new Date(searchParams.get('endDate'));

  console.log("userId", userId);
  console.log("searchParams", searchParams);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  try {
      const OwnerId = getDataFromToken(request);
      let milkRecords;

      console.log("OwnerId", OwnerId);

      if (userId || OwnerId) {
          milkRecords = await VikriMilk.find({
              createdBy: userId || OwnerId, 
              date: {
                  $gte: startDate,
                  $lte: endDate,
              },
          }).sort({ date: 1 });
      } else {
          milkRecords = await VikriMilk.find({
              createdBy: userId || OwnerId,
              date: {
                  $gte: startDate,
                  $lte: endDate,
              },
          }).sort({ date: 1 });
      }

      const totalLiter = milkRecords.reduce((total, record) => total + record.liter, 0).toFixed(1);
      const totalRakkam = milkRecords.reduce((total, record) => total + record.rakkam, 0).toFixed(1);
      console.log("totalRakkam", totalRakkam);
      console.log("totalLiter", totalLiter);


      return NextResponse.json({ 
          message: "Milk records fetched successfully", 
          data: milkRecords,
          totalLiter,
          totalRakkam  
      }, { status: 200 });

  } catch (error) {
      console.error("Error fetching milk records:", error);
      return NextResponse.json({ error: "Failed to fetch milk records" }, { status: 500 });
  }
}
