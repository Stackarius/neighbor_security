"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

export default function ReportList({ user }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
       toast.error("Failed to fetch reports:", error);
      } else {
        setReports(data);
      }

      setLoading(false);
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div className="bg-white p-4 rounded shadow w-full mr-auto">
      <h2 className="text-lg font-bold mb-4">Recent Reports</h2>
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports found.</p>
      ) : (
        <ul className="space-y-4">
          {reports?.map((report) => (
            <li key={report.id} className="border bg-white p-3 rounded shadow-sm">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600">{report.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                Posted on {new Date(report.created_at).toLocaleString()}
              </p>
              {report.user_id === user?.id && (
                <button className="mt-2 text-white bg-red-500 hover:bg-red-600 p-2 rounded text-md font-semibold hover:underline">
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
