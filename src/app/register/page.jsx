"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { register } from "../../lib/auth";
import Link from "next/link";
import Header from "@/components/Header";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      setLoading(true);
      await register(email, password);
      toast.success("Registration successful! Please log in to complete your profile.");
      router.push("/login");
    } catch (err) {
      toast.error("An unexpected error occurred, can't register new user");
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0B0F34] flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      <div className="flex flex-1 flex-col md:flex-row items-center justify-center px-4 md:px-16 py-12 gap-12">
        {/* Form Section */}
        <div className="w-full max-w-md">
          <form
            onSubmit={handleRegister}
            className="flex flex-col mt-10 md:mt-0 gap-4 bg-black/60 backdrop-blur-md p-8 rounded-2xl shadow-xl text-white"
          >
            <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

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

            <div className="flex flex-col">
              <label className="font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-3 rounded-lg border border-gray-600 bg-black/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="p-3 rounded-lg border border-gray-600 bg-black/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-semibold transition-all duration-200"
            >
              {loading ? "Please wait..." : "Register"}
            </button>

            <p className="text-center text-white/70 mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-yellow-400 font-semibold hover:underline">
                Login
              </Link>
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
              alt="Illustration"
              fill
              className="object-contain drop-shadow-xl"
            />
          </motion.div>
        </div>
      </div>
      <motion.div
        className="absolute inset-0 bg-[url('/grid.jpg')] bg-cover no-repeat opacity-10 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
      />
    </div>
  );
}
