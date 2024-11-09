import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Order from "@/models/userOrders";

connect();

export async function GET(request, {params}){
    const { searchParams } = new URL(request.url);
    const startDate = new Date(searchParams.get('startDate'));
    const endDate = new Date(searchParams.get('endDate'));

      // Set endDate to the end of the selected day
    endDate.setHours(23, 59, 59, 999);

    try {
        const userOrder = await Order.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('createdBy', 'registerNo name');

        console.log(userOrder);

        return
        
    } catch (error) {
        
    }


}