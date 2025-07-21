import { toast } from "react-toastify";
import { supabase } from "./supabaseClient";

export const register = async(email, password) => {
    const {data, error} = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message);
    } return data;
}

export const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
      throw new Error(error.message);
    }
    return data;
}

export const logout = async () => {
    await supabase.auth.signOut()
}

export const getUser = async () => {
  const {data: { user }, error} = await supabase.auth.getUser();
  if (error) {
    console.log(error.message)
    toast("Error fetching user data at the moment....")
  }
  return user;
};

// Password reset
export const resetPassword = async (email, id) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail({
    email,
  })

  if (error) {
    toast("Error fetching user data at the moment....");
  }
  return data
}