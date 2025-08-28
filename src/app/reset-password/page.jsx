"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function ResetPasswordContent() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("access_token");

    async function handleReset(e) {
        e.preventDefault();
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Password updated! Redirecting...");
            setTimeout(() => router.push("/login"), 2000);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-xl font-bold mb-4">Reset Password</h1>
            <form onSubmit={handleReset} className="flex flex-col gap-2 w-64">
                <input
                    type="password"
                    placeholder="Enter new password"
                    className="border p-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="bg-green-600 text-white py-2 rounded">
                    Update Password
                </button>
            </form>
            {message && <p className="mt-3 text-sm">{message}</p>}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
