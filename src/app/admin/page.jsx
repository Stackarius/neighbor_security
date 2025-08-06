"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DeleteButton from "@/component/DeleteButton";
import { toast } from "react-toastify";
import { LayoutDashboard, Send } from "lucide-react";
import FormattedText from "@/component/FormattedText";


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Delete report
  async function deleteReport(id) { 
    const { error } = await supabase.from("reports").delete().eq("id", id).single();
    if (error) {
      toast.error("Error deleting report: " + error.message);
      return;
    }
    fetchReports();
    console.log(id)
    toast.success("Report deleted successfully!");
  }

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      // Fetch the current user first
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      // Get user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_role")
        .eq("id", user.id)
        .single();

      if (profileError || profile.user_role !== "admin") {
        toast.error("UNAUTHORIZED USERS DO NOT HAVE ACCESS");
        router.replace("/login");
        return;
      }

      //  Now fetch all users (residents + admins)
      const { data: allUsers, error: fetchError } = await supabase
        .from("profiles")
        .select("*");

      if (fetchError) {
        console.error("Failed to fetch users:", fetchError.message);
      }
      setUsers(allUsers);
      setLoading(false);
    };

    fetchUsers();
    fetchReports();
  }, [router]);

  // Fetch reports from supabase

  const fetchReports = async () => {
    const { data, error } = await supabase.from("reports").select("*").order("created_at", { ascending: false }).limit(10);
    if (error) {
      return error.message;
    }
    setReports(data);
  };

  return (
    <div className="p-6 md:px-12 md:py-6">
      {!loading ? (
        <div className="w-full">
          <h3 className="text-2xl font-semibold">
            <LayoutDashboard className="inline mr-2" />
            Quick Overview
          </h3>
          {/*  reports card */}
          <div className="flex flex-wrap gap-4 my-4">
            <div className="bg-blue-600 py-4 px-4 w-fit rounded text-white font-semibold">
              <h3>Total reports</h3>
              <p className="text-center font-semibold">{reports.length}</p>
            </div>
            <div className="bg-gray-900 py-4 px-4 w-fit rounded text-white font-semibold">
              <h3>Total Users</h3>
              <p className="text-center font-semibold">{users.length}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading Reports</p>
      )}
      {!loading &&(

        <div className="w-full h-full mt-5 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded shadow mb-4 hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="font-semibold my-1">{report.title}</h2>
                <FormattedText text={report.description} />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {new Date(report.created_at).toLocaleDateString("en-US")}
                  </p>
                  <div className="flex justify-end mt-2 gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                      onClick={async () => {
                        try {
                          // Fetch resident emails from Supabase
                          const { data: users, error: usersError } = await supabase
                            .from("profiles")
                            .select("email")
                            .eq("user_role", "resident")
                            .neq("id", report.user_id);

                          if (usersError) {
                            console.error("Error fetching users:", usersError.message);
                            toast.error("Failed to fetch resident emails.");
                            return;
                          }
                          // Parse emails, handling potential stringified arrays
                          const residentsMail = users.map((user) => user.email)

                          if (!residentsMail.length) {
                            toast.error("No valid resident emails found.");
                            return;
                          }
                          // Send notification with emails as an array
                          await fetch("/api/send-notification", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              to: residentsMail, // array of emails
                              subject: `New report: ${report.title}`,
                              text: report.description,
                              html: `<strong>A new report has been created:</strong><br>${report.description}`,
                            }),
                          });


                          toast.success(`Notifications sent successfully to ${residentsMail.length} residents!`);
                        } catch (error) {
                          console.error("Error sending notification:", error);
                          toast.error("Failed to send notifications.");
                        }
                      }}
                    ><Send className="inline mr-1" />Send</button>
                    <DeleteButton click={
                      async () => {
                        if (confirm("Are you sure you want to delete this report?")) {
                          await deleteReport(report.id);
                        }
                      }

                    }/>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
