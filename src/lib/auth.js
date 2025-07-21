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
    throw new Error(error.message);
  }
  return user;
};