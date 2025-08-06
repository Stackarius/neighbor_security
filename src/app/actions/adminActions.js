// app/actions/adminActions.js
"use server";

import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function getAdminData() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_role")
    .eq("id", user.id)
    .single();
  if (profileError || profile.user_role !== "admin") throw new Error("Unauthorized");

  const [users, reports] = await Promise.all([
    supabase.from("profiles").select("*"),
    supabase.from("reports").select("*").order("created_at", { ascending: false }),
  ]);

  return { users: users.data, reports: reports.data };
}

export async function deleteUser(id) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
  return true;
}