import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/ProductModel";
import Owner from "@/models/ownerModel.js";
import mongoose from "mongoose";

connect();

export async function GET(request) {
    try {
        const ownerId = await getDataFromToken(request);
        const owner = await Owner.findById(ownerId);

        if (!owner) {
            return NextResponse.json({ error: "Owner not found" }, { status: 404 });
        }
        // Convert owner.sangh to Mongoose ObjectId
        const sanghId = new mongoose.Types.ObjectId(owner.sangh); // Use 'new' here

        // Fetch all products/orders from the database
        const orders = await Product.find({ createdBy: sanghId }); // Fetch only ProductName field

        // Return the list of products/orders
        return NextResponse.json({ data: orders });


    } catch (error) {
        console.error("Failed to fetch Products:", error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}