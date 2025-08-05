"use client";

import { useEffect , useState} from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../../lib/auth"; 
import { supabase } from "../../lib/supabaseClient";
import ReportForm from "../../component/ReportForm";
import ReportList from "../../component/ReportList";
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
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      if (error) {
        toast.error("Error fetching profile:", error);
        return;
      }
      setProfile(data);
    };
    checkAuth();
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <div className="flex flex-col md:p-6 max-h-screen overflow-y-auto">
        <h2 className="w-[90%] text-xl md:text-3xl font-bold mt-6 mb-3">
          Welcome to Your Dashboard
        </h2>
        <p className="text-gray-700 w-[90%] text-sm">
          Here you can monitor reports and manage your profile.
        </p>

        <div className="flex flex-wrap justify-between gap-4 mt-6 py-4 md:mr-12">
          <ReportList user={profile} />
          <ReportForm user={profile} />
        </div>
      </div>
    </motion.div>
  );
}
