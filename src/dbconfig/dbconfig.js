import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { connectRedis } from './redis';

// MongoDB connection
let isMongoConnected = false;

export async function connect() {
  if (isMongoConnected) {
    console.log("✅ MongoDB is already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isMongoConnected = true;
    console.log("✅ MongoDB connected successfully.");

    // Initialize Redis connection here
    connectRedis();

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

const connection = mongoose.connection;
connection.on('connected', () => console.log("✅ MongoDB connected event triggered."));
connection.on('error', (err) => console.error("❌ MongoDB connection error:", err));
