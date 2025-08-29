"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditUserModal({ isOpen, onClose }) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated user:", { email, role });
        onClose(); // Close modal after saving
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white text-gray-900 rounded-2xl shadow-lg p-6 w-96"
                    >
                        <h2 className="text-lg font-bold mb-4">Edit User</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold">User Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border rounded p-2 mt-1"
                                    placeholder="Enter user email"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full border rounded p-2 mt-1"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
