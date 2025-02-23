import { NextResponse } from "next/server";
import BillKapat from "@/models/BillKapat";
import { connect } from "@/dbconfig/dbconfig";

connect();

export async function PUT(request) {
    try {
        const { recordId, rate } = await request.json();

        if (!recordId || isNaN(rate)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        await BillKapat.updateOne({ _id: recordId }, { $set: { rate: parseFloat(rate) } });

        return NextResponse.json({ message: "Updated successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update record", details: error.message }, { status: 500 });
    }
}
