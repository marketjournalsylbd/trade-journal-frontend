import React, { useState } from "react";
import axios from "axios";

export default function AddTrade({ onAdded }: { onAdded: () => void }) {
  const [symbol, setSymbol] = useState("");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [qty, setQty] = useState("");
  const [notes, setNotes] = useState("");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY"); // ✅ NEW

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const submitTrade = async () => {
    if (!symbol || !entry || !exit || !qty) {
      setMsg("All fields required.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/api/add-trade`, {
        symbol,
        entry_price: parseFloat(entry),
        exit_price: parseFloat(exit),
        size: parseFloat(qty),
        side, // ✅ NEW field
        fees: 0,
        strategy: "",
        notes,
        entry_time: new Date().toISOString(),
        exit_time: new Date().toISOString(),
      });

      setMsg("Trade added successfully!");
      onAdded();

      setSymbol("");
      setEntry("");
      setExit("");
      setQty("");
      setNotes("");
      setSide("BUY");

    } catch (err) {
      console.error(err);
      setMsg("Failed to add trade.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200">
      <h3 className="text-xl font-bold mb-4">➕ Add Trade</h3>

      <div className="space-y-3">

        {/* Trade Side Selector */}
        <div className="flex gap-3">
          <button
            onClick={() => setSide("BUY")}
            className={`flex-1 p-3 rounded-xl border font-semibold transition 
              ${side === "BUY"
                ? "bg-green-500 text-white border-green-600"
                : "bg-white border-gray-300 text-gray-700"
              }`}
          >
            BUY
          </button>

          <button
            onClick={() => setSide("SELL")}
            className={`flex-1 p-3 rounded-xl border font-semibold transition
              ${side === "SELL"
                ? "bg-red-500 text-white border-red-600"
                : "bg-white border-gray-300 text-gray-700"
              }`}
          >
            SELL
          </button>
        </div>

        <input
          placeholder="Symbol (e.g., EURUSD)"
          className="w-full p-3 rounded-xl border"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />

        <input
          placeholder="Entry Price"
          type="number"
          className="w-full p-3 rounded-xl border"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />

        <input
          placeholder="Exit Price"
          type="number"
          className="w-full p-3 rounded-xl border"
          value={exit}
          onChange={(e) => setExit(e.target.value)}
        />

        <input
          placeholder="Quantity"
          type="number"
          className="w-full p-3 rounded-xl border"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <textarea
          placeholder="Notes (optional)"
          className="w-full p-3 rounded-xl border"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button
        onClick={submitTrade}
        disabled={loading}
        className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        {loading ? "Saving..." : "Add Trade"}
      </button>

      {msg && <p className="mt-3 text-center text-sm text-gray-700">{msg}</p>}
    </div>
  );
}
