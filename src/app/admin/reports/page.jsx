"use client";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Send } from "lucide-react";
import DeleteButton from "@/component/DeleteButton";
import FormattedText from "@/component/FormattedText";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  // Fetch reports from Supabase
  useEffect(() => {
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
    <div className="py-6 px-10">
      <h1 className="text-xl font-semibold mb-2">Manage Reports</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
            <>
              <div className="flex items-center justify-between my-4">
                {/* Make report button */}
                <button className="bg-blue-600 font-semibold text-white p-2 rounded">New Report</button>

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
                {reports.map((r) => (
                <div className="bg-white p-4 shadow rounded">
                    <h2 className="font-semibold">{r.title}</h2>
                    <FormattedText text={r.description}/>
                    <p>{new Date(r.created_at).toLocaleDateString()}</p>
                    <span className="flex items-center justify-end w-full">
                      <button className="bg-blue-600 p-1 px-2 rounded mr-3 text-white">
                      <Send className="inline mr-1"/>Send

                      </button>
                      <DeleteButton></DeleteButton>
                    </span>
                </div>
                  
                ))}
              </div>
              {/*  */}

         
        </>
      )}
    </div>
  );
}
