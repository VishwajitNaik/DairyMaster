// Backend: api/domyRoute.js
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import Domys from "@/models/DomyModel";
import Redis from 'ioredis';

const redis = new Redis();
connect();

export async function POST(req) {
    try {
        const OwnerId = await getDataFromToken(req);

        if (!OwnerId) {
            return NextResponse.json({ error: 'Invalid or missing token' }, { status: 401 });
        }

        const reqBody = await req.json();
        const { domy } = reqBody;

        if (domy == null || domy === "") {  
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const domyData = { Domy: parseFloat(domy), createdBy: OwnerId };

        // Store data in Redis
        await redis.lpush('domyDataQueue', JSON.stringify(domyData));

        return NextResponse.json({ message: "Domy added to queue successfully" });

    } catch (error) {
        console.error("Error adding Domy to queue:", error);
        return NextResponse.json({ error: "Error adding Domy" }, { status: 500 });
    }
}

// Bulk insertion from Redis to MongoDB
async function bulkInsertFromRedis() {
    const data = [];
    let item;
    while ((item = await redis.rpop('domyDataQueue'))) {
        const parsedItem = JSON.parse(item);
        if (parsedItem.Domy != null) {
            data.push(parsedItem);
        }
    }

    if (data.length > 0) {
        await Domys.insertMany(data);
        console.log('Bulk insert completed');
    }
}

setInterval(bulkInsertFromRedis, 60000); // Run every minute
