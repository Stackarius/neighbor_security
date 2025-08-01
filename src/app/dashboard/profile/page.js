"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { getUser } from "../../../lib/auth";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    address: "",
    email: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const user = await getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, address, email")
        .eq("id", user.id)
        .single();

      if (error) {
        toast.error("Failed to fetch profile");
        toast.error(error);
      } else {
        setProfile(data || {});
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const user = await getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to save profile");
      toast.error(error);
    } else {
      toast.success("Profile updated");
    }
  };

  return (
    <div className="max-w-xl mt-8 mx-auto bg-gray-100 p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <label className="block mb-2">
            <span className="font-semibold">Full Name</span>
            <input
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
            />
          </label>

          <label className="block mb-2">
            <span className="font-semibold">Phone</span>
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
            />
          </label>

          <label className="block mb-4">
            <span className="font-semibold">Address</span>
            <input
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
            />
          </label>

          <div className="flex items-center">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 mr-auto rounded hover:bg-blue-700"
            >
              Save Changes
              </button>
              
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Back to Dashboard </Link>
          </div>
        </>
      )}
    </div>
  );
}
