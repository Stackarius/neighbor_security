"use client";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Send } from "lucide-react";
import DeleteButton from "@/component/DeleteButton";
import FormattedText from "@/component/FormattedText";
import ReportForm from "@/component/ReportForm";
import { FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import DeleteConfirmationModal from "@/component/ConfirmModal"; "@/component/ConfirmModal"

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false)


  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isSendOpen, setSendOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const supabase = createClientComponentClient();

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
    } else {
      setReports(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {

    fetchReports();
  }, []);

  

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    // Logo URL
    const imgUrl = "https://res.cloudinary.com/dmucxf1kk/image/upload/v1754912521/nsw_logo_ygwbbe.png"
    const imgWidth = 20
    const imgHeight = 20

    doc.addImage(imgUrl, "PNG", 10, 10, imgWidth, imgHeight);
    // Title
    doc.setFontSize(18);
    doc.text("Security Reports", 30, 20);

    // Format rows
    const tableData = reports.map((r) => [
      r.title || "Untitled",
      r.description || "",
      r.created_at ? new Date(r.created_at).toLocaleDateString() : "",
    ]);

    // AutoTable
    autoTable(doc, {
      head: [["Title", "Description", "Date"]],
      body: tableData,
      startY: 30,
    });

    doc.save("reports.pdf");
  };

  return (
    <div className="py-6 px-10 relative">
      <h1 className="text-xl font-semibold mb-2">Manage Reports</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <>
          <div className="flex items-center justify-between my-4">
            {/* Make report button */}
            <button onClick={() => {
              setShowForm(!showForm)
            }} className="bg-blue-600 font-semibold text-white p-2 rounded">New Report</button>

            {/* Download pdf button  */}
            <button
              onClick={handleDownloadPDF}
              className="bg-gray-900 font-semibold text-white p-2 rounded"
            >
              Download Reports PDF
            </button>
          </div>
          {/*  */}
          <div className="grid grid-cols-2 gap-4">
            {reports.map((r, rIdx) => (
              <div key={rIdx} className="bg-white p-4 shadow rounded">
                <h2 className="font-semibold">{r.title}</h2>
                <FormattedText text={r.description} />
                <p>{new Date(r.created_at).toLocaleDateString()}</p>
                <span className="flex items-center justify-end w-full">
                  <button onClick={
                    async () => {
                      const { data, error } = await supabase.from("profiles").select("email").neq("email", null)
                      
                      if (usersError) {
                        console.error(
                          "Error fetching users:",
                          usersError.message
                        );
                        return;
                      }

                      for (const email of users) {
                        const { email: userEmail } = email;
                        if (!userEmail) continue;
                        // Send email notification

                        await fetch("/api/send-notification", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            from: "NSW Security <onboarding@resend.dev>",
                            to: `${userEmail}`, 
                            subject: `New report: ${title}`,
                            text: `${description}`,
                            html: `<strong>A new report has been created:</strong> ${description} <br /> Location: ${zone}`,
                          }),
                        });
                      }
                      
                    }
                  } className="bg-blue-600 p-1 px-2 rounded mr-3 text-white">
                    <Send className="inline mr-1" />Send

                  </button>
                  <DeleteButton click={() => {
                    setSelectedReport(report);
                    setDeleteOpen(true);
                  }} />

                  {/* Confirm Modal (place it once outside the .map loop) */}
                  <DeleteConfirmationModal
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
                </span>
              </div>

            ))}
          </div>
          {/*  */}
          {showForm &&
            <div
              className="fixed flex items-center justify-center top-0 left-0 w-full h-[100vh] bg-black/80">
              <motion.div
                initial={{ y: 0, scale: 0 }}
                animate={{  y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <FaTimesCircle size={26} onClick={() => setShowForm(!showForm)} className="text-white mb-2 ml-auto cursor-pointer" />
                <ReportForm />
              </motion.div>
            </div>}
        </>
      )}
    </div>
  );
}
