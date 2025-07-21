"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../lib/auth";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Register() {
  const rolesOptions = ['Resident', 'Admin', 'Guard']

  const [role, setRole] = useState('Resident' || rolesOptions[0] )
  
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      toast.success("Registration successful");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col  m-auto justify-center p-4 max-w-md">
      <div>
        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-2 bg-blue-100 p-4 rounded shadow-md w-full"
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
            Register
          </button>
        </form>
        <div className="flex p-2">
          <p>Already have an account? </p>
          <Link href="/login" className="ml-auto font-semibold">Login</Link>
        </div>
      </div>
      </div>
  )  
}
