import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

let isConnected = false; // Track the connection status

export async function connect() {
  if (isConnected) {
    console.log("Mongoose is already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true; // Set connection status to true after a successful connection
    console.log("Mongoose connected successfully.");

  } catch (error) {
    console.error("MongoDB connection error. Ensure the database is running.", error);
  }
}

// Set up connection listeners (only once)
const connection = mongoose.connection;
connection.on('connected', () => {
  console.log("Mongoose connected success...");
});
connection.on('error', (err) => {
  console.error("MongoDB connection error. Please ensure DB is running. ", err);
});
