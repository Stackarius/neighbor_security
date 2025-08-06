// lib/supabaseServer.js
"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = cookies();
  const allCookies = Object.fromEntries(
    cookieStore.getAll().map((c) => [c.name, c.value])
  );
  console.log("Available cookies:", allCookies); // Debug cookie presence

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => cookieStore.set(name, value, options),
        remove: (name, options) => cookieStore.delete({ name, ...options }),
      },
    }
  );

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();
  if (sessionError || !user) {
    console.error("Session error:", sessionError?.message || "No user");
    throw new Error("Unauthorized");
  }

  return supabase;
}
