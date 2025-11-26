import React, { useState } from "react";
import UploadCSV from "../components/UploadCSV";
import Dashboard from "../components/Dashboard";
import AddTrade from "../components/AddTrade";
import { motion } from "framer-motion";

export default function Home() {
  const [reload, setReload] = useState(false);

  return (
    <main
      className="
      min-h-screen w-full relative overflow-hidden
      bg-gradient-to-b from-[#070b16] via-[#0c1224] to-[#060a14]
      text-gray-100 px-6 py-16
    "
    >
      {/* AURORA BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-10 left-20 w-[480px] h-[480px] bg-cyan-400/25 blur-[160px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-[520px] h-[520px] bg-indigo-500/20 blur-[200px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-[360px] h-[360px] bg-purple-500/10 blur-[180px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto text-center mb-20 relative z-10"
      >
        <h1
          className="
          text-6xl font-extrabold tracking-tight leading-tight
          bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400
          bg-clip-text text-transparent
          drop-shadow-[0_0_25px_rgba(0,200,255,0.45)]
        "
        >
          Personal Trade Journal
        </h1>

        <p className="text-gray-300 mt-4 text-lg opacity-90 max-w-2xl mx-auto">
          Import trades, log positions & visualize your market performance — all in one sleek dashboard.
        </p>
      </motion.div>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">

        {/* CSV CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-1"
        >
          <div
            className="
            rounded-2xl p-6 backdrop-blur-2xl
            bg-white/10 border border-cyan-400/20
            shadow-[0_0_40px_rgba(0,255,255,0.10)]
            hover:shadow-[0_0_55px_rgba(0,255,255,0.18)]
            transition-all duration-300
          "
          >
            <UploadCSV onImported={() => setReload(!reload)} />
          </div>
        </motion.div>

        {/* ADD TRADE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:col-span-1"
        >
          <div
            className="
            rounded-2xl p-6 backdrop-blur-2xl
            bg-white/10 border border-emerald-400/20
            shadow-[0_0_40px_rgba(0,255,180,0.10)]
            hover:shadow-[0_0_55px_rgba(0,255,180,0.20)]
            transition-all duration-300
          "
          >
            <AddTrade onAdded={() => setReload(!reload)} />
          </div>
        </motion.div>

        {/* DASHBOARD CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-2"
        >
          <div
            className="
            rounded-2xl p-6 backdrop-blur-2xl
            bg-white/10 border border-blue-300/20
            shadow-[0_0_40px_rgba(80,150,255,0.12)]
            hover:shadow-[0_0_60px_rgba(80,150,255,0.25)]
            transition-all duration-300
          "
          >
            <Dashboard key={String(reload)} />
          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="text-center mt-20 relative z-10 opacity-80 text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Personal Trading Journal — Designed for Traders ⚡</p>
      </footer>
    </main>
  );
}
