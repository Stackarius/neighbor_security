"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function Home() {

 const [reports, setReports] = useState([]);
 const [user, setUser] = useState(null);

 useEffect(() => {
   const fetchReportsAndUser = async () => {
     const {
       data: { user },
     } = await supabase.auth.getUser();
     setUser(user);

     const { data, error } = await supabase
       .from("reports")
       .select("*")
       .order("created_at", { ascending: false })
       .limit(3);

     if (!error) setReports(data);
   };

   fetchReportsAndUser();
 }, []);

  return (
    <main className="w-full">
      {/* Hero Section */}
      <div
        className="relative h-[80vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/hands.jpg')" }}
      >
        <div className="absolute text-center inset-0 bg-gradient-to-br from-black-400 to-gray-900 bg-opacity-10 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.section
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className=" text-white py-20 text-center"
          >
            <h1 className="text-6xl font-bold mb-4">
              Neighbourhood Security Watch
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="text-lg text-center md:text-xl mb-6 max-w-xl"
            >
              Stay alert. Stay safe. Report any suspicious activity in your
              area.
            </motion.p>
            <Link href={user ? "/dashboard" : "/login"}>
              <button className="bg-white text-blue-900 font-semibold px-6 py-2 rounded hover:bg-gray-200 transition">
                {user ? "Go to Dashboard" : "Login to Report"}
              </button>
            </Link>
          <motion.a
            href="/report"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 ml-8 hover:bg-yellow-500 text-black px-6 py-3 rounded font-semibold transition"
          >
            Report an Incident
          </motion.a>
          </motion.section>

        </div>
      </div>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-16 px-4 max-w-4xl mx-auto text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Why Use Our Platform?</h2>
        <p className="text-gray-700 mb-6">
          Our platform empowers residents to report suspicious activity or
          emergencies directly to community heads. Stay informed, stay
          protected.
        </p>
        <div className="flex flex-col sm:flex-row justify-around mt-8 gap-12">
          {["Fast Reporting", "Verified Alerts", "Privacy Protected"].map(
            (title, i) => (
              <motion.div
                key={i}
                className="bg-white shadow-md p-4 rounded w-full sm:w-1/3"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-600">
                  {title === "Fast Reporting" &&
                    "Quickly alert your community about suspicious events."}
                  {title === "Verified Alerts" &&
                    "Get notified on verified incidents nearby."}
                  {title === "Privacy Protected" &&
                    "Your identity remains private unless required by law."}
                </p>
              </motion.div>
            )
          )}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-16 px-4 text-center"
      >
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="flex flex-col sm:flex-row justify-around gap-8">
          {["Register / Login", "Report Issues", "Stay Safe"].map((step, i) => (
            <motion.div
              key={i}
              className="bg-white shadow p-4 rounded"
              whileHover={{ y: -5 }}
            >
              <h3 className="font-semibold text-lg mb-2">
                {i + 1}. {step}
              </h3>
              <p className="text-sm text-gray-700">
                {step === "Register / Login" && "Create a secure account."}
                {step === "Report Issues" && "Use the form to file incidents."}
                {step === "Stay Safe" && "Monitor updates from your dashboard."}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 text-center mt-12">
        <p>
          &copy; {new Date().getFullYear()} Neighbourhood Security Watch. All
          rights reserved.
        </p>
      </footer>
    </main>
  );
}
