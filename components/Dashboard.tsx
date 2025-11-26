"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import TradeTable from "./TradeTable";
import Footer from "./Footer";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), {
  ssr: false,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);

  if (typeof window === "undefined") return null;

  const fetchData = async () => {
    try {
      const s = await axios.get(`${API_URL}/api/summary`);
      const t = await axios.get(`${API_URL}/api/trades`);

      setSummary(s.data);
      setTrades(t.data);
    } catch (err) {
      console.error("API Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = () => {
    const sorted = [...trades].sort(
      (a, b) =>
        new Date(a.exit_time).getTime() - new Date(b.exit_time).getTime()
    );

    let cum = 0;
    const labels: string[] = [];
    const data: number[] = [];

    sorted.forEach((tr: any) => {
      cum += tr.pnl;
      labels.push(new Date(tr.exit_time).toLocaleDateString());
      data.push(cum);
    });

    return { labels, data };
  };

  const d = chartData();

  return (
    <div className="p-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white">

      {/* Title */}
      <h2 className="text-4xl font-extrabold tracking-tight mb-10 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Performance Dashboard
      </h2>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total PnL", value: summary.total_pnl.toFixed(2) },
            { label: "Total Trades", value: summary.num_trades },
            {
              label: "Win Rate",
              value: summary.win_rate.toFixed(2) + "%",
            },
            {
              label: "Avg Win / Avg Loss",
              value:
                summary.avg_win.toFixed(2) +
                " / " +
                summary.avg_loss.toFixed(2),
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-lg bg-white/10 backdrop-blur-xl border border-white/20 hover:scale-[1.02] transition duration-300"
            >
              <p className="text-gray-300 text-sm">{card.label}</p>
              <p className="text-3xl font-bold mt-2 text-cyan-300">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Equity Curve */}
      <div className="mb-12 bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20">
        <h3 className="text-2xl font-semibold mb-6 text-cyan-300">
          Equity Curve
        </h3>

        <div className="max-w-3xl">
          <Line
            data={{
              labels: d.labels,
              datasets: [
                {
                  label: "Equity Over Time",
                  data: d.data,
                  borderColor: "#22d3ee",
                  backgroundColor: "rgba(34, 211, 238, 0.15)",
                  borderWidth: 3,
                  tension: 0.3,
                  pointRadius: 3,
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: "#cbd5e1" } },
                y: { ticks: { color: "#cbd5e1" } },
              },
            }}
          />
        </div>
      </div>

      {/* Trade History Table */}
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20">
        <h3 className="text-2xl font-semibold mb-6 text-cyan-300">
          Recent Trades
        </h3>

        <TradeTable />

        <div className="overflow-x-auto mt-10 rounded-xl border border-white/20">
          <table className="w-full bg-white/5 backdrop-blur-xl">
            <thead>
              <tr className="bg-white/10">
                <th className="px-4 py-3 text-left text-sm text-gray-300">Symbol</th>
                <th className="px-4 py-3 text-left text-sm text-gray-300">Entry</th>
                <th className="px-4 py-3 text-left text-sm text-gray-300">Exit</th>
                <th className="px-4 py-3 text-left text-sm text-gray-300">Size</th>
                <th className="px-4 py-3 text-left text-sm text-gray-300">PnL</th>
              </tr>
            </thead>

            <tbody>
              {trades
                .slice()
                .reverse()
                .slice(0, 20)
                .map((t) => (
                  <tr key={t.id} className="hover:bg-white/10 transition">
                    <td className="px-4 py-3">{t.symbol}</td>
                    <td className="px-4 py-3">
                      {new Date(t.entry_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(t.exit_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{t.size}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        t.pnl > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {t.pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer
        summary={summary || { total_pnl: 0, win_rate: 0, num_trades: 0 }}
        trades={trades}
      />
    </div>
  );
}
