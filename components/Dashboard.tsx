"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import TradeTable from "./TradeTable";
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

// ⛔ FIX: dynamic import to avoid SSR crash
const Line = dynamic(() => import("react-chartjs-2").then((m) => m.Line), {
  ssr: false,
});

// ⛔ FIX: API BASE URL — from env
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
        new Date(a.exit_time).getTime() -
        new Date(b.exit_time).getTime()
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
    <div className="p-6">
      <h2 className="text-4xl font-extrabold tracking-tight mb-8">
        📊 Performance Dashboard
      </h2>

      {/* Stats Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
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
              className="p-6 rounded-2xl shadow-lg bg-white/70 backdrop-blur-md border border-gray-200"
            >
              <p className="text-gray-600 text-sm tracking-wide">
                {card.label}
              </p>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Equity Curve */}
      <div className="mb-12 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">
          📈 Equity Curve
        </h3>

        <div className="max-w-3xl">
          <Line
            data={{
              labels: d.labels,
              datasets: [
                {
                  label: "Equity Over Time",
                  data: d.data,
                  borderColor: "#2563eb",
                  backgroundColor: "rgba(37, 99, 235, 0.2)",
                  borderWidth: 3,
                  tension: 0.25,
                  pointRadius: 3,
                },
              ],
            }}
            options={{
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: { ticks: { color: "#555" } },
                y: { ticks: { color: "#555" } },
              },
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">
          📄 Recent Trades
        </h3>

        <TradeTable />

        <div className="overflow-x-auto mt-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left text-sm text-gray-600">
                  Symbol
                </th>
                <th className="border px-4 py-2 text-left text-sm text-gray-600">
                  Entry
                </th>
                <th className="border px-4 py-2 text-left text-sm text-gray-600">
                  Exit
                </th>
                <th className="border px-4 py-2 text-left text-sm text-gray-600">
                  Size
                </th>
                <th className="border px-4 py-2 text-left text-sm text-gray-600">
                  PnL
                </th>
              </tr>
            </thead>

            <tbody>
              {trades
                .slice()
                .reverse()
                .slice(0, 20)
                .map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="border px-4 py-2">{t.symbol}</td>
                    <td className="border px-4 py-2">
                      {new Date(t.entry_time).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(t.exit_time).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">{t.size}</td>
                    <td
                      className={`border px-4 py-2 font-semibold ${
                        t.pnl > 0 ? "text-green-600" : "text-red-600"
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

      {/* 🌟 FOOTER UPGRADE 6 */}
      <footer className="mt-16 bg-white/70 backdrop-blur-xl border border-gray-300 rounded-2xl shadow-lg p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Branding */}
          <div>
            <h2 className="text-2xl font-bold mb-2">📈 TradeTracker</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              A clean & modern dashboard to manage and analyze your trading performance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="hover:text-blue-600 cursor-pointer">Dashboard</li>
              <li className="hover:text-blue-600 cursor-pointer">Add Trade</li>
              <li className="hover:text-blue-600 cursor-pointer">Reports</li>
              <li className="hover:text-blue-600 cursor-pointer">Settings</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>

            <div className="flex items-center gap-4 mt-2">
              <a className="text-blue-600 hover:text-blue-800 text-xl" href="#">📘</a>
              <a className="text-pink-600 hover:text-pink-800 text-xl" href="#">📸</a>
              <a className="text-black hover:text-gray-700 text-xl" href="#">🐦</a>
              <a className="text-green-600 hover:text-green-800 text-xl" href="#">💬</a>
            </div>
          </div>

        </div>

        <div className="text-center text-gray-700 text-sm pt-8 border-t mt-10">
          © {new Date().getFullYear()} TradeTracker — All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
