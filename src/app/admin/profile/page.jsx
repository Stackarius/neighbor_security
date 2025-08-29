"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    img_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [userId, setUserId] = useState(null);

  // Fetch current user + profile
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, phone, img_url")
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setProfile(data);
        setIsNew(false);
      } else {
        setIsNew(true);
      }
    };

    fetchProfile();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("No user logged in");

    setLoading(true);
    let error;

    if (isNew) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        ...profile,
      });
      error = insertError;
      if (!error) setIsNew(false);
    } else {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", userId);
      error = updateError;
    }

    setLoading(false);

    if (error) {
      toast.error("Error saving profile: " + error.message);
    } else {
      toast.success("Profile saved successfully!");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 md:p-6 bg-white mt-8">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Update Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Photo */}
        <div className="text-center bg-gray-100 py-3 md:py-6 rounded">
          {profile.img_url ? (
            <img
              src={profile.img_url}
              alt={profile.full_name || "Profile"}
              className="w-28 h-28 mx-auto rounded-full object-cover mb-3 border shadow"
            />
          ) : (
            <div className="w-28 h-28 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-3">
              No Photo
            </div>
          )}

          <CldUploadWidget
            uploadPreset="profile_pics"
            onSuccess={(result, { widget }) => {
              if (result.event === "success") {
                setProfile((prev) => ({ ...prev, img_url: result.info.secure_url }));
                widget.close();
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Upload Photo
              </button>
            )}
          </CldUploadWidget>
        </div>

        {/* Full Name */}
        <div>
          <label className="block mb-1 text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Saving..." : isNew ? "Create Profile" : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
