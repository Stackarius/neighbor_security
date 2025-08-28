"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CldUploadWidget } from "next-cloudinary";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    img_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(false); // track if profile exists

  // Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      let { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, phone, img_url")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setIsNew(false);
      } else {
        // no profile row yet
        setIsNew(true);
      }
    };

    fetchProfile();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save profile to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("No user logged in");
      setLoading(false);
      return;
    }

    let error;

    if (isNew) {
      // Insert a new row for first-time users
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        ...profile,
      });
      error = insertError;
      if (!error) setIsNew(false);
    } else {
      // Fetch current row to preserve existing values
      const { data: currentData } = await supabase
        .from("profiles")
        .select("full_name, email, phone, img_url")
        .eq("id", user.id)
        .single();

      // Merge only non-empty values
      const updates = { ...currentData };
      Object.keys(profile).forEach((key) => {
        if (profile[key] && profile[key].trim() !== "") {
          updates[key] = profile[key];
        }
      });

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);
      error = updateError;
    }

    setLoading(false);

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      alert("Profile saved successfully!");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Photo Upload */}

        <div>
          <label className="block mb-1 text-sm font-medium">Profile Photo</label>
          {profile.img_url && (
            <img
              src={profile.img_url}
              alt={profile.full_name}
              className="w-40 h-40 mx-auto rounded-full object-cover mb-2"
            />
          )}

          <CldUploadWidget
            uploadPreset="profile_pics"
            onSuccess={(result, { widget }) => {
              if (result.event === "success") {
                setProfile({ ...profile, img_url: result.info.secure_url });
                widget.close();
              }
            }}
          >
            {(props) => {
              if (!props?.open) {
                console.warn(
                  "Cloudinary upload widget not available. Check config."
                );
                return (
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                  >
                    Upload Not Available
                  </button>
                );
              }

              return (
                <button
                  type="button"
                  onClick={() => props.open()}
                  className="px-4 py-2 mx-auto block bg-blue-600 text-white rounded"
                >
                  Upload Photo
                </button>
              );
            }}
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
            className="w-full border rounded p-2"
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
            className="w-full border rounded p-2"
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
            className="w-full border rounded p-2"
          />
        </div>

       

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          {loading ? "Saving..." : isNew ? "Create Profile" : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
