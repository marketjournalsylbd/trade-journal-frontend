// components/Layout.tsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-[#05060a] text-gray-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col">
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6 flex-1 overflow-auto">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
