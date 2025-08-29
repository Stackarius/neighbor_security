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
      className="min-h-screen"
    >
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <header className="mb-10 mt-10 md:mt-0">
          <h2 className="text-2xl md:text-2xl font-bold text-gray-900">
            Welcome back,{" "}
            <span className="text-blue-600">
              {profile?.full_name || "User"}
            </span>
          </h2>
          <p className="text-gray-600 mt-2">
            Monitor reports, track updates, and manage your neighborhood safety
            — all from your dashboard.
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reports List */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="lg:col-span-2 md:p-3"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Reports
            </h3>
            <ReportList user={profile} />
          </motion.div>

          {/* Report Form */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white shadow-md rounded md:p-3 border border-gray-100"
          >
            <h3 className="text-lg text-center font-semibold text-gray-800 my-4">
              Submit a Report
            </h3>
            <ReportForm user={profile} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
