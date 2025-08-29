"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import FormattedText from "@/components/FormattedText";

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

    if (loading) return <p>Loading...</p>;
    if (!report) return <p>Report not found</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{report.title}</h1>
            <p className="text-gray-500 mb-4">{new Date(report.created_at).toLocaleString()}</p>
            <p>{report.description }</p>

            {report.reporter && (
                <div className="mt-6 flex items-center gap-3">
                    {report.reporter.img_url && <img src={report.reporter.img_url} className="w-20 h-20 object-fit rounded-full" />}
                    <div>
                        <p className="font-semibold">{report.reporter.full_name}</p>
                        <p className="text-sm text-gray-500">{report.reporter.phone}</p>
                        <p className="text-sm text-gray-500">{report.reporter.email}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
