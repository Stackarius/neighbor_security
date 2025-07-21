'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { getUser } from '../../../lib/auth';
import { toast } from 'react-toastify';
import React from 'react';

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [user, setUser] = useState(null);
    const [content, setContent] = useState('');

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

    // Handle Report Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        const { data, error } = await supabase
            .from('reports')
            .insert([{ content, user_id: user.id }]);

        if (error) {
            toast.error("Error submitting report");
            return;
        }

        setReports([data ? [0] : null, ...reports]);
        setContent('');
        toast.success("Report submitted");
    };

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
      <div>
        <h1 className="text-2xl font-bold my-4">Reports</h1>
        <form
          onSubmit={handleSubmit}
          className="w-[400px] mb-6 grid grid-cols-1 gap-4"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe the incident..."
            className=" border p-2 rounded mb-2 min-h-[250px] resize-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Report
          </button>
        </form>

        <ul className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reports?.map((report) => (
            <li key={report.id} className="bg-white shadow p-4 rounded">
              <p>{report.title}</p>
              <p>{report.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Posted: {new Date(report.created_at).toLocaleString()}
              </p>

              {report.user_id === user?.id && (
                <button
                  onClick={() => handleDelete(report.id)}
                  className="mt-2 text-red-600 underline text-sm"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
}
