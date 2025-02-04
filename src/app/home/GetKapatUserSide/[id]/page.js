import React from 'react'

const page = () => {
  return (
    <div>
      hello damy
    </div>
  )
}

export default page


// ✅ Function to Send SMS using Twilio
// const SendSMS = async (to, message) => {
//     try {
//       console.log("Sending SMS to:", to); // Debugging log
  
//       const response = await client.messages.create({
//         body: message,
//         from: twilioPhoneNumber, // Your Twilio phone number
//         to: to, // User's mobile number
//       });
  
//       console.log("Twilio Response:", response); // Debugging log
  
//       return { success: true, sid: response.sid };
//     } catch (error) {
//       console.error("Error sending SMS:", error);
//       return { success: false, error: error.message };
//     }
//   };
  
//   // ✅ Call `SendSMS` inside POST function
//   if (user.phone) {
//     console.log("User Phone Number:", user.phone); // Debugging log
  
//     const smsMessage = `Dear ${user.name},\nYour milk entry for ${date}:\nSession: ${session}\nLiters: ${liter}\nFat: ${fat}\nSNF: ${snf}\nRate: ₹${dar}/L\nTotal Amount: ₹${rakkam}\nThank you!`;
//     console.log("SMS Message:", smsMessage); // Debugging log
  
//     const smsResponse = await SendSMS(user.phone, smsMessage);
//     console.log("SMS Response:", smsResponse); // Debugging log
  
//     if (!smsResponse.success) {
//       console.error("SMS failed:", smsResponse.error);
//     }
//   } else {
//     console.warn(`User ${user.name} does not have a mobile number.`);
//   }
  

// import { NextResponse } from 'next/server';
// import { connect } from '@/dbconfig/dbconfig';
// import BillKapat from '@/models/BillKapat';
// import Order from '@/models/userOrders';
// import Advance from '@/models/advanceModel';
// import { getDataFromToken } from '@/helpers/getDataFromToken';
// import User from '@/models/userModel';
// import twilio from 'twilio';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const client = twilio(accountSid, authToken);

// connect();

// const sendSMS = async (to, message) => {
//     try {
//         if (!to.startsWith("+91")) {
//             to = "+91" + to; // Add country code if missing
//         }
//         console.log("Sending SMS to:", to);

//         const response = await client.messages.create({
//             body: message,
//             from: twilioPhoneNumber,
//             to: to,
//         });

//         console.log("SMS sent successfully:", response);

//         return { success: true, sid: response.sid };
//     } catch (error) {
//         console.error("Error sending SMS:", error);
//         return { success: false, error: error.message };
//     }
// };

// // Utility function to validate date format (YYYY-MM-DD)
// const isValidDate = (dateString) => {
//     const date = new Date(dateString);
//     return !isNaN(date.getTime()); // Checks if it's a valid date
// };

// export async function POST(request) {
//     try {
//         const ownerId = await getDataFromToken(request);
//         const reqBody = await request.json();

//         const { registerNo, date, username, milktype, orderData, rate, startDate, endDate } = reqBody;

//         // Validate required fields
//         if (!registerNo || !date || !username || !milktype || !orderData || !rate || !startDate || !endDate) {
//             return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//         }

//         // Validate date formats
//         if (!isValidDate(date) || !isValidDate(startDate) || !isValidDate(endDate)) {
//             return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
//         }

//         // Convert date strings to Date objects
//         const dateParsed = new Date(date);
//         const startDateParsed = new Date(startDate);
//         const endDateParsed = new Date(endDate);

//         // Validate rate data type
//         if (isNaN(rate)) {
//             return NextResponse.json({ error: "Rate must be a valid number" }, { status: 400 });
//         }

//         const rateParsed = parseFloat(rate);

//         // Fetch user
//         const user = await User.findOne({ registerNo, createdBy: ownerId });
//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         // Fetch user orders in date range
//         const userOrders = await Order.find({
//             createdBy: user._id,
//             date: { $gte: startDateParsed, $lte: endDateParsed },
//         });

//         const totalRakkam = userOrders.reduce((total, order) => total + (parseFloat(order.rakkam) || 0), 0);

//         // Fetch Bill Kapat records
//         const billKapatRecords = await BillKapat.find({
//             createdBy: user._id,
//             date: { $gte: startDateParsed, $lte: endDateParsed },
//         });

//         const totalBillKapat = billKapatRecords.reduce((total, order) => total + (parseFloat(order.rate) || 0), 0);

//         // Fetch Advance records
//         const advanceRecords = await Advance.find({
//             createdBy: user._id,
//             date: { $gte: startDateParsed, $lte: endDateParsed },
//         });

//         const totalAdvance = advanceRecords.reduce((total, order) => total + (parseFloat(order.amount) || 0), 0);

//         // Calculate remaining balance
//         const remaining = Math.floor(totalRakkam - totalBillKapat - totalAdvance);

//         // Save new BillKapat record
//         const newBillKapat = new BillKapat({
//             registerNo,
//             date: dateParsed,
//             username,
//             milktype,
//             orderData,
//             rate: rateParsed,
//             createdBy: user._id,
//         });

//         const savedBillKapat = await newBillKapat.save();

//         // Update user's bill records
//         user.userBillKapat.push(newBillKapat._id);
//         await user.save();

//         // Send SMS if user has phone number
//         if (user.phone) {
//             const smsMessage = `उत्पादक ${user.name}, ${milktype} दिनांक ${date} बिल कपात रक्कम ${rateParsed} रु. \n शिल्लक रक्कम ${remaining} रु.`;
//             const smsResponse = await sendSMS(user.phone, smsMessage);

//             if (!smsResponse.success) {
//                 console.error("Failed to send SMS:", smsResponse.error);
//                 return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
//             } else {
//                 console.log("SMS sent successfully:", smsResponse);
//             }
//         }

//         return NextResponse.json({
//             message: "Order record added successfully",
//             data: savedBillKapat,
//         });

//     } catch (error) {
//         console.error("Error adding Order record:", error);
//         return NextResponse.json({ error: "Failed to add Order record" }, { status: 500 });
//     }
// }


// const SendSMS = async (to, message) => {
//     try {
//       // Ensure the phone number is in E.164 format
//       if (!to.startsWith("+91")) {
//         to = "+91" + to; // Add country code if missing
//       }
  
//       console.log("Sending SMS to:", to); // Debugging log
  
//       const response = await client.messages.create({
//         body: message,
//         from: process.env.TWILIO_PHONE_NUMBER, // Twilio Number from .env
//         to: to,
//       });
  
//       console.log("Twilio Response:", response); // Debugging log
  
//       return { success: true, sid: response.sid };
//     } catch (error) {
//       console.error("Error sending SMS:", error);
//       return { success: false, error: error.message };
//     }
//   };
  
//   // ✅ Call `SendSMS` inside POST function
//   if (user.phone) {
//     console.log("User Phone Number (Before Formatting):", user.phone); // Debugging log
  
//     const smsMessage = `Dear ${user.name},\nYour milk entry for ${date}:\nSession: ${session}\nLiters: ${liter}\nFat: ${fat}\nSNF: ${snf}\nRate: ₹${dar}/L\nTotal Amount: ₹${rakkam}\nThank you!`;
//     console.log("SMS Message:", smsMessage); // Debugging log
  
//     const smsResponse = await SendSMS(user.phone, smsMessage);
//     console.log("SMS Response:", smsResponse); // Debugging log
  
//     if (!smsResponse.success) {
//       console.error("SMS failed:", smsResponse.error);
//     }
//   } else {
//     console.warn(`User ${user.name} does not have a mobile number.`);
//   }
  