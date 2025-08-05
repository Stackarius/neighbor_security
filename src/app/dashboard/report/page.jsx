'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { getUser } from '../../../lib/auth';
import { toast } from 'react-toastify';
import React from 'react';

import { motion } from 'framer-motion';
import ReportForm from '@/component/ReportForm';

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [user, setUser] = useState(null);

    // Fetch user and reports
    useEffect(() => {
        const fetchData = async () => {
            const currentUser = await getUser();
            setUser(currentUser);

            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                toast.error("Failed to fetch reports");
                return;
            }
            setReports(data);
        };
        fetchData();
    }, []);

    // Handle Report Delete
    const handleDelete = async (id) => {
        const { error } = await supabase.from('reports').delete().eq('id', id);

        if (error) {
            toast.error("Failed to delete");
            return;
        }

        setReports(reports.filter((r) => r.id !== id));
        toast.success("Deleted");
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='px-3'
      >
        <h1 className="text-2xl font-bold my-4">Reports Overview</h1>
        <div className='grid grid-cols-2'>
          <ReportForm/>

          {/*  */}
          <ul className="space-y-4 grid grid-cols-1 items-center md:items-start">
            {reports?.map((report) => (
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key={report.id}
                className="bg-white shadow p-4 rounded border-box"
              >
                <p>{report.title}</p>
                <p>{report.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Posted: {new Date(report.created_at).toLocaleString()}
                </p>

                {report.user_id === user?.id && (
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="mt-2 text-white font-semibold p-2 px-4 rounded text-sm bg-red-600 ml-auto block"
                  >
                    Delete
                  </button>
                )}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
}
