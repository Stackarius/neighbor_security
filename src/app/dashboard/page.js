"use client";

import { useEffect , useState} from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../../lib/auth"; 
import { supabase } from "../../lib/supabaseClient";
import ReportForm from "../../component/ReportForm";
import ReportList from "../../component/ReportList";
import { toast } from "react-toastify";

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
        .eq('id', user.id)
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
    <div className="flex flex-col p-6 max-h-screen overflow-y-auto">
        <h2 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h2>
        <p className="text-gray-700">
          Here you can monitor reports and manage your profile.
        </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <ReportList user={profile} />
        <ReportForm user={profile} />
      </div>
    </div>
  );
}
