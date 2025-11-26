import React, { useState } from "react";
import Layout from "../components/Layout";
import UploadCSV from "../components/UploadCSV";
import Dashboard from "../components/Dashboard";
import AddTrade from "../components/AddTrade";

export default function Home() {
  const [reload, setReload] = useState(false);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-6 text-gray-900">

      {/* Page Title */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          📊 Personal Trade Journal
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Import your trades and analyze performance with clean insights.
        </p>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left – Upload CSV Card */}
        <div className="md:col-span-1">
          <div className="rounded-2xl shadow-xl bg-white/80 backdrop-blur-lg p-6 border border-gray-200">
            <UploadCSV onImported={() => setReload(!reload)} />
          </div>
        </div>

        <div className="md:col-span-1">
          <AddTrade onAdded={() => setReload(!reload)} />
        </div>

        {/* Right – Dashboard Area */}
        <div className="md:col-span-2">
          <div className="rounded-2xl shadow-xl bg-white/80 backdrop-blur-lg p-6 border border-gray-200">
            <Dashboard key={String(reload)} />
          </div>
        </div>
</Layout>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Personal Trading Journal. All rights reserved.
      </footer>
    </main>
  );
}
