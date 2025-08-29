"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoutButton from "./LogoutButton";
import { motion } from "framer-motion";

// icons from lucide-react
import { Home, FileText, Users, UserCircle } from "lucide-react";

export default function AdminBar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/admin", icon: Home },
        { name: "All Reports", href: "/admin/reports", icon: FileText },
        { name: "Manage Users", href: "/admin/users", icon: Users },
        { name: "My Profile", href: "/admin/profile", icon: UserCircle },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ease: "anticipate", duration: 0.5 }}
            className="fixed w-60 h-[100vh] bg-gray-900 shadow-md md:shadow-none text-white p-4 space-y-4 md:block md:relative z-30"
        >
            <h2 className="text-xl font-bold mb-2">NSW</h2>
            <ul className="space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 px-2 font-semibold py-2 rounded transition-colors hover:bg-gray-700 ${pathname === item.href ? "bg-blue-700" : ""
                                    }`}
                            >
                                <Icon size={18} />
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-6">
                <LogoutButton />
            </div>
        </motion.div>
    );
}
