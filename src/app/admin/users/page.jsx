"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/ConfirmModal"; // reuse confirm modal

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);
    const router = useRouter();

    // fetch users
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("id, full_name, email, user_role");
        if (error) {
            console.error("Error fetching users:", error);
        } else {
            setUsers(data);
        }
    };

    // handle toggle with confirmation
    const handleAdminToggle = async (userId, currentRole) => {
        setLoadingId(userId);

        const newRole = currentRole === "admin" ? "user" : "admin";

        const { error } = await supabase
            .from("profiles")
            .update({ user_role: newRole })
            .eq("id", userId);

        if (error) {
            console.error("Error updating role:", error);
        } else {
            fetchUsers();
        }

        setLoadingId(null);
    };

    const openConfirm = (user) => {
        setPendingUser(user);
        setConfirmOpen(true);
    };

    const confirmRoleChange = () => {
        if (pendingUser) {
            handleAdminToggle(pendingUser.id, pendingUser.user_role);
        }
        setConfirmOpen(false);
        setPendingUser(null);
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">All Users</h1>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Role</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className={`border-t hover:bg-gray-50 transition ${loadingId === user.id ? "opacity-50" : ""
                                    }`}
                            >
                                <td
                                    className="p-2 cursor-pointer"
                                    onClick={() => router.push(`/admin/users/${user.id}`)}
                                >
                                    {user.full_name}
                                </td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${user.user_role === "admin"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {user.user_role}
                                    </span>
                                </td>
                                <td className="p-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openConfirm(user);
                                        }}
                                        className={`px-3 py-1 rounded text-white w-fit transition ${user.user_role === "admin"
                                                ? "bg-red-500 hover:bg-red-600"
                                                : "bg-green-500 hover:bg-green-600"
                                            }`}
                                        disabled={loadingId === user.id}
                                    >
                                        {loadingId === user.id
                                            ? "Updating..."
                                            : user.user_role === "admin"
                                                ? "Remove Admin"
                                                : "Make Admin"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        className={`p-4 border rounded-lg shadow-sm cursor-pointer transition hover:shadow-md ${loadingId === user.id ? "opacity-50" : ""
                            }`}
                    >
                        <h2 className="font-semibold">{user.full_name}</h2>
                        <p className="text-gray-600">{user.matric_number}</p>
                        <p className="mt-1">
                            <span
                                className={`px-2 py-1 text-xs rounded ${user.user_role === "admin"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {user.user_role}
                            </span>
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openConfirm(user);
                            }}
                            className={`mt-3 px-3 py-1 rounded text-white transition ${user.user_role === "admin"
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-green-500 hover:bg-green-600"
                                }`}
                            disabled={loadingId === user.id}
                        >
                            {loadingId === user.id
                                ? "Updating..."
                                : user.user_role === "admin"
                                    ? "Remove Admin"
                                    : "Make Admin"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmRoleChange}
                title="Change Role"
                description={`Are you sure you want to ${pendingUser?.user_role === "admin"
                        ? "remove Admin rights"
                        : "make this user an Admin"
                    }?`}
            />
        </div>
    );
}
