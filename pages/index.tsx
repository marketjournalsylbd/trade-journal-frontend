import React, { useState } from "react";
import UploadCSV from "../components/UploadCSV";
import Dashboard from "../components/Dashboard";
import AddTrade from "../components/AddTrade";

export default function Home() {
  const [reload, setReload] = useState(false);

  return (
    <main
      className="
      min-h-screen w-full relative overflow-hidden
      bg-gradient-to-br from-[#0a0f1f] via-[#0e1426] to-[#0a0f1f]
      text-gray-100 px-6 py-12
    "
    >
      {/* Background Aurora Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-10 w-[420px] h-[420px] bg-cyan-400/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[460px] h-[460px] bg-blue-500/20 blur-[170px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-500/10 blur-[180px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
        <h1
          className="
          text-6xl font-extrabold tracking-tight leading-tight
          bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400
          bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,200,255,0.45)]
        "
        >
          Personal Trade Journal
        </h1>

        <p className="text-gray-300 mt-4 text-lg opacity-90">
          Import trades, log positions & visualize performance with a professional dashboard.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">

        {/* Upload CSV */}
        <div className="md:col-span-1">
          <div
            className="
            rounded-2xl p-6
            border border-cyan-500/10
            bg-white/10 backdrop-blur-xl
            shadow-[0_0_40px_rgba(0,255,255,0.10)]
            hover:shadow-[0_0_55px_rgba(0,255,255,0.18)]
            transition-all duration-300
          "
          >
            <UploadCSV onImported={() => setReload(!reload)} />
          </div>
        </div>

        {/* Add Trade */}
        <div className="md:col-span-1">
          <div
            className="
            rounded-2xl p-6
            border border-emerald-500/10
            bg-white/10 backdrop-blur-xl
            shadow-[0_0_40px_rgba(0,255,180,0.10)]
            hover:shadow-[0_0_55px_rgba(0,255,180,0.20)]
            transition-all duration-300
          "
          >
            <AddTrade onAdded={() => setReload(!reload)} />
          </div>
        </div>

        {/* Dashboard */}
        <div className="md:col-span-2">
          <div
            className="
            rounded-2xl p-6
            border border-blue-400/10
            bg-white/10 backdrop-blur-2xl
            shadow-[0_0_40px_rgba(80,150,255,0.12)]
            hover:shadow-[0_0_60px_rgba(80,150,255,0.25)]
            transition-all duration-300
          "
          >
            <Dashboard key={String(reload)} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-20 relative z-10 opacity-80 text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Personal Trading Journal — Built for Traders ⚡</p>
      </footer>
    </main>
  );
}
