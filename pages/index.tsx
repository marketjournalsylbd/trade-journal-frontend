import React, { useState } from "react";
import UploadCSV from "../components/UploadCSV";
import Dashboard from "../components/Dashboard";
import AddTrade from "../components/AddTrade";

export default function Home() {
  const [reload, setReload] = useState(false);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
      text-gray-100 py-12 px-6 relative overflow-hidden">

      {/* ✨ Floating Lights Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 blur-[140px] rounded-full" />
      </div>

      {/* Page Title */}
      <div className="max-w-6xl mx-auto mb-14 text-center relative z-10">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r 
          from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-xl">
          📊 Personal Trade Journal
        </h1>
        <p className="text-gray-300 mt-3 text-lg">
          Import trades, log positions & monitor performance — all in one dashboard.
        </p>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">

        {/* Upload CSV */}
        <div className="md:col-span-1">
          <div className="rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl 
            shadow-[0_0_25px_rgba(0,255,255,0.08)] hover:shadow-[0_0_35px_rgba(0,255,255,0.15)]
            transition-all duration-300">
            <UploadCSV onImported={() => setReload(!reload)} />
          </div>
        </div>

        {/* Add Trade */}
        <div className="md:col-span-1">
          <div className="rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl 
            shadow-[0_0_25px_rgba(0,255,180,0.08)] hover:shadow-[0_0_35px_rgba(0,255,180,0.15)]
            transition-all duration-300">
            <AddTrade onAdded={() => setReload(!reload)} />
          </div>
        </div>

        {/* Dashboard */}
        <div className="md:col-span-2">
          <div className="rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-2xl 
            shadow-[0_0_25px_rgba(0,180,255,0.08)] hover:shadow-[0_0_35px_rgba(0,180,255,0.15)]
            transition-all duration-300">
            <Dashboard key={String(reload)} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-14 text-center text-gray-400 text-sm relative z-10">
        <p className="opacity-80">
          © {new Date().getFullYear()} Personal Trading Journal — Powered by Discipline 📈
        </p>
      </footer>
    </main>
  );
}
