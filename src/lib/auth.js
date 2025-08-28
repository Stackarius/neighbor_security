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

// Forgot password
export async function sendPasswordReset(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://neighbor-security.vercel.app/reset-password",
  });

  if (error) {
    console.error(error.message);
  } else {
    console.log("Password reset email sent!", data);
  }
}
