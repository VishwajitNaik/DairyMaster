import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Milk from "@/models/MakeMilk";

connect();

export async function DELETE(request, { params }) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Milk record ID is required" }, { status: 400 });
        }

        const deletedRecord = await Milk.findByIdAndDelete(id);

        if (!deletedRecord) {
            return NextResponse.json({ error: "Milk record not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Milk record deleted successfully" }, { status: 200 });
        
} catch (error) {
    console.log("Error deleting milk record:", error);
    return NextResponse.json({ error: "Failed to delete milk record" }, { status: 500 });
    
}

}