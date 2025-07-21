"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

export default function ReportForm({ user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { data, error } = await supabase.from("reports").insert([
      {
        title,
        description,
        user_id: user.id, // This assumes you pass the logged-in user as prop
      },
    ]);

    if (error) {
      toast.error("Failed to submit report.");
      console.error(error);
    } else {
      toast.success("Report submitted successfully!");
      setTitle("");
      setDescription("");
    }

    setSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow w-full mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Submit New Report</h2>
      <label className="block mb-2 font-semibold">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border px-3 py-2 mb-4 rounded"
      />

      <label className="block mb-2 font-semibold">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full border px-3 py-2 mb-4 rounded"
        rows="4"
      ></textarea>

          <label className="block mb-2 font-semibold">Photo</label>
          <input type="file" accept="image/*" className="border w-full py-2 rounded mb-2" />

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {submitting ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
