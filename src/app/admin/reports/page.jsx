"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import ReportForm from "@/component/ReportForm";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import FormattedText from "@/component/FormattedText";
import { Send } from "lucide-react";
import DeleteButton from "@/component/DeleteButton";
import { deleteReport } from "@/app/actions/adminActions";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const fetchReports = async () => {
    try {
      const user = await getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_role")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      setUserRole(profile.user_role);

      const { data: reportsData, error } = await supabase
        .from("reports")
        .select("id, title, description, created_at, user_id")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(reportsData || []);
    } catch (error) {
      toast.error("Error fetching reports: " + error.message);
    }
  };
  
  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="relative p-6 md:px-12">
      {showForm && (
      <div className="absolute flex items-center justify-center h-full  bg-black/80 p-5 rounded-lg shadow-lg">
        <div>
          <FaTimes className="absolute top-2 right-2 text-white cursor-pointer" onClick={() => setShowForm(false)} />
          {showForm && <ReportForm onClose={() => setShowForm(false)} />}
        </div>
      </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-blue-800">
        All Reports 
      </h2>
      <button className="bg-blue-600 text-white p-2 mb-3 rounded hover:bg-blue-700 transition"
      onClick={() => setShowForm(!showForm)}>
        Add Report
      </button>
      {reports.length === 0 ? (
        <p className="text-gray-600">No reports submitted yet.</p>
      ) : (
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
                        try {
                          // Delete the report
                          const { error } = await supabase
                            .from("reports")
                            .delete()
                            .eq("id", report.id).select()

                          if (error) {
                            console.log(error)
                          }
                          toast.success("Report deleted successfully!");
                          fetchReports()
                        } catch (error) {
                          console.error("Error checking report ownership:", error);
                          toast.error("Failed to check report ownership.");
                          return;
                        }
                        
                      }
                    } />
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}
