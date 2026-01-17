"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../../lib/auth";
import { supabase } from "../../lib/supabaseClient";
import ReportForm from "../../components/ReportForm";
import ReportList from "../../components/ReportList";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        toast.error("Error fetching profile");
        return;
      }
      setProfile(data);
    };
    checkAuth();
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 mt-10 md:mt-0"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {profile?.full_name || "User"}
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Monitor reports, track updates, and manage your neighborhood safety
            — all from your dashboard.
          </p>
        </motion.header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reports List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 h-fit"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Reports
              </h2>
            </div>
            <ReportList user={profile} limit={5} />
          </motion.div>

          {/* Report Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 h-fit"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Submit a Report
              </h2>
            </div>
            <ReportForm user={profile} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}