"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login } from "../../lib/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
      try {
          await login(email, password);
      router.push("/dashboard");
      } catch (err) {
          toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center m-auto justify-center p-4  max-w-md">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-2 bg-blue-100 p-4 rounded shadow-md w-full"
      >
        <h2 className="text-2xl font-bold text-center my-3">Login</h2>
        <p className="text-sm text-gray-700 mb-1 font-semibold">Email</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-2 border border-gray-400 rounded p-2"
        />
        <p className="text-sm text-gray-700 mb-1 font-semibold">Password</p>

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
          Login
        </button>
      </form>
    </div>
  );
}
