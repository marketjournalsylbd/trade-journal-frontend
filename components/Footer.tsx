"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function Footer({
  summary = { total_pnl: 0, win_rate: 0, num_trades: 0 },
  trades = [],
}) {
  const [newsIndex, setNewsIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const newsList = [
    "📈 EURUSD pushes higher with strong daily momentum.",
    "🔥 BTC consolidates before major breakout zone.",
    "📰 Fed signals shift toward easing cycle.",
    "💡 Gold strength continues despite volatility.",
  ];

  const tips = [
    "Your edge is consistency — protect it.",
    "Focus on high-quality setups, not frequency.",
    "A disciplined trader beats a smart trader.",
    "Control risk, and profits take care of themselves.",
  ];

  useEffect(() => {
    const newsTimer = setInterval(() => {
      setNewsIndex((p) => (p + 1) % newsList.length);
    }, 4500);

    const tipTimer = setInterval(() => {
      setTipIndex((p) => (p + 1) % tips.length);
    }, 6500);

    return () => {
      clearInterval(newsTimer);
      clearInterval(tipTimer);
    };
  }, []);

  // Sparkline
  const sparkData = () => {
    let cum = 0;
    const sorted = [...trades].sort(
      (a, b) => new Date(a.exit_time).getTime() - new Date(b.exit_time).getTime()
    );
    return sorted.map((t) => {
      cum += t.pnl;
      return cum;
    });
  };

  const spark = {
    labels: sparkData().map((_, i) => i),
    datasets: [
      {
        data: sparkData(),
        borderWidth: 2,
        borderColor: "#00f2ff",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  return (
    <footer className="relative mt-20 p-10 rounded-t-3xl overflow-hidden">
      
      {/* 🌌 Particle Field Background */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,255,250,0.25),transparent_70%)]" />
      <div className="absolute inset-0 particle-field pointer-events-none" />

      {/* 🔷 Holographic grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px] z-0" />

      <div className="relative z-10">
        {/* 🔥 HOLOGRAM TICKER */}
        <div className="overflow-hidden whitespace-nowrap border-y py-4 
          bg-white/10 backdrop-blur-2xl rounded-xl shadow-[0_0_20px_rgba(0,255,250,0.4)] mb-10">
          
          <div className="animate-marquee text-lg font-semibold text-cyan-300 flex gap-20 uppercase tracking-wide">
            <span>💰 Total PnL: {summary.total_pnl.toFixed(2)}</span>
            <span>📊 Win Rate: {summary.win_rate.toFixed(2)}%</span>
            <span>📘 Trades Logged: {summary.num_trades}</span>
            <span>🚀 System active — trading environment stable.</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* News Feed */}
          <div className="holo-card">
            <h4 className="holo-title">📰 Live Market News</h4>
            <div className="h-24 overflow-hidden relative">
              <div
                className="absolute w-full transition-all duration-700"
                style={{ top: `-${newsIndex * 26}px` }}
              >
                {newsList.map((n, i) => (
                  <p key={i} className="h-7 text-sm text-cyan-200">{n}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Sparkline */}
          <div className="holo-card">
            <h4 className="holo-title">📉 Micro Equity Curve</h4>
            <div className="h-20">
              <Line
                data={spark}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            </div>
          </div>

          {/* AI Tip */}
          <div className="holo-card">
            <h4 className="holo-title">🤖 AI Insight</h4>
            <p className="text-cyan-100 text-sm h-14 transition-all duration-500 mt-1">
              {tips[tipIndex]}
            </p>
          </div>

          {/* Social Orbs */}
          <div className="holo-card">
            <h4 className="holo-title">🌐 Connect</h4>

            <div className="flex gap-4 mt-5">
              <SocialOrb color="blue" label="FB" url="https://facebook.com" />
              <SocialOrb color="pink" label="IG" url="https://instagram.com" />
              <SocialOrb color="black" label="X" url="https://x.com" />
              <SocialOrb color="green" label="WA" url="https://wa.me/" />
            </div>
          </div>

        </div>

        {/* 🛸 Warp Button */}
        <button
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="mx-auto mt-12 block px-10 py-3 bg-cyan-500/20 border border-cyan-300
          text-cyan-100 rounded-full shadow-[0_0_20px_rgba(0,255,255,0.5)]
          backdrop-blur-xl hover:scale-110 hover:bg-cyan-500/40 transition-all"
        >
          🛸 Warp to Top
        </button>
      </div>
    </footer>
  );
}

function SocialOrb({
  color,
  url,
  label,
}: {
  color: string;
  url: string;
  label: string;
}) {
  const bgColor =
    color === "blue"
      ? "bg-blue-600"
      : color === "pink"
      ? "bg-pink-600"
      : color === "black"
      ? "bg-black"
      : "bg-green-600";

  return (
    <Link href={url} target="_blank">
      <div
        className={`w-12 h-12 ${bgColor} text-white grid place-items-center 
        rounded-full shadow-[0_0_20px_rgba(0,255,255,0.4)]
        transition-transform hover:scale-125 cursor-pointer`}
      >
        {label}
      </div>
    </Link>
  );
}
