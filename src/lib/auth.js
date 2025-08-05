import { supabase } from "./supabaseClient";

export const register = async (email, password) => {
  // 1. Try signing up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  // 2. Check for errors from Supabase Auth
  if (!data || error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  /* // 3. Check if user already exists in the profiles table
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .maybeSingle(); // avoids throwing if none

  // 4. Insert profile if it doesn't exist
  if (!existingProfile && data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      full_name,
      user_role: "user",
    }); */
  

  return data;
};


export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!supabase) {
    console.error("Supabase client is not initialized.");
    return;
  }
  if (error) {
    console.log("Sign-in error:");
  }
  return data.user;
};

// Logout function
export const logout = async () => {
  await supabase.auth.signOut();
};

export const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.log(error.message);
    toast("Error fetching user data at the moment....");
  }
  return user;
};

// Password reset
export const resetPassword = async (email, id) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail({
    email
  });

  if (error) {
    toast("Error fetching user data at the moment....");
  }
  return data;
};
