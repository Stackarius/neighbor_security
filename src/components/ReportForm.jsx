"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseClient";
import { Send, AlertCircle } from "lucide-react";

const INCIDENT_TYPES = [
  "Fire/Smoke",
  "Medical Emergency",
  "Security Breach",
  "Vandalism",
  "Theft",
  "Assault",
  "Accident/Injury",
  "Utility Failure",
  "Noise Complaint",
  "Other"
];

const SEVERITY_LEVELS = [
  { level: "Critical", color: "bg-red-600 hover:bg-red-700", description: "Immediate threat to life or property" },
  { level: "High", color: "bg-orange-600 hover:bg-orange-700", description: "Serious incident requiring urgent response" },
  { level: "Medium", color: "bg-yellow-600 hover:bg-yellow-700", description: "Notable incident needing attention" },
  { level: "Low", color: "bg-blue-600 hover:bg-blue-700", description: "Minor issue for documentation" }
];

export default function ReportForm({ user }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("");
  const [useRegisteredAddress, setUseRegisteredAddress] = useState(true);
  const [customLocation, setCustomLocation] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUserId(authUser.id);
      } else {
        toast.error("Please log in to submit a report.");
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const sendNotifications = async (report) => {
    try {
      const { data: residents, error: usersError } = await supabase
        .from("profiles")
        .select("email")
        .eq("user_role", "resident")
        .neq("id", userId);

      if (usersError) throw new Error(usersError.message);

      const residentEmails = residents.map((u) => u.email);
      if (!residentEmails.length) {
        toast.warning("No resident emails to notify.");
        return;
      }

      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: residentEmails,
          subject: `New Report: ${report.title}`,
          text: `A new ${report.description} severity report has been submitted.`,
          html: `<strong>New Report: ${report.title}</strong><br><p>Severity: ${report.description}</p><p>Location: ${report.zone}</p>`,
        }),
      });

      if (!response.ok) throw new Error("Failed to send notifications");
      toast.success(`Notifications sent to ${residentEmails.length} residents!`);
    } catch (error) {
      console.error("Notification error:", error);
      toast.error("Failed to send notifications.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !severity) {
      toast.error("Please select incident type and severity");
      return;
    }

    const reportLocation = useRegisteredAddress ? user?.address : customLocation;

    if (!reportLocation?.trim()) {
      toast.error("Please enter a location");
      return;
    }

    setLoading(true);

    const { data: reportData, error } = await supabase
      .from("reports")
      .insert([{
        title,
        description: severity,
        zone: reportLocation,
        user_id: userId,
      }])
      .select()
      .single();

    if (error) {
      toast.error("Error submitting report: " + error.message);
      setLoading(false);
      return;
    }

    // Send notifications after successful report creation
    await sendNotifications(reportData);

    // Reset form
    setTitle("");
    setSeverity("");
    setCustomLocation("");
    setUseRegisteredAddress(true);
    setLoading(false);
    toast.success("Emergency report submitted successfully!");
  };

  if (!user) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  const isFormValid = title && severity && (useRegisteredAddress || customLocation.trim());

  return (
    <div className="w-full flex flex-col justify-center">
      <form onSubmit={handleSubmit} className="w-full space-y-6">

        {/* Incident Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            What type of incident?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {INCIDENT_TYPES.map((incident) => (
              <button
                key={incident}
                type="button"
                onClick={() => setTitle(incident)}
                className={`p-3 rounded-lg font-medium text-sm transition-all border-2 ${title === incident
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                  }`}
              >
                {incident}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Level Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            How severe is it?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SEVERITY_LEVELS.map(({ level, color, description }) => (
              <button
                key={level}
                type="button"
                onClick={() => setSeverity(level)}
                className={`p-3 rounded-lg text-white font-medium text-left transition-all border-2 ${severity === level
                  ? `${color} shadow-lg border-opacity-100`
                  : `${color} opacity-60 border-gray-200`
                  }`}
              >
                <div className="font-semibold">{level}</div>
                <div className="text-xs opacity-90">{description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Incident Location
          </label>
          <div className="space-y-3">

            {/* Use Registered Address Option */}
            <button
              type="button"
              onClick={() => setUseRegisteredAddress(true)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${useRegisteredAddress
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${useRegisteredAddress
                  ? "border-blue-600 bg-blue-600"
                  : "border-gray-300"
                  }`}>
                  {useRegisteredAddress && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">Use Registered Address</p>
                  <p className="text-sm text-gray-600">{user?.address}</p>
                </div>
              </div>
            </button>

            {/* Custom Location Option */}
            <button
              type="button"
              onClick={() => setUseRegisteredAddress(false)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${!useRegisteredAddress
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!useRegisteredAddress
                  ? "border-blue-600 bg-blue-600"
                  : "border-gray-300"
                  }`}>
                  {!useRegisteredAddress && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <p className="font-medium text-gray-900">Report Different Location</p>
              </div>
            </button>

            {/* Custom Location Input */}
            {!useRegisteredAddress && (
              <input
                type="text"
                placeholder="Enter incident location..."
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className={`flex items-center justify-center gap-2 w-full text-white font-semibold px-4 py-4 rounded-lg transition-all ${loading || !isFormValid
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
        >
          <Send className="w-5 h-5" />
          {loading ? "Submitting..." : "Submit Report"}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Report submitted instantly. Emergency services will be notified.
        </p>
      </form>
    </div>
  );
}