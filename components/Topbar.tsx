// components/Topbar.tsx
import React from "react";

export default function Topbar({
  onToggleSidebar,
  children,
}: {
  onToggleSidebar: () => void;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800/40 bg-[#060812]/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-white/5"
          aria-label="toggle sidebar"
        >
          ☰
        </button>

        <div className="text-sm text-gray-300">Welcome back — track your trades</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md bg-white/3">
          <input
            className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-48"
            placeholder="Search trades, symbols..."
          />
          <button className="text-sm px-2 py-1 rounded-md bg-[#F5C518] text-black font-semibold">
            Search
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded-md hover:bg-white/5 text-sm">Docs</button>
          <div className="w-9 h-9 bg-white/5 rounded-full grid place-items-center text-sm">U</div>
        </div>
      </div>
    </header>
  );
}
