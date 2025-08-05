"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../lib/auth";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Register() {
  const rolesOptions = ['resident', 'admin']

  const [role, setRole] = useState('resident' || rolesOptions[0] )
  
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false)

  

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      await register(email, password)
      toast.success("Registration successful! Please log in to complete your profile.");
      router.push("/login");
    } catch (err) {
      setLoading(false)
      toast.error("An unexpected error occured, can't register new user");
      console.log(err.message)
    }
  };

  return (
    <div
      className="relative items-center w-full h-[100vh] bg-cover bg-center flex flex-col m-auto justify-center p-4 "
      style={{ backgroundImage: "url('/hands.jpg')" }}
    >
      
        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-2 bg-blue-100 p-4 rounded shadow-md w-full md:w-[500px]"
        >
          <h2 className="text-2xl font-bold my-3 text-center">Register</h2>
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
          <p className="text-sm text-gray-700 mb-1 font-semibold">
            Confirm Password
          </p>

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mb-4 border border-gray-400 rounded p-2"
          />
          {/* Role */}
          <select
            className="mb-2 border border-gray-400  p-2"
            onChange={() => {
              setRole(role);
            }}
          >
            {rolesOptions.map((role) => (
              <option key={role} value={role} className="p-1 bg-white">
                {role}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={
              "bg-blue-500 rounded font-semibold text-white px-4 py-2 hover:bg-blue-700 mb-2"
            }
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
            {loading ? "Please wait..." : "Register"}
          </button>
        </form>
        <div className="flex p-2 text-white">
          <p>Already have an account? </p>
          <Link href="/login" className="ml-auto font-semibold">
            Login
          </Link>
        </div>
      
    </div>
  );  
}
