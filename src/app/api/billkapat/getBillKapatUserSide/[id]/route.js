// import { NextResponse } from "next/server";
// import { connect } from "@/dbconfig/dbconfig";
// import BillKapat from "@/models/BillKapat";
// import BillKapat from "@/models/BillKapat";

// connect();

// export async function GET(request, {params}) {
//     const { id } = params; // User ID from URL
// // 

//     try {
//         const BillKapat = await BillKapat.find({ userId: id }).populate('createdBy', 'registerNo name');

//         if (!BillKapat.length) {
//             return NextResponse.json({ message: 'No orders found for this user' });
//           }

//         return NextResponse.json({
//             message: "Bill kapat fetched success...",
//             data: BillKapat
//         })

//     } catch (error) {
//         console.error("Error fetching milk records:", error);
//         return NextResponse.json({ error: "Failed to fetch milk records" }, { status: 500 });
//       }
// }