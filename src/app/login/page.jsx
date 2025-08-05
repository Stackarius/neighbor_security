"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login } from "../../lib/auth";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    
    e.preventDefault();

    try {
      setLoading(true)
      const user = await login(email, password);

      // Get user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_role")
        .eq("id", user.id)
        .single();
      
      // user == admin => "/admin" : "/dashboard"
      if (profile && profile.user_role == "admin") {
        setLoading(false)
        router.push("/admin");
      } else {
        setLoading(false)
        router.push("/dashboard");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Login failed: " + err.message);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center h-[100vh] bg-cover bg-center"
      style={{ backgroundImage: "url('/hands.jpg')" }}
    >
      <div className="flex flex-col items-center m-auto justify-center p-4 w-[500px] max-w-md">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-2 bg-transparent backdrop-blur-lg bg-white/40 text-white p-4 rounded shadow-md w-full"
        >
          <h2 className="text-2xl font-bold text-center my-3">Login</h2>
          <p className="text-sm text-white mb-1 font-semibold">Email</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-2 border border-gray-400 rounded p-2"
          />
          <p className="text-sm text-white mb-1 font-semibold">Password</p>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4 border border-gray-400 rounded p-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mb-2 font-semibold hover:bg-blue-700"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white inline mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            )}
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>
        <div className="flex justify-between p-2 text-white">
          <p className="mr-auto ">Don&apos;t have an account? </p>
          <Link href="/register" className="ml-5 font-semibold">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
