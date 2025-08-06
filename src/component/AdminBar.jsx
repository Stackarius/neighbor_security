"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoutButton from "./LogoutButton";
import { motion } from "framer-motion";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/admin" },
        { name: "All Reports", href: "/admin/reports" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ease: "anticipate", duration: 0.5 }}

            className="fixed w-60 h-[100vh] bg-gray-900 shadow-md md:shadow-none  text-white p-4 space-y-4 md:block md:relative"
        >
            <h2 className="text-xl font-bold mb-6">Security Watch</h2>
            <ul className="space-y-2">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <Link
                            href={item.href}
                            className={`block px-2 font-semibold py-1 rounded hover:bg-blue-700 ${pathname === item.href ? "bg-gray-700" : ""
                                }`}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <LogoutButton />
        </motion.div>
    );
}
