"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export default function ReportForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [zone, setZone] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {

    
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        toast.error("Please log in to submit a report.");
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const supabase = await createServerSupabaseClient();
    const { message, location } = await req.json();
    const { data: { user } } = await supabase.auth.getUser();

    if (!title || !description) {
      toast.error("All fields are required");
      return;
    }

    const { error } = await supabase
      .from("reports")
      .insert([{ title, description, zone, user_id: userId }]).select().single();

    if (error) {
      toast.error("Error submitting report: " + error.message);
    } else {
      toast.success("Report submitted successfully!");

      sendEmail();

      const { data: residents } = await supabase
        .from('auth.users')
        .select('id')
        .neq('id', user.id);

      await createNotification(
        `New report: ${message} at ${location}`,
        residents.map((r) => r.id),
        report.id
      );

      setTitle("");
      setDescription("");
      setZone("");
    }
  };


  async function sendEmail() {
    const { data: users, error: usersError } =
      await supabase
        .from("profiles")
        .select("email")
        .eq("user_role", "admin");

    if (usersError) {
      console.error(
        "Error fetching users:",
        usersError.message
      );
      return;
    }
    const adminMail = users.map((user) => user.email);

    await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: `${adminMail}`, // array of emails
        subject: `New report: ${report.title}`,
        text: `${report.description}`,
        html: `<strong>A new report has been created:</strong> ${report.description}`,
      }),
    });

   }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-[400px] bg-white p-4 rounded shadow-lg space-y-4"
    >
      <h2 className="text-md font-bold md:text-2xl">Submit a Security Report</h2>
      <input
        className="w-full border p-1 sm:px-2 rounded"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border p-2 rounded resize-none"
        placeholder="Description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <input
        className="w-full border p-2 rounded"
        type="text"
        placeholder="Zone"
        value={zone}
        onChange={(e) => setZone(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 w-full text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Report
      </button>
    </form>
  );
}
