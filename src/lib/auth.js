import { supabase } from "./supabaseClient";
export const register = async (fullname, email, password, phone, address) => {
  // Validate required fields
  if (
    !fullname?.trim() ||
    !email?.trim() ||
    !password ||
    !phone?.trim() ||
    !address?.trim()
  ) {
    throw new Error("All fields are required");
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Registration error:", error.message);
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Failed to create user account");
  }

  // Wait for trigger to create profile, then update it
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update({
      full_name: fullname.trim(),
      phone: phone.trim(),
      address: address.trim(),
    })
    .eq("id", data.user.id)
    .select()
    .single();

  if (updateError) {
    console.error("Profile update error:", updateError.message);
    throw new Error("Failed to update user profile");
  }

  return { user: data.user, profile: updatedProfile };
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
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) throw new Error(error.message);
  return data;
}
