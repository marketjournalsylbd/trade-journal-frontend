// components/TradeTable.tsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

/**
 * Full-featured TradeTable
 * Features:
 * - Fetch /api/trades
 * - Search (symbol, strategy, notes)
 * - Sort by columns (asc/desc)
 * - Pagination
 * - Row details modal
 * - Edit modal (PUT /api/trades/:id)
 * - Delete trade (DELETE /api/trades/:id)
 * - Export visible trades to CSV
 *
 * Notes:
 * - Expects API base in process.env.NEXT_PUBLIC_API_URL
 * - Date fields are displayed as local strings (if present)
 */

type Trade = {
  id: number;
  symbol: string;
  entry_price: number;
  exit_price: number;
  size: number;
  fees: number;
  pnl: number;
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
  const [selected, setSelected] = useState<Trade | null>(null); // detail modal
  const [editing, setEditing] = useState<Trade | null>(null); // edit modal
  const [busyAction, setBusyAction] = useState<boolean>(false);

  // Fetch trades
  const fetchTrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/api/trades`);
      setTrades(res.data || []);
    } catch (err: any) {
      console.error("Fetch trades error:", err);
      setError(err?.response?.data?.detail || err.message || "Failed to load trades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  // Derived: available strategies (for filter dropdown)
  const strategies = useMemo(() => {
    const s = new Set<string>();
    trades.forEach((t) => {
      if (t.strategy) s.add(t.strategy);
    });
    return Array.from(s);
  }, [trades]);

  // Search + filter + sort + paginate pipeline
  const processed = useMemo(() => {
    let out = trades.slice();

    // Search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((t) => {
        return (
          (t.symbol || "").toLowerCase().includes(q) ||
          (t.strategy || "").toLowerCase().includes(q) ||
          (t.notes || "").toLowerCase().includes(q)
        );
      });
    }

    // strategy filter
    if (filterStrategy !== "all") {
      out = out.filter((t) => t.strategy === filterStrategy);
    }

    // sort
    if (sortKey && sortDir) {
      out.sort((a: any, b: any) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av == null && bv == null) return 0;
        if (av == null) return sortDir === "asc" ? -1 : 1;
        if (bv == null) return sortDir === "asc" ? 1 : -1;

        // if numeric
        if (typeof av === "number" && typeof bv === "number") {
          return sortDir === "asc" ? av - bv : bv - av;
        }

        // fallback to string compare
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

  useEffect(() => {
    // ensure page is valid when perPage or processed changes
    if (page > totalPages) setPage(1);
  }, [perPage, totalPages, page]);

  // Sorting toggle helper
  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    if (sortDir === "asc") setSortDir("desc");
    else if (sortDir === "desc") {
      setSortKey(null);
      setSortDir(null);
    } else {
      setSortDir("asc");
    }
  };

  // Export CSV of processed rows (visible/search filtered)
  const exportCSV = () => {
    const rows = processed.map((t) => ({
      id: t.id,
      symbol: t.symbol,
      entry_time: t.entry_time || "",
      exit_time: t.exit_time || "",
      entry_price: t.entry_price,
      exit_price: t.exit_price,
      size: t.size,
      fees: t.fees,
      pnl: t.pnl,
      strategy: t.strategy || "",
      notes: (t.notes || "").replace(/\n/g, " "),
    }));
    const cols = Object.keys(rows[0] || {});
    const csv = [
      cols.join(","),
      ...rows.map((r) => cols.map((c) => JSON.stringify((r as any)[c] ?? "")).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trades_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Delete trade
  const deleteTrade = async (id: number) => {
    if (!confirm("Are you sure you want to delete this trade?")) return;
    setBusyAction(true);
    try {
      await axios.delete(`${API}/api/trades/${id}`);
      await fetchTrades();
      setSelected(null);
      setEditing(null);
    } catch (err: any) {
      alert("Delete failed: " + (err?.response?.data?.detail || err.message));
    } finally {
      setBusyAction(false);
    }
  };

  // Update trade (PUT)
  const saveEdit = async (payload: Partial<Trade> & { id: number }) => {
    setBusyAction(true);
    try {
      await axios.put(`${API}/api/trades/${payload.id}`, payload);
      await fetchTrades();
      setEditing(null);
    } catch (err: any) {
      alert("Save failed: " + (err?.response?.data?.detail || err.message));
    } finally {
      setBusyAction(false);
    }
  };

  // Render helpers
  const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleString() : "-");

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search symbol, strategy or notes..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg border w-72 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <select
            value={filterStrategy}
            onChange={(e) => {
              setFilterStrategy(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg border focus:outline-none"
          >
            <option value="all">All strategies</option>
            {strategies.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setQuery("");
              setFilterStrategy("all");
              setSortKey("exit_price");
              setSortDir("desc");
              setPage(1);
            }}
            className="px-3 py-2 bg-gray-100 rounded-lg border hover:bg-gray-200"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Export CSV
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Per page</span>
            <select
              className="px-2 py-1 border rounded"
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
            >
              {perPageOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow ring-1 ring-black/5 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader
                name="Symbol"
                sortKey="symbol"
                curKey={sortKey}
                curDir={sortDir}
                onClick={() => toggleSort("symbol")}
              />
              <TableHeader
                name="Entry"
                sortKey="entry_price"
                curKey={sortKey}
                curDir={sortDir}
                onClick={() => toggleSort("entry_price")}
              />
              <TableHeader
                name="Exit"
                sortKey="exit_price"
                curKey={sortKey}
                curDir={sortDir}
                onClick={() => toggleSort("exit_price")}
              />
              <TableHeader
                name="Size"
                sortKey="size"
                curKey={sortKey}
                curDir={sortDir}
                onClick={() => toggleSort("size")}
              />
              <TableHeader
                name="Fees"
                sortKey="fees"
                curKey={sortKey}
                curDir={sortDir}
                onClick={() => toggleSort("fees")}
              />
              <TableHeader
                name="PnL"
                sortKey="pnl"
                curKey={sortKey}
                curDir={sortDir}
                onClick={() => toggleSort("pnl")}
              />
              <th className="px-4 py-3 text-left text-sm text-gray-600">Strategy</th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">Notes</th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan={9} className="p-8 text-center">
                  Loading...
                </td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  No trades found
                </td>
              </tr>
            ) : (
              pageData.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{t.symbol}</td>
                  <td className="px-4 py-3">${t.entry_price.toFixed(4)}</td>
                  <td className="px-4 py-3">${t.exit_price.toFixed(4)}</td>
                  <td className="px-4 py-3">{t.size}</td>
                  <td className="px-4 py-3">${(t.fees ?? 0).toFixed(2)}</td>
                  <td className={`px-4 py-3 font-semibold ${t.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {t.pnl.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{t.strategy || "-"}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{t.notes || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(t)}
                        className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setEditing(t)}
                        className="text-sm px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTrade(t.id)}
                        className="text-sm px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <b>{(page - 1) * perPage + 1}</b> to{" "}
          <b>{Math.min(page * perPage, total)}</b> of <b>{total}</b> results
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <div className="px-3 py-1 border rounded">
            Page {page} / {totalPages}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>
      </div>

      {/* Selected modal */}
      {selected && (
        <Modal onClose={() => setSelected(null)} title={`Trade ${selected.id} — ${selected.symbol}`}>
          <div className="space-y-2">
            <Row label="Symbol">{selected.symbol}</Row>
            <Row label="Entry">{`$${selected.entry_price}`}</Row>
            <Row label="Exit">{`$${selected.exit_price}`}</Row>
            <Row label="Size">{selected.size}</Row>
            <Row label="Fees">{`$${(selected.fees ?? 0).toFixed(2)}`}</Row>
            <Row label="PNL">{selected.pnl.toFixed(2)}</Row>
            <Row label="Entry time">{fmtDate(selected.entry_time)}</Row>
            <Row label="Exit time">{fmtDate(selected.exit_time)}</Row>
            <Row label="Strategy">{selected.strategy || "-"}</Row>
            <Row label="Notes">{selected.notes || "-"}</Row>
            <div className="pt-4 flex gap-2">
              <button onClick={() => { setEditing(selected); setSelected(null); }} className="px-4 py-2 bg-blue-600 text-white rounded">Edit</button>
              <button onClick={() => deleteTrade(selected.id)} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit modal */}
      {editing && (
        <Modal onClose={() => setEditing(null)} title={`Edit Trade ${editing.id}`}>
          <EditForm trade={editing} onCancel={() => setEditing(null)} onSave={saveEdit} busy={busyAction} />
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------
   Small subcomponents below
   ------------------------------ */

function TableHeader({
  name,
  sortKey,
  curKey,
  curDir,
  onClick,
}: {
  name: string;
  sortKey: SortKey;
  curKey: SortKey;
  curDir: SortDir;
  onClick: () => void;
}) {
  const active = curKey === sortKey;
  return (
    <th
      onClick={onClick}
      className={`px-4 py-3 text-left text-sm text-gray-600 cursor-pointer select-none ${active ? "font-semibold" : ""}`}
      title={`Sort by ${name}`}
    >
      <div className="flex items-center gap-2">
        <span>{name}</span>
        <SortIcon active={active} dir={curDir} />
      </div>
    </th>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="text-xs text-gray-400">
      {!active || !dir ? (
        <svg className="w-3 h-3 opacity-50" viewBox="0 0 20 20" fill="none">
          <path d="M6 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 13l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : dir === "asc" ? (
        <svg className="w-3 h-3 text-indigo-600" viewBox="0 0 20 20" fill="none">
          <path d="M6 13l4-8 4 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg className="w-3 h-3 text-indigo-600" viewBox="0 0 20 20" fill="none">
          <path d="M6 7l4 8 4-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-10 max-w-3xl w-full bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-36 text-sm text-gray-500">{label}</div>
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
}

function EditForm({
  trade,
  onCancel,
  onSave,
  busy,
}: {
  trade: Trade;
  onCancel: () => void;
  onSave: (payload: Partial<Trade> & { id: number }) => void;
  busy?: boolean;
}) {
  const [form, setForm] = useState<Partial<Trade>>({ ...trade });

  const set = (k: keyof Trade, v: any) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          className="p-2 border rounded"
          value={form.symbol || ""}
          onChange={(e) => set("symbol", e.target.value)}
        />
        <input
          className="p-2 border rounded"
          type="number"
          step="any"
          value={form.entry_price ?? ""}
          onChange={(e) => set("entry_price", Number(e.target.value))}
        />
        <input
          className="p-2 border rounded"
          type="number"
          step="any"
          value={form.exit_price ?? ""}
          onChange={(e) => set("exit_price", Number(e.target.value))}
        />
        <input
          className="p-2 border rounded"
          type="number"
          step="any"
          value={form.size ?? ""}
          onChange={(e) => set("size", Number(e.target.value))}
        />
        <input
          className="p-2 border rounded"
          type="number"
          step="any"
          value={form.fees ?? ""}
          onChange={(e) => set("fees", Number(e.target.value))}
        />
        <input
          className="p-2 border rounded"
          value={form.strategy ?? ""}
          onChange={(e) => set("strategy", e.target.value)}
        />
      </div>

      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        value={form.notes ?? ""}
        onChange={(e) => set("notes", e.target.value)}
      />

      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded border" disabled={busy}>
          Cancel
        </button>
        <button
          onClick={() =>
            onSave({
              id: trade.id,
              symbol: form.symbol ?? trade.symbol,
              entry_price: Number(form.entry_price ?? trade.entry_price),
              exit_price: Number(form.exit_price ?? trade.exit_price),
              size: Number(form.size ?? trade.size),
              fees: Number(form.fees ?? trade.fees ?? 0),
              strategy: form.strategy ?? trade.strategy,
              notes: form.notes ?? trade.notes,
            })
          }
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          disabled={busy}
        >
          {busy ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}