"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ReportDetail() {
    const { id } = useParams();
    const supabase = createClientComponentClient();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
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
                .eq("id", id)
                .single();

            if (error) console.log(error);
            else setReport(data);

            setLoading(false);
        };

        fetchReport();
    }, [id, supabase]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!report) return <p className="text-center mt-10">Report not found</p>;

    // Map zones to colors
    const zoneColors = {
        North: "bg-green-200 text-green-800",
        South: "bg-red-200 text-red-800",
        East: "bg-blue-500 text-blue-800",
        West: "bg-yellow-200 text-yellow-800",
        default: "bg-gray-200 text-gray-800",
    };

    const zoneClass = zoneColors[report.zone] || zoneColors.East;

    return (
        <div className="max-w-3xl mx-auto p-6 mt-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${zoneClass}`}>
                        {report.zone}
                    </span>
                </div>

                <p className="text-gray-400 text-sm mb-4">{new Date(report.created_at).toLocaleString()}</p>
                <p className="text-gray-700 mb-6">{report.description}</p>

                {report.reporter && (
                    <div className="flex items-center gap-4 border bg-gray-100 pt-4 mt-4 transition-transform transform hover:scale-105 hover:shadow-lg rounded-md p-2">
                        <img
                            src={report.reporter.img_url || "/female.jpg"}
                            alt={report.reporter.full_name}
                            className="w-16 h-16 rounded-full object-cover border"
                        />
                        <div>
                            <p className="font-semibold text-gray-800">{report.reporter.full_name}</p>
                            <p className="text-sm text-gray-500">{report.reporter.phone}</p>
                            <p className="text-sm text-gray-500">{report.reporter.email}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
