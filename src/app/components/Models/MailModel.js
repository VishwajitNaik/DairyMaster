"use server"
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function mailAction({ email }) {
    await connect();
    try {
        const owner = await Owner.findOne({ email });

        if (!owner) {
            console.log("User does not exist", { status: 400 });
            return; // Exit the function if the user doesn't exist
        }

        // Generate a secure random token
        const token = crypto.randomBytes(32).toString("hex");

        // Set token expiry time (e.g., 1 hour from now)
        const tokenExpiry = Date.now() + 3600000; // 1 hour in milliseconds

        // Configure the email transport
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "3d61e4de26cbc2",
                pass: "1cdba0437688c7",
            },
        });

        // Email content
        const htmlBody = `Click here to <a href="http://localhost:3000/home/reset-password/${token}">Reset Password</a>`;
        const mailOptions = {
            from: 'vishwajitnaik1999@gmail.com',
            to: email,
            subject: "Reset Password",
            text: "hello world",
            html: htmlBody,
        };

        // Send the email
        await transport.sendMail(mailOptions);

        console.log("Generated token:", token);
        console.log("Email:", email);

        // Save the token and expiry time in the database
        await Owner.findOneAndUpdate(
            { email },
            {
                $set: {
                  resetPasswordToken: token,
                  resetPasswordExpires: new Date(tokenExpiry), // Save the expiry time
                },
            }
        );

    } catch (error) {
        console.log("An error occurred:", error.message);
    }
}
