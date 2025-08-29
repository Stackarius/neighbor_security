"use client";
import React, { useEffect, useState, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Send } from "lucide-react";
import { FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import DeleteButton from "@/components/DeleteButton";
import FormattedText from "@/components/FormattedText";
import ReportForm from "@/components/ReportForm";
import DeleteConfirmationModal from "@/components/ConfirmModal";
import { usePathname, useRouter } from "next/navigation";
import { Router } from "next/router";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const router = useRouter()

  const supabase = createClientComponentClient();

  /* Fetch reports */
  const fetchReports = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reports")
      .select("id, title, description, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports");
    } else {
      setReports(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  /** Download reports as PDF */
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const imgUrl =
      "https://res.cloudinary.com/dmucxf1kk/image/upload/v1754912521/nsw_logo_ygwbbe.png";

    doc.addImage(imgUrl, "PNG", 10, 10, 20, 20);
    doc.setFontSize(18);
    doc.text("Security Reports", 30, 20);

    autoTable(doc, {
      head: [["Title", "Description", "Date"]],
      body: reports.map((r) => [
        r.title || "Untitled",
        r.description || "",
        r.created_at ? new Date(r.created_at).toLocaleDateString() : "",
      ]),
      startY: 30,
    });

    doc.save("reports.pdf");
  };

  /** Send report to all users */
  const handleSendReport = async (report) => {
    try {
      const { data: users, error } = await supabase
        .from("profiles")
        .select("email")
        .neq("email", null);

      if (error) throw new Error(error.message);

      const emails = users.map((u) => u.email).join(",");

      const res = await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emails,
          subject: `New Report: ${report.title || "Untitled"}`,
          text: report.description,
          html: `<h2>${report.title}</h2><p>${report.description}</p>`,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      toast.success("Emails sent successfully!");
    } catch (err) {
      console.error("Error sending report:", err);
      toast.error("Failed to send emails");
    }
  };

  /** Delete a report */
  const handleDeleteReport = async (id) => {
    if (!id) {
      toast.error("Invalid report ID");
      return;
    }

    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Delete failed");
      }

      setReports((prev) => prev.filter((r) => r.id !== id));
      toast.success("Report deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete report");
    } finally {
      setDeleteOpen(false);
      setSelectedReport(null);
    }
  };

  const origin = usePathname()

  return (
    <div className="p-6 relative">
      <h1 className="text-xl font-semibold mb-2">Manage Reports</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <>
          {/* Controls */}
          <div className="flex items-center justify-between my-4 gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 font-semibold text-white p-2 rounded"
            >
              New Report
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-gray-900 font-semibold text-white p-2 rounded"
            >
              Download PDF
            </button>
          </div>

          {/* Reports list */}
          <div className="grid lg:grid-cols-2 gap-4">
            {reports.map((r) => (
              <div key={r.id}
                className="bg-white p-4 shadow rounded"
                onClick={() => router.push(`${origin}/${r.id}`)}
              >
                <h2 className="font-semibold">{r.title}</h2>
                <FormattedText text={r.description} />
                <p>{new Date(r.created_at).toLocaleDateString()}</p>

                <div className="flex items-center justify-end mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSendReport(r)
                    } }
                    className="bg-blue-600 p-1 px-2 rounded mr-3 text-white"
                  >
                    <Send className="inline mr-1" /> Send
                  </button>
                  <DeleteButton
                    click={(e) => {
                      e.stopPropagation()
                      setSelectedReport(r.id);
                      setDeleteOpen(true);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Delete Modal */}
          <DeleteConfirmationModal
            isOpen={isDeleteOpen}
            onClose={() => {
              setDeleteOpen(false);
              setSelectedReport(null);
            }}
            onConfirm={() => handleDeleteReport(selectedReport)} 
            title="Delete Report"
            description="Are you sure you want to delete this report?"
          />

          {/* Report Form Modal */}
          {showForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/80">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative"
              >
                <FaTimesCircle
                  size={26}
                  onClick={() => setShowForm(false)}
                  className="text-white mb-2 ml-auto cursor-pointer"
                />
                <ReportForm />
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
