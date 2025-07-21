"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard" },
    { name: "Reports", href: "/dashboard/report" },
    { name: "Profile", href: "/dashboard/profile" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold mb-6">Security Watch</h2>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`block px-2 py-1 rounded hover:bg-blue-700 ${
                pathname === item.href ? "bg-gray-700" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
