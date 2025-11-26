import React, { useState } from "react";
import UploadCSV from "../components/UploadCSV";
import Dashboard from "../components/Dashboard";
import AddTrade from "../components/AddTrade";

export default function Home() {
  const [reload, setReload] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-[#05060a] text-gray-100">
      {/* ---------------- Sidebar ---------------- */}
      <aside
        className={`
          transition-all duration-300
          ${sidebarOpen ? "w-72" : "w-16"}
          bg-gradient-to-b from-[#07080d] to-[#08101a] border-r border-gray-800/40
          flex flex-col
        `}
      >
        <div className="px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5C518] rounded-sm grid place-items-center font-bold text-black">
              T
            </div>
            {sidebarOpen && (
              <div>
                <div className="text-lg font-bold">TradeDesk</div>
                <div className="text-xs text-gray-400">Personal Journal</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white p-1"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "«" : "»"}
          </button>
        </div>

        <nav className="mt-6 px-2 flex-1">
          <ul className="space-y-1">
            <li>
              <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
                <span className="text-xl">📊</span>
                {sidebarOpen && <span className="text-sm">Dashboard</span>}
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
                <span className="text-xl">➕</span>
                {sidebarOpen && <span className="text-sm">Add Trade</span>}
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
                <span className="text-xl">📥</span>
                {sidebarOpen && <span className="text-sm">Import CSV</span>}
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
                <span className="text-xl">📁</span>
                {sidebarOpen && <span className="text-sm">Reports</span>}
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5">
                <span className="text-xl">⚙️</span>
                {sidebarOpen && <span className="text-sm">Settings</span>}
              </a>
            </li>
          </ul>
        </nav>

        <div className="px-4 py-4 border-t border-gray-800/30">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-gray-400">{sidebarOpen ? "Quick Stats" : "QS"}</div>
            <div className="text-right">
              <div className="text-sm font-semibold text-[#F5C518]">PnL</div>
              {sidebarOpen && <div className="text-sm text-gray-300">+1,234.56</div>}
            </div>
          </div>
        </div>
      </aside>

      {/* ---------------- Main content ---------------- */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800/40 bg-[#060812]/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-white/5"
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
              <button className="text-sm px-2 py-1 rounded-md bg-[#F5C518] text-black font-semibold">Search</button>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-2 rounded-md hover:bg-white/5 text-sm">Docs</button>
              <div className="w-9 h-9 bg-white/5 rounded-full grid place-items-center text-sm">U</div>
            </div>
          </div>
        </header>

        {/* Page container */}
        <main className="p-6 overflow-auto">
          <div className="max-w-full mx-auto">
            {/* Top cards row */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="p-4 rounded-lg bg-[#0a0c10] border border-gray-800/40">
                <div className="text-xs text-gray-400">Total PnL</div>
                <div className="text-2xl font-bold text-[#34d399]">+1,234.56</div>
                <div className="text-xs text-gray-500 mt-2">Since inception</div>
              </div>

              <div className="p-4 rounded-lg bg-[#0a0c10] border border-gray-800/40">
                <div className="text-xs text-gray-400">Trades</div>
                <div className="text-2xl font-bold text-[#F5C518]">124</div>
                <div className="text-xs text-gray-500 mt-2">All time</div>
              </div>

              <div className="p-4 rounded-lg bg-[#0a0c10] border border-gray-800/40">
                <div className="text-xs text-gray-400">Win Rate</div>
                <div className="text-2xl font-bold text-[#60a5fa]">62%</div>
                <div className="text-xs text-gray-500 mt-2">Winning trades</div>
              </div>

              <div className="p-4 rounded-lg bg-[#0a0c10] border border-gray-800/40">
                <div className="text-xs text-gray-400">Avg PnL</div>
                <div className="text-2xl font-bold text-[#f87171]">−12.34</div>
                <div className="text-xs text-gray-500 mt-2">Per trade</div>
              </div>
            </section>

            {/* Main grid: left controls + right dashboard */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: Upload + Add */}
              <div className="col-span-1 space-y-6">
                <div className="rounded-lg p-5 bg-[#07101a] border border-gray-800/40">
                  <h4 className="text-sm text-gray-300 font-semibold mb-3">Import CSV</h4>
                  <UploadCSV onImported={() => setReload(!reload)} />
                </div>

                <div className="rounded-lg p-5 bg-[#07101a] border border-gray-800/40">
                  <h4 className="text-sm text-gray-300 font-semibold mb-3">Add Trade</h4>
                  <AddTrade onAdded={() => setReload(!reload)} />
                </div>
              </div>

              {/* Right column: Dashboard */}
              <div className="col-span-2">
                <div className="rounded-lg p-5 bg-[#07101a] border border-gray-800/40 mb-6">
                  <Dashboard key={String(reload)} />
                </div>

                {/* Recent trades table (smaller) */}
                <div className="rounded-lg p-4 bg-[#07101a] border border-gray-800/40">
                  <h4 className="text-sm text-gray-300 font-semibold mb-3">Recent Trades</h4>
                  <div className="overflow-auto">
                    {/* reuse TradeTable component if you want; here keep a simple table */}
                    <table className="w-full text-left text-sm">
                      <thead className="text-gray-400 text-xs uppercase">
                        <tr>
                          <th className="py-2 pr-4">Symbol</th>
                          <th className="py-2 pr-4">Entry</th>
                          <th className="py-2 pr-4">Exit</th>
                          <th className="py-2 pr-4">Size</th>
                          <th className="py-2 pr-4">PnL</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-200">
                        {/* keep logic same: ideally you import TradeTable; for now show placeholder rows */}
                        <tr className="border-t border-gray-800/30">
                          <td className="py-3">BTCUSD</td>
                          <td className="py-3">2025-11-20</td>
                          <td className="py-3">2025-11-21</td>
                          <td className="py-3">0.01</td>
                          <td className="py-3 text-[#34d399]">+45.50</td>
                        </tr>
                        <tr className="border-t border-gray-800/30">
                          <td className="py-3">ETHUSD</td>
                          <td className="py-3">2025-11-10</td>
                          <td className="py-3">2025-11-12</td>
                          <td className="py-3">0.2</td>
                          <td className="py-3 text-[#f87171]">−12.30</td>
                        </tr>
                        {/* for real data, use your TradeTable component */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
