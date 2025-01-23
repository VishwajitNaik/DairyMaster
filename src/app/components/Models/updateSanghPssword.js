"use server"
import { connect } from "@/dbconfig/dbconfig";
import Sangh from "@/models/SanghModel";
import bcryptjs from "bcryptjs";

export async function updateSanghPssword({newPassword, token}) {
    console.log("New Password:", newPassword);
    console.log("Token for reset Password:", token);
    await connect();

    try {
        const sangh = await Sangh.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Ensure the token is not expired
        });

        if (!sangh) {
            throw new Error("Invalid or expired token");
        }

        const salt = await bcryptjs.genSalt(10);
        const passwordHashed = await bcryptjs.hash(newPassword, salt);

        await Sangh.findOneAndUpdate(
            { resetPasswordToken: token },
            {
                password: passwordHashed,
                resetPasswordToken: null, // Clear the token after use
                resetPasswordExpires: null // Clear the token expiry
            }
        );

        return { success: true };
    } catch (error) {
        console.log("Error updating sangh password:", error);
        return { success: false, error: error.message };
        
    }
    
}
