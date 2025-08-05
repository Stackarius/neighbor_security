"use client";

import { useEffect, useState } from "react";
import { getUser } from "../../lib/auth";
import { supabase } from "../../lib/supabaseClient";
import { Trash2, PencilLine, Eye } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      const user = await getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();

      setProfile(profileData);

      const { data: reportsData } = await supabase
        .from("reports")
        .select("id, title, description, created_at, user_id")
        .order("created_at", { ascending: false });

      const filtered =
        profileData.role === "admin"
          ? reportsData
          : reportsData.filter((r) => r.user_id === user.id);

      setReports(filtered);
    };

    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (!error) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Failed to delete report.");
    }
  };

  return (
    <div className="p-6 md:px-12">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">
        Neighbourhood Reports
      </h2>
      {reports.length === 0 ? (
        <p className="text-gray-600">No reports submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-4 rounded-xl shadow flex flex-col gap-2 border-l-4 border-blue-600"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-blue-700">
                  {report.title.length > 40
                    ? report.title.slice(0, 40) + "..."
                    : report.title}
                </h3>
                <span className="text-sm text-gray-400">
                  {new Date(report.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">
                {report.description.length > 100
                  ? report.description.slice(0, 100) + "..."
                  : report.description}
              </p>
              <div className="flex gap-2 mt-2">
                <button className="bg-blue-600 p-2 text-white rounded hover:bg-blue-700 transition inline-flex items-center">
                  <Eye className="h-4 w-4 mr-1" /> View
                </button>
                {report.user_id === userId && (
                  <>
                    <button className="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700 transition inline-flex items-center">
                      <PencilLine className="h-4 w-4 mr-1" /> Edit
                    </button>
                              <button
                                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition inline-flex items-center"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
