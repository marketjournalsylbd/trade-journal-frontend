import React, { useState } from "react";
import UploadCSV from "../components/UploadCSV";
import Dashboard from "../components/Dashboard";
import AddTrade from "../components/AddTrade";

export default function Home() {
  const [reload, setReload] = useState(false);

  return (
    <main className="
      min-h-screen w-full relative overflow-hidden 
      bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 
      text-gray-100 px-6 py-12
    ">
      
      {/* Floating Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-12 w-[380px] h-[380px] bg-blue-500/20 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-cyan-400/20 blur-[150px] rounded-full" />
      </div>

      {/* Page Title */}
      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <h1 className="
          text-5xl font-extrabold tracking-tight 
          bg-gradient-to-r from-cyan-300 to-blue-500 
          bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,200,255,0.35)]
        ">
          📊 Personal Trade Journal
        </h1>

        <p className="text-gray-300 mt-3 text-lg opacity-90">
          Import trades, log positions & monitor performance — all in one dashboard.
        </p>
      </div>

      {/* Layout Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">

        {/* Upload CSV */}
        <div className="md:col-span-1">
          <div className="
            rounded-2xl p-6 border border-cyan-500/10 
            bg-white/5 backdrop-blur-xl 
            shadow-[0_0_30px_rgba(0,255,255,0.08)] 
            hover:shadow-[0_0_35px_rgba(0,255,255,0.18)]
            transition-all duration-300
          ">
            <UploadCSV onImported={() => setReload(!reload)} />
          </div>
        </div>

        {/* Add Trade */}
        <div className="md:col-span-1">
          <div className="
            rounded-2xl p-6 border border-emerald-500/10 
            bg-white/5 backdrop-blur-xl 
            shadow-[0_0_30px_rgba(0,255,180,0.08)] 
            hover:shadow-[0_0_35px_rgba(0,255,180,0.18)]
            transition-all duration-300
          ">
            <AddTrade onAdded={() => setReload(!reload)} />
          </div>
        </div>

        {/* Dashboard */}
        <div className="md:col-span-2">
          <div className="
            rounded-2xl p-6 border border-blue-500/10 
            bg-white/5 backdrop-blur-2xl 
            shadow-[0_0_30px_rgba(0,180,255,0.08)] 
            hover:shadow-[0_0_35px_rgba(0,180,255,0.18)]
            transition-all duration-300
          ">
            <Dashboard key={String(reload)} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 relative z-10 opacity-70 text-sm">
        © {new Date().getFullYear()} Personal Trading Journal — Built with Discipline 📈
      </footer>
    </main>
  );
}
