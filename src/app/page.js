"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import { FaClock, FaWpforms } from "react-icons/fa";
import { Verified, UserLock, User, LucideUserLock } from "lucide-react";

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
  
  const heroCards = [
    {
      illustration: <FaClock size={50} className="text-blue-500"/>,
      heading: "Fast Reporting",
      desc: " quickly alert your community about suspicious events.",
    },
    {
      illustration: <Verified size={50} className="text-blue-500"/>,
      heading: "Verified Alerts",
      desc: " quickly alert your community about suspicious events.",
    },
    {
      illustration: <UserLock size={50} className="text-blue-500"/>,
      heading: "Privacy Protected",
      desc: " quickly alert your community about suspicious events.",
    },
  ];
  const workCards = [
    {
      illustration: <User size={50} className="text-blue-500" />,
      heading: "Report / Login ",
      desc: "Create a secure account to quickly alert your community about suspicious events.",
    },
    {
      illustration: <FaWpforms size={50} className="text-blue-500" />,
      heading: "Report Issues",
      desc: " Use the form to file incidents. Get notified on verified incidents nearby.",
    },
    {
      illustration: <LucideUserLock size={50} className="text-blue-500" />,
      heading: "Stay Safe",
      desc: "Monitor updates from your dashboard. Your identity remains private unless required by law.",
    },
  ];

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
              className="text-lg mx-auto md:text-xl mb-6 max-w-xl"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroCards.map((card, i) => (
            <motion.div
              key={i}
              className=" shadow-md p-4 py-6 rounded w-full bg-gray-100 transiton-all duration-300 ease-in-out"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex flex-col items-center" key={i}>
                <span>{card.illustration}</span>
                <h2 className="font-bold mt-4">{card.heading}</h2>
                <p className="text-sm/6">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/*  */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-8 px-4 max-w-4xl mx-auto text-center"
      >
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-700 mb-6">
          Our platform empowers residents to report suspicious activity or
          emergencies directly to community heads. Stay informed, stay
          protected.
        </p>
        <div className="flex flex-col sm:flex-row justify-around mt-8 gap-12">
          {workCards.map(
            (card, i) => (
              <motion.div
                key={i}
                className="bg-gray-100 shadow-md p-4 py-6 rounded w-full sm:w-1/3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex flex-col items-center" key={i}>
                  <span>{card.illustration}</span>
                  <h2 className="font-bold mt-4 ">{card.heading}</h2>
                  <p className="text-sm/6">{card.desc}</p>
                </div>
              </motion.div>
            )
          )}
        </div>
      </motion.section>

      {/*  */}

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6 text-center mt-12">
        <p>
          &copy; {new Date().getFullYear()} Neighbourhood Security Watch. All
          rights reserved.
        </p>
      </footer>
    </main>
  );
}
