import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import savedBill from "@/models/BillStorage";
import { getDataFromToken } from "@/helpers/getUserDataFromToken";
import User from "@/models/userModel";

connect();

export async function GET(request) {
    try {
        const userId = await getDataFromToken(request);
        console.log(userId);
        

        const user = await User.findById(userId);
        console.log(userId);
        
        if(!user){
            return NextResponse.json({error: 'user not found'}, {status: 400});
        }

        const UserBills = await savedBill.find({usId : userId});

        console.log("user Bill", UserBills);
        

        return NextResponse.json({UserBills}, {status: 200});

    } catch (error) {
        console.error("Error featching owner Bills: ", error.message);
        return NextResponse.json({error: "server Error"}, {status: 500})
    }
}