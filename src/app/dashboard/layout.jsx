"use client";

import Sidebar from "@/components/Sidebar";
import { LucideMenu } from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [isOpen, setOpen] = useState(false); // for mobile
  const [collapsed, setCollapsed] = useState(false); // for desktop collapse

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="h-full overflow-y-auto">
          <Sidebar collapsed={collapsed} />
        </div>

        {/* Collapse Button (only visible on desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:block absolute bottom-4 right-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40  z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Toggle button (only visible on mobile) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow lg:hidden"
        onClick={() => setOpen(!isOpen)}
      >
        {isOpen ? (
          <FaTimes className="text-blue-600" size={20} />
        ) : (
          <LucideMenu className="text-blue-600" size={20} />
        )}
      </button>

      {/* Main Content */}
      <main
        className={`flex-1 p-4 overflow-y-auto transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
      >
        {children}
      </main>
    </div>
  );
}
