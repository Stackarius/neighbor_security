"use client";

import AdminBar from "@/components/AdminBar";
import { LucideMenu, LucideX } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [isOpen, setOpen] = useState(false);

  return (
      <div className="flex min-h-screen overflow-y-auto bg-gray-100">
      {!isOpen && <AdminBar />}
      {/* Show Nav icon on sm dev */}
      {isOpen ? <LucideMenu
        className="block fixed top-4 bg-blue-700 text-white right-4 text-blue-600 z-30 shadow rounded p-1 cursor-pointer"
        onClick={() => setOpen(!isOpen)}
      /> : <LucideX onClick={() => setOpen(!isOpen)} className="block fixed top-4 bg-blue-700 text-white right-4 text-blue-600 z-30 shadow rounded p-1 cursor-pointer" />}
      <main className="flex-1 h-full">{children}</main>
    </div>
  );
}
