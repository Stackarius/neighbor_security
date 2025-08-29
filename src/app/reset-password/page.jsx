"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

function ResetPasswordContent() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("access_token");

    async function handleReset(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser({ password });
            if (error) {
                setMessage(error.message);
            } else {
                setMessage("Password updated! Redirecting...");
                setTimeout(() => router.push("/login"), 2000);
            }
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative w-full min-h-screen bg-[#0B0F34] flex flex-col overflow-hidden">
            {/* Header */}
            <Header />

            <div className=" mt-10 md:mt-20 flex flex-1 flex-col md:flex-row items-center justify-center px-4 md:px-16 py-12 gap-12">
                {/* Form Section */}
                <div className="w-full max-w-md">
                    <form
                        onSubmit={handleReset}
                        className="flex flex-col mt-10 md:mt-0 gap-4 bg-black/60 backdrop-blur-md p-8 rounded-2xl shadow-xl text-white"
                    >
                        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>

                        <div className="flex flex-col">
                            <label className="font-medium mb-1">New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="p-3 rounded-lg border border-gray-600 bg-black/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-semibold transition-all duration-200"
                        >
                            {loading ? "Please wait..." : "Update Password"}
                        </button>

                        {message && <p className="text-center text-white/70 mt-2">{message}</p>}
                    </form>
                </div>

                {/* Right Side Illustration */}
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
