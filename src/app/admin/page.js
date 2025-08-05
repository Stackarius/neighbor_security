"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import LogoutButton from "@/component/LogoutButton";
import { motion } from "framer-motion";
import DeleteButton from "@/component/DeleteButton";
import { toast } from "react-toastify";
import { LayoutDashboard } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      } else {
        setUsers(allUsers);
      }

      setLoading(false);
    };

    fetchUsers();
    fetchReports();
  }, [router]);

  const fetchReports = async () => {
    const { data, error } = await supabase.from("reports").select("*");
    if (error) {
      return error.message;
    }
    setReports(data);
  };
  const handleDelete = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) {
      console.error("Delete failed:", error.message);
      toast.error("Failed to delete user");
    } else {
      toast.success("User deleted");
      // Refresh list
      setUsers(data);
    }
  };

  return (
    <div className="p-6">
      <header className="flex items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="ml-auto">
          <LogoutButton />
        </div>
      </header>

      {!loading ? (
        <div className="w-full">
          <h3 className="my-3 text-xl font-semibold">
            <LayoutDashboard className="inline mr-2" />
            Quick Overview
          </h3>
          {/*  reports card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-600 py-2 px-4 rounded text-white w-fit font-semibold">
              <h3>Total reports</h3>
              <p className="text-center font-semibold">{reports.length}</p>
            </div>
            {/* Emergency reports */}
            <div className="bg-red-600 py-2 px-4 rounded text-white w-fit font-semibold">
              <h3>Emergency </h3>
              <p className="text-center font-semibold">{reports.length + 4}</p>
            </div>
          </div>
          {/* show total reports */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-5"
          >
            <h3 className="text-xl mb-2">All Reports</h3>

            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-4 py-2">S/N</th>
                  <th className="text-left px-4 py-2">Title</th>
                  <th className="text-left px-4 py-2">Description</th>
                  <th className="text-left px-4 py-2">Zone</th>
                  <th className="text-left px-4 py-2">Date Created</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-t">
                    <td className="px-4 py-2">{"N/A"}</td>
                    <td className="px-4 py-2">{report.title || "N/A"}</td>
                    <td className="px-4 py-2">{report.description}</td>
                    <td className="px-4 py-2">{report.zone}</td>
                    <td className="px-4 py-2">
                      {new Date(report.created_at).toLocaleDateString("en-US")}
                    </td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded font-semibold"
                        // Send email notification to residents
                        onClick={async () => {
                          const {data: users, error: usersError} = await supabase
                            .from("profiles").select("email")
                            .eq("user_role", "resident");
                          
                          if (usersError) {
                            console.error("Error fetching users:", usersError.message);
                          }

                          const residentEmails = users
                            .map((user) => user.email).join(", ").split(",");
                          residentEmails.forEach(email => email.trim());

                          if (residentEmails.length === 0) {
                            console.warn("No valid resident emails found.");
                          }
                          console.log(`Sending email to: ${residentEmails}`);
                          for (const email of residentEmails) {
                            await fetch("/api/send-notification", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                to: `${email.trim()}`, // array of emails
                                subject: `New report: ${report.title}`,
                                text: `${report.description}`,
                                html: `<strong>A new report has been created:</strong> ${report.description}`,
                              }),
                            }); 
                          }
                        }}
                      >
                        Broadcast
                      </button>
                      <DeleteButton click={() => handleDelete(report.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      ) : (
        <p>Loading Reports</p>
      )}
      {!loading ? (
        <div className="w-full mt-5">
          <h3 className="text-xl mb-2">All Users</h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-3"
          >
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-4 py-2">S/N</th>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Role</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">{}</td>
                    <td className="px-4 py-2">{user.full_name || "N/A"}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.user_role}</td>
                    <td className="px-4 py-2">
                      <DeleteButton click={() => handleDelete(user.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      ) : (
        <p>Loading Users</p>
      )}
    </div>
  );
};

export default AdminDashboard;
