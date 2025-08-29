"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DeleteButton from "@/components/DeleteButton";
import { toast } from "react-toastify";
import { File, LayoutDashboard, Send } from "lucide-react";
import FormattedText from "@/components/FormattedText";
import ConfirmModal from "@/components/ConfirmModal";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const ref = useRef();

  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      // Fetch current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      // Check role
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

      // Fetch all users
      const { data: allUsers, error: fetchError } = await supabase
        .from("profiles")
        .select("*");

      if (fetchError) {
        console.error("Failed to fetch users:", fetchError.message);
      }
      setUsers(allUsers || []);
      setLoading(false);
    };

    fetchUsers();
    fetchReports();
  }, [router]);

  // Fetch reports
  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select(`
          id,
          title,
          description,
          created_at,
          zone,
          reporter:profiles!user_id (
            id,
            full_name,
            phone,
            email,
            img_url
          )
        `)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching reports:", error.message);
      return;
    }
    setReports(data || []);
  };

  // Delete report
  const deleteReport = async (id) => {
    const { error } = await supabase.from("reports").delete().eq("id", id);

    if (error) {
      toast.error("Error deleting report");
      return;
    }

    toast.success("Report deleted successfully!");
    fetchReports();
  };

  const origin = usePathname()

  return (
    <div className="p-3 md:px-12 md:py-6">
      <h3 className="text-2xl font-semibold flex items-center gap-2">
        <LayoutDashboard size={22} />
        Quick Overview
      </h3>

      {/* Stats */}
      {!loading ? (
        <div className="w-full">
          <div className="flex flex-wrap gap-4 my-4">
            <div className="bg-blue-600 py-4 px-4 rounded text-white font-semibold">
              <h3>Total Reports</h3>
              <p className="text-center text-lg">{reports.length}</p>
            </div>
            <div className="bg-gray-900 py-4 px-4 rounded text-white font-semibold">
              <h3>Total Users</h3>
              <p className="text-center text-lg">{users.length}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4">Loading Reports...</p>
      )}

      {/* Reports List */}
      {!loading && (
        <div className="w-full h-full mt-5 overflow-y-auto" ref={ref}>
          <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => router.push(`${origin}/reports/${report.id}`)}
                className="bg-white p-6 rounded shadow hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold my-1">{report.title}</h2>
                </div>

                <FormattedText text={report.description} />
                <div className="flex flex-col-reverse items-start gap-3 my-4">
                  {report.reporter.img_url && <img src={report.reporter.img_url} className="w-8 h-8 object-fit rounded-full" />}
                  <p className="text-sm">Location: {report.zone}</p>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-3">
                  <p className="text-sm text-gray-500">
                    {new Date(report.created_at).toLocaleDateString("en-US")}
                  </p>

                  <div className="flex gap-2 mt-2 md:mt-0">
                    {/* Send Button */}
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
                      onClick={async (e) => {
                        e.stopPropagation()
                        try {
                          const { data: residents, error: usersError } =
                            await supabase
                              .from("profiles")
                              .select("email")
                              .eq("user_role", "resident")
                              .neq("id", report.user_id);

                          if (usersError) {
                            console.error("Error fetching users:", usersError.message);
                            toast.error("Failed to fetch resident emails.");
                            return;
                          }

                          const residentsMail = residents.map((u) => u.email);

                          if (!residentsMail.length) {
                            toast.error("No valid resident emails found.");
                            return;
                          }

                          await fetch("/api/send-notification", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              to: residentsMail,
                              subject: `New report: ${report.title}`,
                              text: report.description,
                              html: `<strong>A new report has been created:</strong><br>${report.description}`,
                            }),
                          });

                          toast.success(
                            `Notifications sent to ${residentsMail.length} residents!`
                          );
                        } catch (error) {
                          console.error("Error sending notification:", error);
                          toast.error("Failed to send notifications.");
                        }
                      }}
                    >
                      <Send className="mr-1" size={15} /> Send
                    </button>

                    {/* Delete Button */}
                    <DeleteButton
                      click={(e) => {
                        e.stopPropagation()

                        setSelectedReport(report);
                        setDeleteOpen(true);
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Confirm Delete Modal */}
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
      )}
    </div>
  );
};

export default AdminDashboard;
