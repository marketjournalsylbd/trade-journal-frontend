import React, { useState } from "react";
import UploadCSV from "../components/UploadCSV";
import Dashboard from "../components/Dashboard";
import AddTrade from "../components/AddTrade";

export default function Home() {
  const [reload, setReload] = useState(false);

  return (
    <main className="
      min-h-screen w-full 
      bg-gradient-to-br from-[#0a0f1f] via-[#0d1428] to-[#0a0f1f]
      text-gray-100 py-16 px-6 relative overflow-hidden
    ">

      {/* Floating Ambient Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-0 w-[450px] h-[450px] 
            bg-cyan-500/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] 
            bg-blue-600/20 blur-[160px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[650px] h-[650px] bg-purple-500/10 blur-[180px] rounded-full" />
      </div>

      {/* Page Title */}
      <div className="max-w-6xl mx-auto mb-16 text-center relative z-10">
        <h1 className="
          text-6xl font-extrabold tracking-tight 
          bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-300 
          bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(0,150,255,0.5)]
        ">
          📊 Personal Trade Journal
        </h1>

        <p className="text-gray-300 mt-4 text-xl opacity-90">
          Upload trades, track performance & grow as a disciplined trader.
        </p>
      </div>

      {/* Main Layout */}
      <div className="
        max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10
        relative z-10
      ">

        {/* Upload CSV */}
        <div className="md:col-span-1">
          <div className="
            rounded-2xl p-7 border border-white/10 bg-white/5 backdrop-blur-xl 
            shadow-[0_0_35px_rgba(0,255,255,0.12)]
            hover:shadow-[0_0_50px_rgba(0,255,255,0.2)]
            hover:bg-white/10
            transition-all duration-300
          ">
            <UploadCSV onImported={() => setReload(!reload)} />
          </div>
        </div>

        {/* Add Trade Manually */}
        <div className="md:col-span-1">
          <div className="
            rounded-2xl p-7 border border-white/10 bg-white/5 backdrop-blur-xl 
            shadow-[0_0_35px_rgba(0,255,180,0.12)]
            hover:shadow-[0_0_50px_rgba(0,255,180,0.2)]
            hover:bg-white/10
            transition-all duration-300
          ">
            <AddTrade onAdded={() => setReload(!reload)} />
          </div>
        </div>

        {/* Dashboard */}
        <div className="md:col-span-2">
          <div className="
            rounded-2xl p-7 border border-white/10 bg-white/5 backdrop-blur-2xl 
            shadow-[0_0_40px_rgba(0,180,255,0.12)]
            hover:shadow-[0_0_60px_rgba(0,180,255,0.2)]
            hover:bg-white/10
            transition-all duration-300
          ">
            <Dashboard key={String(reload)} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-400 text-sm relative z-10">
        <p className="opacity-70 tracking-wide">
          © {new Date().getFullYear()} Personal Trading Journal — 
          <span className="text-cyan-300"> Stay Disciplined. Trade Smart. </span>
        </p>
      </footer>

    </main>
  );
}
