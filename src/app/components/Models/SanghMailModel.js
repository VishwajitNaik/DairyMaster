"use server"
import { connect } from "@/dbconfig/dbconfig";
import Sangh from "@/models/SanghModel"; 
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function sendMailSangh({ email }) {
    await connect();
    console.log("Database connected");
    try {
        const sangh = await Sangh.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

        if (!sangh) {
            console.log("User does't exist", { status: 400 });
            return; // Exit the function if the user doesn't exist
        }

        console.log("Sangh email:", email);

        // Generate a secure random token
        const token = crypto.randomBytes(32).toString("hex");

        // Set token expiry time (e.g., 1 hour from now)
        const tokenExpiry = Date.now() + 3600000; // 1 hour in milliseconds

        // configure the email transport
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "3d61e4de26cbc2",
                pass: "1cdba0437688c7",
            },
        });

        // Email content
        const htmlBody = `Click here to <a href="http://localhost:3000/home/AllDairies/reset-password/${token}">Reset Password</a>`;
        const mailOptions = {
            from: 'vishwajitnaik1999@gmail.com',
            to: email,
            subject: 'Reset Password',
            html: htmlBody
        };

        // Send the email
        await transport.sendMail(mailOptions);
        console.log("Email sent successfully", email);

        //save the token and expiry time
        await Sangh.updateOne(
            { email: email }, 
            { $set: 
                {   resetPasswordToken: token, 
                    resetPasswordExpires: new Date(tokenExpiry)
            },
        }
    );

    } catch (error) {
        console.log("Failed to send email:", error.message);
        
    }
}