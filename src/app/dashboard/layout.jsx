"use client";

import Sidebar from "@/component/Sidebar";
import { LucideMenu } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {!isOpen && <Sidebar />}
      {/* Show Nav icon on sm dev */}
      <LucideMenu
        className="block fixed top-4 right-4 text-blue-600"
        onClick={() => setOpen(!isOpen)}
      />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
