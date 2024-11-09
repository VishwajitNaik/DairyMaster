"use client"
import React, { useState } from 'react';
import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { updatePassword } from "../../../components/Models/updatePssword";

const ResetPasswordPage = ({ params }) => {
    const [newPassword, setNewPassword] = useState("");
    const [reEnterPassword, setReEnterPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Initialize router

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== reEnterPassword) {
            Toast.error("Passwords do not match! Please try again.");
            return; // Exit the function if passwords don't match
        }

        setLoading(true);
        try {
            const result = await updatePassword({ newPassword, token: params.token });
            if (result.success) {
                Toast.success("Password reset successfully!");
                router.push("/home/Signin"); // Redirect to login page
            } else {
                Toast.error("Failed to reset password. Please try again.");
            }
        } catch (error) {
            Toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-black">Reset Your Password</h1>
            <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                        New Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-black"
                    />
                    <label className="block text-gray-700 text-sm font-bold mb-2 mt-4" htmlFor="reEnterPassword">
                        Re-Enter Password
                    </label>
                    <input
                        type="password"
                        placeholder="Re-enter your new password"
                        value={reEnterPassword}
                        onChange={(e) => setReEnterPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-black"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? "Sending..." : "Submit"}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default ResetPasswordPage;
