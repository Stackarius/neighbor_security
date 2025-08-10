"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const router = useRouter();
    const [loadingId, setLoadingId] = useState(null);

    const fetchUsers = async () => {
        const { data: fetchedUsers, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching users:", error);
            return;
        }
        setUsers(fetchedUsers);
    };

    const handleRowClick = (id) => {
        setLoadingId(id);
        setTimeout(() => {
            router.push(`/admin/users/${id}`);
        }, 200);
    };

    const handleAdminToggle = async (id, currentRole) => {
        setLoadingId(id);

        const newRole = currentRole === "resident" ? "admin" : "resident";

        const { error } = await supabase
            .from("profiles")
            .update({ user_role: newRole })
            .eq("id", id);

        if (error) {
            console.error(error.message);
            toast.error("Error updating role");
        } else {
            toast.success(`Role updated to ${newRole}`);
            fetchUsers();
        }

        setLoadingId(null);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Users</h2>

            {/* Desktop Table */}
            <table className="hidden md:table w-full border-collapse">
                <thead>
                    <tr>
                        <th className="text-left p-2">S/N</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Phone</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Address</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr
                            key={user.id}
                            className={`cursor-pointer transition-all duration-200 hover:bg-blue-50 ${loadingId === user.id ? "opacity-50" : ""
                                }`}
                            onClick={() => handleRowClick(user.id)}
                        >
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{user.full_name}</td>
                            <td className="p-2">{user.phone}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">{user.address}</td>
                            <td className="p-2">{user.user_role}</td>
                            <td className="p-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAdminToggle(user.id, user.user_role);
                                    }}
                                    className={`px-3 py-1 rounded text-white transition-transform duration-200 ${user.user_role === "admin"
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-green-500 hover:bg-green-600"
                                        } ${loadingId === user.id ? "animate-pulse" : ""}`}
                                >
                                    {user.user_role === "admin" ? "Remove Admin" : "Make Admin"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className={`p-4 border rounded-lg shadow-sm transition-all duration-300 transform hover:scale-[1.02] ${loadingId === user.id ? "opacity-50 translate-x-2" : "opacity-100"
                            }`}
                        onClick={() => handleRowClick(user.id)}
                    >
                        <p className="font-bold">{user.full_name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="mt-2">
                            Role: <span className="font-medium">{user.user_role}</span>
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAdminToggle(user.id, user.user_role);
                            }}
                            className={`mt-3 px-3 py-1 rounded text-white transition-transform duration-200 ${user.user_role === "admin"
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-green-500 hover:bg-green-600"
                                } ${loadingId === user.id ? "animate-pulse" : ""}`}
                        >
                            {user.user_role === "admin" ? "Remove Admin" : "Make Admin"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
