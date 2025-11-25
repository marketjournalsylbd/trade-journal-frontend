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
    <div className="p-6 max-w-7xl mx-auto">

      {/* Title */}
      <h2 className="text-4xl font-extrabold tracking-tight mb-10 text-center md:text-left">
        📊 Performance Dashboard
      </h2>

      {/* Stats Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
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
              className="p-6 rounded-2xl shadow-lg bg-white/80 backdrop-blur-md border border-gray-200 flex flex-col justify-center"
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
      <div className="mb-14 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 text-center md:text-left">
          📈 Equity Curve
        </h3>

        <div className="max-w-4xl mx-auto">
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

      {/* Table Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 text-center md:text-left">
          📄 Recent Trades
        </h3>

        {/* FIX: duplicate fetch removed */}
        <TradeTable />

        <div className="overflow-x-auto mt-10">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-3 text-left text-sm text-gray-600">
                  Symbol
                </th>
                <th className="border px-4 py-3 text-left text-sm text-gray-600">
                  Entry
                </th>
                <th className="border px-4 py-3 text-left text-sm text-gray-600">
                  Exit
                </th>
                <th className="border px-4 py-3 text-left text-sm text-gray-600">
                  Size
                </th>
                <th className="border px-4 py-3 text-left text-sm text-gray-600">
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
                    <td className="border px-4 py-3">{t.symbol}</td>
                    <td className="border px-4 py-3">
                      {new Date(t.entry_time).toLocaleString()}
                    </td>
                    <td className="border px-4 py-3">
                      {new Date(t.exit_time).toLocaleString()}
                    </td>
                    <td className="border px-4 py-3">{t.size}</td>
                    <td
                      className={`border px-4 py-3 font-semibold ${
                        t.pnl > 0 ? "text-green-600" : "text-red-600"
                        {/* Footer */}
<div className="mt-20 w-full pt-10 border-t border-gray-200">
  <div className="flex flex-col items-center">

    <p className="text-gray-600 text-sm mb-4">
      Follow me on social media
    </p>

    <div className="flex gap-5">
      {/* Facebook */}
      <a
        href="https://facebook.com"
        target="_blank"
        className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg hover:scale-110"
      >
        <i className="fa-brands fa-facebook-f text-lg"></i>
      </a>

      {/* Instagram */}
      <a
        href="https://instagram.com"
        target="_blank"
        className="p-3 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 text-white transition-all shadow-lg hover:scale-110 hover:opacity-90"
      >
        <i className="fa-brands fa-instagram text-lg"></i>
      </a>

      {/* Twitter/X */}
      <a
        href="https://twitter.com"
        target="_blank"
        className="p-3 rounded-full bg-black text-white hover:bg-gray-800 transition-all shadow-lg hover:scale-110"
      >
        <i className="fa-brands fa-x-twitter text-lg"></i>
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/yourNumber"
        target="_blank"
        className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg hover:scale-110"
      >
        <i className="fa-brands fa-whatsapp text-lg"></i>
      </a>
    </div>

    <p className="text-gray-400 text-xs mt-5">
      © {new Date().getFullYear()} Trade Journal — All Rights Reserved
    </p>
  </div>
</div>  }`}              >
                      {t.pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
