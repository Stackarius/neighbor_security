"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";

export default function ReportList({ user }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("reports")
        .select(`*`)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch reports");
      } else {
        setReports(data);
      }

      setLoading(false);
    };

    fetchReports();
  }, []);

  const origin = usePathname()

  if (loading) return <p className="text-center text-gray-500">Loading reports...</p>;

  return (
    <div className="p-2 md:p-4 w-full">
      {reports.length === 0 ? (
        <p className="text-gray-500 text-center">No reports found.</p>
      ) : (
        <ul className="grid gap-4 w-full">
          {reports.map((report) => (
            <li
              onClick={ () => router.push(`${origin}/report/${report.id}`)}
              key={report.id}
              className="bg-white p-4 rounded-2xl shadow cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                {report.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {report.description}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                🕗 {new Date(report.created_at).toLocaleString()}
              </p>

              {report.user_id === user?.id && (
                <button className="mt-3 w-full text-white bg-red-500 hover:bg-red-600 py-2 rounded-lg text-sm font-medium transition">
                  Delete (coming soon)
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
