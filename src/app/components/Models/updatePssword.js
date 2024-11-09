"use server"
import { connect } from "@/dbconfig/dbconfig";
import Owner from "@/models/ownerModel";
import bcryptjs from "bcryptjs";

export async function updatePassword({ newPassword, token }) {
    console.log("New Password:", newPassword);
    console.log("Token:", token);

    await connect();

    try {
        // Find the owner by token and ensure the token is not expired
        const owner = await Owner.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Ensure the token is not expired
        });

        if (!owner) {
            throw new Error("Invalid or expired token");
        }

        // Generate the salt and hash the new password
        const salt = await bcryptjs.genSalt(10);
        const passwordHashed = await bcryptjs.hash(newPassword, salt);

        // Update the password in the database and clear the token
        await Owner.findOneAndUpdate(
            { resetPasswordToken: token },
            { 
                password: passwordHashed,
                resetPasswordToken: null, // Clear the token after use
                resetPasswordExpires: null // Clear the token expiry
            }
        );

        return { success: true }; // Indicate success
    } catch (error) {
        console.log("An error occurred during password update:", error.message);
        return { success: false, message: error.message }; // Indicate failure
    }
}
