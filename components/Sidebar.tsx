// components/Sidebar.tsx
import React from "react";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 transition-all duration-300
        ${open ? "w-72" : "w-16"} bg-[#05060a] border-r border-gray-800/40`}
    >
      <div className="h-16 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F5C518] rounded-sm grid place-items-center font-bold text-black">
            T
          </div>
          {open && <div className="text-white font-semibold">TradeDesk</div>}
        </div>

        <button
          onClick={onClose}
          className="ml-auto text-gray-300 hover:text-white text-sm"
          aria-label="toggle"
        >
          {open ? "«" : "»"}
        </button>
      </div>

      <nav className="mt-6 px-2">
        <ul className="space-y-1">
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
              <span className="text-xl">📊</span>
              {open && <span className="text-sm text-gray-200">Dashboard</span>}
            </a>
          </li>

          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
              <span className="text-xl">➕</span>
              {open && <span className="text-sm text-gray-200">Add Trade</span>}
            </a>
          </li>

          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
              <span className="text-xl">📥</span>
              {open && <span className="text-sm text-gray-200">Import CSV</span>}
            </a>
          </li>

          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
              <span className="text-xl">📁</span>
              {open && <span className="text-sm text-gray-200">Reports</span>}
            </a>
          </li>

          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
              <span className="text-xl">⚙️</span>
              {open && <span className="text-sm text-gray-200">Settings</span>}
            </a>
          </li>
        </ul>
      </nav>

      <div className="mt-auto px-4 py-4 border-t border-gray-800/30">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-gray-400">{open ? "Quick Stats" : "QS"}</div>
          <div className="text-right">
            <div className="text-sm font-semibold text-[#F5C518]">PnL</div>
            {open && <div className="text-sm text-gray-300">+1,234.56</div>}
          </div>
        </div>
      </div>
    </aside>
  );
}
