"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { motion } from "framer-motion";
import { Home, FileText, User } from "lucide-react"; // icons

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Reports", href: "/dashboard/report", icon: FileText },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ease: "anticipate", duration: 0.5 }}
      className="fixed left-0 top-0 h-screen w-full bg-gray-900 shadow-lg z-20 text-white p-4 flex flex-col justify-between"
    >
      {/* Logo / Title */}
      <div>
        <h2 className="text-xl font-bold mb-8 mt-12">Security Watch</h2>

        {/* Nav links */}
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-700"
                    }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout pinned at bottom */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <LogoutButton />
      </div>
    </motion.aside>
  );
}
