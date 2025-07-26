"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("All fields are required");
      return;
    }

    const { error } = await supabase
      .from("reports")
      .insert([{ title, description, zone, user_id: userId }]);

    if (error) {
      toast.error("Error submitting report: " + error.message);
    } else {
      toast.success("Report submitted successfully!");
      setTitle("");
      setDescription("");
      setZone("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white p-4 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-bold">Submit a Security Report</h2>
      <input
        className="w-full border p-2 rounded"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border p-2 rounded"
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Report
      </button>
    </form>
  );
}
