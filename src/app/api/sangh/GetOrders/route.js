import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Product from "@/models/ProductModel"

connect();

export async function GET(request) {
    try {
        // Fetch all products/orders from the database
        const orders = await Product.find({}); // Fetch only ProductName field

        // Return the list of products/orders
        return NextResponse.json({ data: orders });


    } catch (error) {
        console.error("Failed to fetch Products:", error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}