'use client'

import { supabase } from '../lib/supabaseClient';
import React, { useEffect } from 'react'

const Reports = () => {
    const [reports, setReports] = React.useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await supabase.from('reports').select('*');
                if (response.error) {
                    throw response.error;
                }
                setReports(response.data);
            }
            catch (error) {
                console.error('Error fetching reports:', error);
            }
        }
        fetchReports();
    }, [])
    return (
      <div>
        <ul>
          {reports.map((report) => (
            <ol key={report.id} className="mt-2">
              <li>
                <h3 className="font-semibold text-xl">{report.title}</h3>
                <p className="mt-2">{report.description}</p>
              </li>
            </ol>
          ))}
        </ul>
      </div>
    );
}

export default Reports