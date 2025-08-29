"use client";

import { useState } from "react";
import { sendPasswordReset } from "@/lib/auth";
import { toast } from "react-toastify";
import Header from "@/components/Header";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            await sendPasswordReset(email);
            toast.success("Check your email to proceed with reset");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative w-full min-h-screen bg-[#0B0F34] flex flex-col overflow-hidden">
            {/* Header */}
            <Header />

            <div className="mt-10 md:mt-20 flex flex-1 flex-col md:flex-row items-center justify-center px-4 md:px-16 py-12 gap-12">
                {/* Form Section */}
                <div className="w-full max-w-md">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col mt-10 md:mt-0 gap-4 bg-black/60 backdrop-blur-md p-8 rounded-2xl shadow-xl text-white"
                    >
                        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>

                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="p-3 rounded-lg border border-gray-600 bg-black/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-semibold transition-all duration-200"
                        >
                            {loading ? "Please wait..." : "Send Reset Link"}
                        </button>

                        <p className="text-center text-white/70 mt-2">
                            Remembered your password?{" "}
                            <a href="/login" className="text-yellow-400 font-semibold hover:underline">
                                Login
                            </a>
                        </p>
                    </form>
                </div>

                {/* Right Side Image */}
                <div className="hidden md:flex flex-1 justify-center items-center">
                    <motion.div
                        className="relative w-72 h-72 md:w-96 md:h-96 mb-8 md:mb-0"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Image
                            src="/security_illustration.png"
                            alt="Security Illustration"
                            fill
                            className="object-contain drop-shadow-xl"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Subtle rotating grid background */}
            <motion.div
                className="absolute inset-0 bg-[url('/grid.jpg')] bg-cover no-repeat opacity-10 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
            />

            <Footer />
        </div>
    );
}
