import React, { useState } from "react";
import "./globals.css";
import UploadCSV from "../components/UploadCSV";
import Dashboard from "../components/Dashboard";
import AddTrade from "../components/AddTrade";

export default function Home() {
  const [reload, setReload] = useState(false);

  return (
    <main
      className="
        min-h-screen w-full 
        bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950
        text-gray-100 py-14 px-6 
        relative overflow-hidden
      "
    >

      {/* 🌌 Ambient Glow Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-32 left-20 w-[420px] h-[420px] bg-cyan-400/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-24 right-24 w-[420px] h-[420px] bg-blue-500/20 blur-[160px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[600px] h-[600px] bg-purple-500/10 blur-[200px] rounded-full" />
      </div>

      {/* Title */}
      <div className="max-w-6xl mx-auto mb-16 text-center relative z-10">
        <h1
          className="
            text-6xl font-extrabold tracking-tight 
            bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-600 
            bg-clip-text text-transparent 
            drop-shadow-[0_0_30px_rgba(0,200,255,0.3)]
          "
        >
          📊 Personal Trade Journal
        </h1>

        <p className="text-gray-300 mt-4 text-lg opacity-80">
          Import trades, add manual entries & analyze everything in real-time.
        </p>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">

        {/* Upload CSV */}
        <div className="md:col-span-1">
          <div
            className="
              rounded-2xl p-6 
              bg-white/5 backdrop-blur-xl border border-white/10 
              shadow-[0_0_25px_rgba(0,255,255,0.08)]
              hover:shadow-[0_0_45px_rgba(0,255,255,0.18)]
              transition-all duration-300 group
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
              bg-white/5 backdrop-blur-xl border border-white/10 
              shadow-[0_0_25px_rgba(0,255,180,0.08)]
              hover:shadow-[0_0_45px_rgba(0,255,180,0.20)]
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
              bg-white/5 backdrop-blur-2xl border border-white/10 
              shadow-[0_0_25px_rgba(0,180,255,0.08)]
              hover:shadow-[0_0_45px_rgba(0,180,255,0.20)]
              transition-all duration-300
            "
          >
            <Dashboard key={String(reload)} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-400 text-sm relative z-10">
        <p className="opacity-70 hover:opacity-100 transition">
          © {new Date().getFullYear()} Personal Trading Journal — Powered by Discipline 📈
        </p>
      </footer>
    </main>
  );
}
