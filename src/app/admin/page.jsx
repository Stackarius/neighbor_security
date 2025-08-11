"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DeleteButton from "@/component/DeleteButton";
import { toast } from "react-toastify";
import { File, LayoutDashboard, Send } from "lucide-react";
import FormattedText from "@/component/FormattedText";
import ConfirmModal from "@/component/ConfirmModal";
import { exportToPDF } from "@/utils/exportPDF";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const ref = useRef();

  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isSendOpen, setSendOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);


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

  const deleteReport = async (id) => {
    const { data, error } = await supabase
      .from("reports")
      .delete()
      .eq("id", id).select();
    if (error) {
      toast.error("Error deleting report")
    }
    toast.success("Report deleted successfully!");
    fetchReports();
  }

  return (
    <div className="p-6 md:px-12 md:py-6">
          <h3 className="text-2xl font-semibold">
            <LayoutDashboard className="inline mr-2" />
            Quick Overview
          </h3>
      {!loading ? (
        <div className="w-full">
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
        <p className="mt-4">Loading Reports</p>
      )}
      {!loading && (

        <div className="w-full h-full mt-5 overflow-y-auto" ref={ref}>
          <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <motion.div
                ref={ref}
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded shadow mb-4 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                <h2 className="font-semibold my-1">{report.title}</h2>
                  <button onClick={() => exportToPDF(report)}><File className="inline mr-1" /></button>

                </div>
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
                    >
                      <Send className="inline mr-1" />Send</button>                    
                    <DeleteButton click={() => {
                      setSelectedReport(report);
                      setDeleteOpen(true);
                    }} />

                    {/* Confirm Modal (place it once outside the .map loop) */}
                    <ConfirmModal
                      isOpen={isDeleteOpen}
                      onClose={() => {
                        setDeleteOpen(false);
                        setSelectedReport(null);
                      }}
                      onConfirm={() => {
                        if (selectedReport) deleteReport(selectedReport.id);
                        setDeleteOpen(false);
                        setSelectedReport(null);
                      }}
                      title="Delete Report"
                      description="Are you sure you want to delete this report?"
                    />

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
