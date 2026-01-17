"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { AlertCircle, Clock, Trash2 } from "lucide-react";

const SEVERITY_COLORS = {
  Critical: "border-l-4 border-red-600 bg-red-50",
  High: "border-l-4 border-orange-600 bg-orange-50",
  Medium: "border-l-4 border-yellow-600 bg-yellow-50",
  Low: "border-l-4 border-blue-600 bg-blue-50"
};

const SEVERITY_BADGES = {
  Critical: "bg-red-600 text-white",
  High: "bg-orange-600 text-white",
  Medium: "bg-yellow-600 text-white",
  Low: "bg-blue-600 text-white"
};

export default function ReportList({ user, limit = 10 }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        toast.error("Failed to fetch reports");
      } else {
        setReports(data);
      }

      setLoading(false);
    };

    fetchReports();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 text-center">No reports found yet.</p>
        </div>
      ) : (
        <ul className="space-y-3 w-full">
          {reports.map((report) => (
            <li
              key={report.id}
              className={`p-4 rounded-xl shadow-md cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${SEVERITY_COLORS[report.severity] || SEVERITY_COLORS.Low
                }`}
              onClick={() => router.push(`${pathname}/report/${report.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {report.title}
                </h3>
                {report.severity && (
                  <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${SEVERITY_BADGES[report.severity] || SEVERITY_BADGES.Low
                    }`}>
                    {report.severity}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {report.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(report.created_at).toLocaleString()}
                </div>
                <p className="text-gray-600 font-medium">{report.zone}</p>
              </div>

              {report.user_id === user?.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-2 text-white bg-red-500 hover:bg-red-600 py-2 rounded-lg text-sm font-medium transition"
                >
                  <Trash2 className="w-4 h-4" />
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