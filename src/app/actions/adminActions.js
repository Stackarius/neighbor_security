"use server";

import { createClient } from "@supabase/supabase-js";

function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

export async function deleteUser(id) {
  const supabase = createAdminSupabaseClient();

  // Delete related reports first
  const { error: reportsError } = await supabase
    .from("reports")
    .delete()
    .eq("user_id", id);

  if (reportsError) throw reportsError;

  // Delete the user profile
  const { error: userError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (userError) throw userError;

  return true;
}
