// pages/index.tsx
import React, { useState } from "react";
import UploadCSV from "../components/UploadCSV";
import Dashboard from "../components/Dashboard";
import AddTrade from "../components/AddTrade";
import Layout from "../components/Layout";

export default function HomePage() {
  const [reload, setReload] = useState(false);

  return (
    <Layout>
      {/* Top summary row (optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
      </div>

      {/* Main grid: left controls + right dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
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

        {/* Right column */}
        <div className="col-span-2">
          <div className="rounded-lg p-5 bg-[#07101a] border border-gray-800/40 mb-6">
            <Dashboard key={String(reload)} />
          </div>

          <div className="rounded-lg p-4 bg-[#07101a] border border-gray-800/40">
            <h4 className="text-sm text-gray-300 font-semibold mb-3">Recent Trades</h4>
            {/* If you have TradeTable component, use it here */}
            {/* <TradeTable /> */}
            <div className="text-sm text-gray-400">Use TradeTable component here.</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
