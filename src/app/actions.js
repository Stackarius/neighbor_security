"use server";

import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function createNotification(message, userIds, reportId) {
  const supabase = await createServerSupabaseClient();
  const notifications = userIds.map((userId) => ({
    user_id: userId,
    message,
    report_id: reportId,
  }));

  const { error } = await supabase.from("notifications").insert(notifications);
  if (error) {
    console.error("Error creating notifications:", error);
    throw new Error("Failed to create notifications");
  }
}
