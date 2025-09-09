"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";
import { Send } from "lucide-react";

export default function ReportForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [zone, setZone] = useState("");
  const [userId, setUserId] = useState("");

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

  useEffect(() => {
    fetchUser();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !zone) {
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
    <div className="w-full flex flex-col justify-center p-3">
     <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white space-y-4 md:p-8 p-4 rounded-lg shadow"
      >
        <input
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Describe the incident..."
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <input
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          type="text"
          placeholder="Zone (e.g., Block A, Hostel 2)"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-600 w-full text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Send className="w-4 h-4" />
          Submit Report
        </button>
      </form>
    </div>
  );
}
