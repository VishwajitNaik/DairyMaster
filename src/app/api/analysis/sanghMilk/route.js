import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import OwnerMilk from "@/models/MakeMilk";
import Owner from "@/models/ownerModel";
import * as d3 from "d3";

connect();

export async function GET(request) {
    try {
        const ownerId = await getDataFromToken(request);
        if (!ownerId) {
            return NextResponse.json({ error: "Owner ID not found in token" }, { status: 400 });
        }

        // Fetch Owner Milk Records (Sangh Data)
        const ownerMilkRecords = await OwnerMilk.find({}).populate("createdBy", "ownerName dairyName phone email");
        const morningOwnerMilk = await OwnerMilk.find({ session: "morning" });
        const eveningOwnerMilk = await OwnerMilk.find({ session: "evening" });

        // Fetch User Milk Entries
        const owner = await Owner.findById(ownerId).populate('userMilk');
        if (!owner || !owner.userMilk) {
            return NextResponse.json({ error: "No user milk records found" }, { status: 404 });
        }

        const userMorningMilks = owner.userMilk.filter(milk => milk.session === "morning");
        const userEveningMilks = owner.userMilk.filter(milk => milk.session === "evening");

        // Compute Averages for User Milk
        const avgUserMorningFat = d3.mean(userMorningMilks, d => d.fat) || 0;
        const avgUserMorningSNF = d3.mean(userMorningMilks, d => d.snf) || 0;
        const avgUserMorningRate = d3.mean(userMorningMilks, d => d.rate) || 0;
        
        const avgUserEveningFat = d3.mean(userEveningMilks, d => d.fat) || 0;
        const avgUserEveningSNF = d3.mean(userEveningMilks, d => d.snf) || 0;
        const avgUserEveningRate = d3.mean(userEveningMilks, d => d.rate) || 0;

        // Compute Averages for Owner Milk (Sangh Data)
        const avgOwnerMorningFat = d3.mean(morningOwnerMilk, d => d.fat) || 0;
        const avgOwnerMorningSNF = d3.mean(morningOwnerMilk, d => d.snf) || 0;
        const avgOwnerMorningRate = d3.mean(morningOwnerMilk, d => d.rate) || 0;

        const avgOwnerEveningFat = d3.mean(eveningOwnerMilk, d => d.fat) || 0;
        const avgOwnerEveningSNF = d3.mean(eveningOwnerMilk, d => d.snf) || 0;
        const avgOwnerEveningRate = d3.mean(eveningOwnerMilk, d => d.rate) || 0;

        // Comparison Data for Charts
        const chartData = {
            morning: {
                user: { avgFat: avgUserMorningFat, avgSNF: avgUserMorningSNF, avgRate: avgUserMorningRate },
                owner: { avgFat: avgOwnerMorningFat, avgSNF: avgOwnerMorningSNF, avgRate: avgOwnerMorningRate }
            },
            evening: {
                user: { avgFat: avgUserEveningFat, avgSNF: avgUserEveningSNF, avgRate: avgUserEveningRate },
                owner: { avgFat: avgOwnerEveningFat, avgSNF: avgOwnerEveningSNF, avgRate: avgOwnerEveningRate }
            }
        };

        return NextResponse.json({ data: ownerMilkRecords, userMilks: owner.userMilk, chartData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching milk records:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
