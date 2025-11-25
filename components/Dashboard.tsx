"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// ⛔ FIX: Chart must be dynamically imported to disable SSR
const Line = dynamic(() => import("react-chartjs-2").then(m => m.Line), {
  ssr: false,
})

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null)
  const [trades, setTrades] = useState<any[]>([])

  // Prevent SSR crash (Vercel static export)
  if (typeof window === "undefined") return null;

  const fetchData = async () => {
    const s = await axios.get('http://localhost:8000/api/summary')
    const t = await axios.get('http://localhost:8000/api/trades')
    setSummary(s.data)
    setTrades(t.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const chartData = () => {
    const byTime = [...trades].sort(
      (a, b) =>
        new Date(a.exit_time).getTime() -
        new Date(b.exit_time).getTime()
    )
    let cum = 0
    const labels: string[] = []
    const data: number[] = []

    byTime.forEach((tr: any) => {
      cum += tr.pnl
      labels.push(new Date(tr.exit_time).toLocaleDateString())
      data.push(cum)
    })

    return { labels, data }
  }

  const d = chartData()

  return (
    <div className="p-6">

      {/* Header */}
      <h2 className="text-4xl font-extrabold tracking-tight mb-8">
        📊 Performance Dashboard
      </h2>

      {/* Stats Card Grid */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total PnL', value: summary.total_pnl.toFixed(2) },
            { label: 'Total Trades', value: summary.num_trades },
            { label: 'Win Rate', value: summary.win_rate.toFixed(2) + '%' },
            {
              label: 'Avg Win / Avg Loss',
              value:
                summary.avg_win.toFixed(2) +
                ' / ' +
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

      {/* Equity Curve Chart */}
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
                  label: 'Equity Over Time',
                  data: d.data,
                  borderColor: '#2563eb',
                  backgroundColor: 'rgba(37, 99, 235, 0.2)',
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
                x: { ticks: { color: '#555' } },
                y: { ticks: { color: '#555' } },
              },
            }}
          />
        </div>
      </div>

      {/* Recent Trades Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">
          📄 Recent Trades
        </h3>

        <div className="overflow-x-auto">
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
                    <td className="border px-4 py-2">
                      {t.size}
                    </td>
                    <td
                      className={`border px-4 py-2 font-semibold ${
                        t.pnl > 0
                          ? 'text-green-600'
                          : 'text-red-600'
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
    </div>
  )
}
