'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { getUser } from '../../../lib/auth';
import { toast } from 'react-toastify';
import React from 'react';
import { motion } from 'framer-motion';
import ReportForm from '@/components/ReportForm';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';


export default function ReportsPage() {
  const origin = usePathname()

  const router = useRouter()

  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch user and reports
  const fetchReports = async () => {
    const currentUser = await getUser();
    setUser(currentUser);

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch reports');
      return;
    }
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle Report Delete
  const handleDelete = async (id) => {
    const { error } = await supabase.from('reports').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete');
      return;
    }

    setReports(reports.filter((r) => r.id !== id));
    toast.success('Deleted');
  };

  // Handle Report Submission
  const handleReportSubmitted = async () => {
    setShowForm(false);
    await fetchReports();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-2 md:px-6 md:py-8 py-6"
    >
      <h1 className="text-2xl font-bold my-6 md:mt-0">Reports Overview</h1>

      {/* Add Report Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          Add Report
        </button>
      )}

      {/* Report Form */}
      {showForm && (
        <div className="mb-6 bg-white shadow-md p-2 rounded-lg">
          <ReportForm onSubmitted={handleReportSubmitted} />
          <button
            onClick={() => setShowForm(false)}
            className="mt-3 text-sm text-gray-600 hover:underline"
          >
            Close Form
          </button>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {reports?.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-blue-100 shadow-lg p-4 rounded-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => router.push(`${origin}/${report.id}`)}
          >
            <h2 className="font-semibold mb-2">{report.title}</h2>
            <p>{report.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Posted: {new Date(report.created_at).toLocaleString()}
            </p>

            {report.user_id === user?.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigating when deleting
                  handleDelete(report.id);
                }}
                className="mt-3 text-white font-semibold px-4 py-2 rounded text-sm bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </motion.div>
        ))}

        {reports.length === 0 && (
          <p className="text-gray-500 text-center">No reports yet.</p>
        )}
      </div>
    </motion.div>
  );
}
