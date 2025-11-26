// components/TradeTable.tsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

type Trade = {
  id: number;
  symbol: string;
  entry_price: number;
  exit_price: number;
  size: number;
  fees: number;
  pnl: number;

  // ➕ NEW FIELD
  direction: "BUY" | "SELL";

  strategy?: string | null;
  notes?: string | null;
  entry_time?: string | null;
  exit_time?: string | null;
  created_at?: string | null;
};

type SortKey = keyof Trade | null;
type SortDir = "asc" | "desc" | null;

export default function TradeTable({ reload }: { reload?: boolean }) {
  const API = process.env.NEXT_PUBLIC_API_URL || "";
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search / filter
  const [query, setQuery] = useState("");
  const [filterStrategy, setFilterStrategy] = useState<string>("all");

  // Sorting
  const [sortKey, setSortKey] = useState<SortKey>("exit_price");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const perPageOptions = [10, 20, 50];
  const [perPage, setPerPage] = useState<number>(10);

  // Modal states
  const [selected, setSelected] = useState<Trade | null>(null);
  const [editing, setEditing] = useState<Trade | null>(null);
  const [busyAction, setBusyAction] = useState<boolean>(false);

  const fetchTrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/api/trades`);
      setTrades(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to load trades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [reload]);

  // Strategies list
  const strategies = useMemo(() => {
    const s = new Set<string>();
    trades.forEach((t) => t.strategy && s.add(t.strategy));
    return Array.from(s);
  }, [trades]);

  // Filtering + sorting + pagination
  const processed = useMemo(() => {
    let out = trades.slice();

    // Search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((t) =>
        (t.symbol || "").toLowerCase().includes(q) ||
        (t.strategy || "").toLowerCase().includes(q) ||
        (t.notes || "").toLowerCase().includes(q) ||
        t.direction.toLowerCase().includes(q) // NEW
      );
    }

    // Filter strategy
    if (filterStrategy !== "all") {
      out = out.filter((t) => t.strategy === filterStrategy);
    }

    // Sort
    if (sortKey && sortDir) {
      out.sort((a: any, b: any) => {
        const av = a[sortKey];
        const bv = b[sortKey];

        if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    return out;
  }, [trades, query, filterStrategy, sortKey, sortDir]);

  const total = processed.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageData = processed.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) return setSortKey(key), setSortDir("asc");
    if (sortDir === "asc") return setSortDir("desc");
    if (sortDir === "desc") return setSortKey(null), setSortDir(null);
  };

  // Export CSV
  const exportCSV = () => {
    const rows = processed.map((t) => ({
      id: t.id,
      symbol: t.symbol,
      direction: t.direction, // NEW
      entry_price: t.entry_price,
      exit_price: t.exit_price,
      size: t.size,
      fees: t.fees,
      pnl: t.pnl,
      notes: t.notes || "",
      strategy: t.strategy || "",
    }));

    const cols = Object.keys(rows[0] || {});
    const csv = [
      cols.join(","),
      ...rows.map((r) => cols.map((c) => JSON.stringify((r as any)[c])).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "trades.csv";
    a.click();
  };

  // Delete
  const deleteTrade = async (id: number) => {
    if (!confirm("Delete this trade?")) return;
    setBusyAction(true);
    try {
      await axios.delete(`${API}/api/trades/${id}`);
      await fetchTrades();
    } finally {
      setBusyAction(false);
    }
  };

  // Save Edit
  const saveEdit = async (payload: any) => {
    setBusyAction(true);
    try {
      await axios.put(`${API}/api/trades/${payload.id}`, payload);
      await fetchTrades();
      setEditing(null);
    } finally {
      setBusyAction(false);
    }
  };

  return (
    <div className="w-full">
      {/* ---------- Header Controls ---------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <input
            className="px-3 py-2 rounded-lg border w-72"
            placeholder="Search symbol, notes, direction..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            value={filterStrategy}
            onChange={(e) => setFilterStrategy(e.target.value)}
            className="px-3 py-2 rounded-lg border"
          >
            <option value="all">All strategies</option>
            {strategies.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setQuery("");
              setFilterStrategy("all");
              setSortKey("exit_price");
              setSortDir("desc");
            }}
            className="px-3 py-2 bg-gray-100 rounded-lg border"
          >
            Reset
          </button>
        </div>

        <button
          onClick={exportCSV}
          className="px-3 py-2 bg-green-600 text-white rounded-lg"
        >
          Export CSV
        </button>
      </div>

      {/* ---------- Table ---------- */}
      <div className="bg-white rounded-xl shadow ring-1 ring-black/5 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader name="Symbol" sortKey="symbol" curKey={sortKey} curDir={sortDir} onClick={() => toggleSort("symbol")} />
              <TableHeader name="Direction" sortKey="direction" curKey={sortKey} curDir={sortDir} onClick={() => toggleSort("direction")} />
              <TableHeader name="Entry" sortKey="entry_price" curKey={sortKey} curDir={sortDir} onClick={() => toggleSort("entry_price")} />
              <TableHeader name="Exit" sortKey="exit_price" curKey={sortKey} curDir={sortDir} onClick={() => toggleSort("exit_price")} />
              <TableHeader name="Size" sortKey="size" curKey={sortKey} curDir={sortDir} onClick={() => toggleSort("size")} />
              <TableHeader name="PnL" sortKey="pnl" curKey={sortKey} curDir={sortDir} onClick={() => toggleSort("pnl")} />
              <th className="px-4 py-3">Strategy</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageData.map((t) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{t.symbol}</td>

                {/* ✔ Direction Label */}
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-white text-xs ${t.direction === "BUY" ? "bg-green-600" : "bg-red-600"}`}>
                    {t.direction}
                  </span>
                </td>

                <td className="px-4 py-3">${t.entry_price}</td>
                <td className="px-4 py-3">${t.exit_price}</td>
                <td className="px-4 py-3">{t.size}</td>

                <td className={`px-4 py-3 ${t.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {t.pnl.toFixed(2)}
                </td>

                <td className="px-4 py-3">{t.strategy || "-"}</td>
                <td className="px-4 py-3 max-w-xs truncate">{t.notes}</td>

                <td className="px-4 py-3">
                  <button className="px-2 py-1 bg-gray-100 rounded" onClick={() => setSelected(t)}>View</button>
                  <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => setEditing(t)}>Edit</button>
                  <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => deleteTrade(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selected && (
        <Modal onClose={() => setSelected(null)} title={`Trade ${selected.id}`}>
          <Row label="Symbol">{selected.symbol}</Row>
          <Row label="Direction">{selected.direction}</Row>
          <Row label="Entry">{selected.entry_price}</Row>
          <Row label="Exit">{selected.exit_price}</Row>
          <Row label="Size">{selected.size}</Row>
          <Row label="PnL">{selected.pnl}</Row>
          <Row label="Notes">{selected.notes}</Row>
        </Modal>
      )}

      {/* Edit Modal */}
      {editing && (
        <Modal onClose={() => setEditing(null)} title="Edit Trade">
          <EditForm trade={editing} onCancel={() => setEditing(null)} onSave={saveEdit} busy={busyAction} />
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------
   Subcomponents
   ------------------------------ */

function TableHeader({ name, sortKey, curKey, curDir, onClick }: any) {
  const active = curKey === sortKey;
  return (
    <th onClick={onClick} className="cursor-pointer px-4 py-3 text-left">
      {name} {active ? (curDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );
}

function Modal({ children, onClose, title }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl">
        <div className="flex justify-between mb-4">
          <h3>{title}</h3>
          <button onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Row({ label, children }: any) {
  return (
    <div className="flex gap-3 mb-2">
      <div className="w-32 text-gray-600">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function EditForm({ trade, onCancel, onSave, busy }: any) {
  const [form, setForm] = useState({ ...trade });

  const set = (k: string, v: any) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <div className="space-y-4">
      <input value={form.symbol} onChange={(e) => set("symbol", e.target.value)} className="p-2 border rounded w-full" />

      {/* Direction Dropdown */}
      <select value={form.direction} onChange={(e) => set("direction", e.target.value)} className="p-2 border rounded w-full">
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>

      <input type="number" value={form.entry_price} onChange={(e) => set("entry_price", parseFloat(e.target.value))} className="p-2 border rounded w-full" />
      <input type="number" value={form.exit_price} onChange={(e) => set("exit_price", parseFloat(e.target.value))} className="p-2 border rounded w-full" />
      <input type="number" value={form.size} onChange={(e) => set("size", parseFloat(e.target.value))} className="p-2 border rounded w-full" />

      <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="p-2 border rounded w-full" />

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button
          onClick={() => onSave(form)}
          disabled={busy}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
