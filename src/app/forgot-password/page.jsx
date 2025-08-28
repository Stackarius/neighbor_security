"use client";
import { useState } from "react";
import { sendPasswordReset } from "@/lib/auth";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await sendPasswordReset(email); // no destructuring needed
            toast.success("Check your email to proceed with reset");
        } catch (err) {
            toast.error(err.message); // catch error thrown from auth.js
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="border p-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="bg-blue-600 text-white py-2 rounded">
                    Send Reset Link
                </button>
            </form>
            {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
        </div>
    );
}
