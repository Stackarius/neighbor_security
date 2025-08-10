"use client";

import AdminBar from "@/component/AdminBar";
import { LucideMenu } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [isOpen, setOpen] = useState(false);

  return (
      <div className="flex min-h-screen overflow-y-auto bg-gray-100">
      {!isOpen && <AdminBar />}
      {/* Show Nav icon on sm dev */}
      <LucideMenu
        className="block fixed top-4 bg-blue-700 text-white right-4 text-blue-600 z-30 shadow rounded p-1 cursor-pointer"
        onClick={() => setOpen(!isOpen)}
      />
      <main className="flex-1 h-full">{children}</main>
    </div>
  );
}
